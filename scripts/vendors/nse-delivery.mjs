/**
 * NSE delivery-data adapter.
 *
 * Yahoo Finance carries no delivery figures, so the delivery-based tables come
 * straight from NSE's official full bhavcopy
 * (`sec_bhavdata_full_DDMMYYYY.csv`), which publishes DELIV_QTY and DELIV_PER
 * per security per session.
 *
 * We walk back day by day, skipping weekends and holidays (the archive simply
 * 404s on non-trading days), until enough sessions are in hand. Everything is
 * derived arithmetic on published numbers — nothing is estimated.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const ARCHIVE = 'https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const C = (key, label, type) => ({ key, label, type });
const num = (v) => {
  const n = Number(String(v ?? '').trim().replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const k = (n) => +(n / 1000).toFixed(2); // thousands, as the exchange reports them

const pad = (n) => String(n).padStart(2, '0');
const ddmmyyyy = (d) => `${pad(d.getUTCDate())}${pad(d.getUTCMonth() + 1)}${d.getUTCFullYear()}`;
const label = (d) =>
  `${pad(d.getUTCDate())}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]}-${d.getUTCFullYear()}`;

/** Parses one bhavcopy CSV into a Map of EQ-series rows keyed by symbol. */
function parse(csv) {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const head = lines[0].split(',').map((h) => h.trim());
  const ix = Object.fromEntries(head.map((h, i) => [h, i]));
  const out = new Map();
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(',');
    if (c.length < head.length) continue;
    const series = (c[ix.SERIES] ?? '').trim();
    if (series !== 'EQ' && series !== 'BE') continue;
    const symbol = (c[ix.SYMBOL] ?? '').trim();
    if (!symbol) continue;
    out.set(symbol, {
      symbol,
      close: num(c[ix.CLOSE_PRICE]),
      last: num(c[ix.LAST_PRICE]),
      prevClose: num(c[ix.PREV_CLOSE]),
      traded: num(c[ix.TTL_TRD_QNTY]),
      deliv: num(c[ix.DELIV_QTY]),
      delivPct: num(c[ix.DELIV_PER]),
      turnover: num(c[ix.TURNOVER_LACS]),
    });
  }
  return out.size ? out : null;
}

/**
 * Fetches the most recent `want` trading sessions, newest first.
 * @returns {Promise<Array<{date: Date, stamp: string, rows: Map}>>}
 */
export async function sessions(want = 6, lookback = 20) {
  const found = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  for (let back = 0; back <= lookback && found.length < want; back++) {
    const d = new Date(cursor.getTime() - back * 86400000);
    const day = d.getUTCDay();
    if (day === 0 || day === 6) continue; // weekend — archive has nothing
    try {
      const r = await fetch(ARCHIVE + ddmmyyyy(d) + '.csv', {
        headers: { 'User-Agent': UA, Referer: 'https://www.nseindia.com/', Accept: 'text/csv,*/*' },
        signal: AbortSignal.timeout(45000),
      });
      if (!r.ok) continue; // holiday or not yet published
      const rows = parse(await r.text());
      if (rows) {
        found.push({ date: d, stamp: label(d), rows });
        await sleep(250);
      }
    } catch {
      /* transient — try the next date */
    }
  }
  return found;
}

/** Securities liquid enough that delivery ratios mean something. */
const LIQUID = (r) => r.traded >= 50_000 && r.close > 0;

export function buildDatasets(days) {
  if (!days.length) return [];
  const sets = [];
  const [d0, d1, d2] = days;
  const stamp = d0.stamp;

  /* ---- Highest & lowest delivery ---------------------------------- */
  const liquid = [...d0.rows.values()].filter((r) => LIQUID(r) && r.deliv > 0);
  if (liquid.length) {
    const byPct = [...liquid].sort((a, b) => b.delivPct - a.delivPct);
    const row = (r) => ({
      company: r.symbol,
      traded: k(r.traded),
      deliv: k(r.deliv),
      delivPct: +r.delivPct.toFixed(2),
      last: +r.close.toFixed(2),
    });
    sets.push({
      slug: 'highest-lowest-delivery',
      title: 'Highest & Lowest Delivery',
      group: 'equity',
      blurb: `Delivery-to-traded ratio across liquid NSE securities for ${stamp} — the 20 highest and the 20 lowest.`,
      columns: [
        C('company', 'Company Name', 'text'), C('traded', "Traded Volume (000's)", 'num'),
        C('deliv', "Delivery Volume (000's)", 'num'), C('delivPct', 'Del to Trd Vol (%)', 'num'),
        C('last', 'Last Price (₹)', 'num'),
      ],
      rows: [...byPct.slice(0, 20), ...byPct.slice(-20)].map(row),
      defaultSort: 'delivPct',
    });
  }

  /* ---- Delivery shockers (needs two sessions) --------------------- */
  if (d1) {
    const shock = [];
    // A jump measured against a near-zero base is arithmetic noise, not a
    // shocker — a newly listed ETF going from 12k to 16m shares reads as
    // +129,000% and buries every genuine signal. Require a real prior base.
    const MIN_PRIOR_DELIVERY = 25_000;
    for (const r of d0.rows.values()) {
      if (!LIQUID(r) || r.deliv <= 0) continue;
      const p = d1.rows.get(r.symbol);
      if (!p || p.deliv < MIN_PRIOR_DELIVERY) continue;
      const chg = r.deliv - p.deliv;
      const pct = (chg / p.deliv) * 100;
      if (!Number.isFinite(pct)) continue;
      shock.push({
        company: r.symbol,
        deliv: k(r.deliv),
        prevDeliv: k(p.deliv),
        change: k(chg),
        chgPct: +pct.toFixed(2),
        price: +r.close.toFixed(2),
        priceChgPct: p.close ? +(((r.close - p.close) / p.close) * 100).toFixed(2) : 0,
      });
    }
    shock.sort((a, b) => b.chgPct - a.chgPct);
    if (shock.length) {
      sets.push({
        slug: 'delivery-shockers',
        title: 'Delivery Shockers',
        group: 'equity',
        blurb: `Securities whose delivery volume jumped hardest between ${d1.stamp} and ${stamp}.`,
        columns: [
          C('company', 'Company Name', 'text'), C('deliv', "Delivery Qty (000's)", 'num'),
          C('prevDeliv', "Prev. Delivery Qty (000's)", 'num'), C('change', "Change (000's)", 'change'),
          C('chgPct', 'Change (%)', 'pct'), C('price', 'Price (₹)', 'num'),
          C('priceChgPct', 'Price Change (%)', 'pct'),
        ],
        rows: shock.slice(0, 30),
        defaultSort: 'chgPct',
      });
    }
  }

  /* ---- Rising / falling volume, delivery & price (three sessions) -- */
  if (d1 && d2) {
    const rising = [];
    const falling = [];
    for (const r of d0.rows.values()) {
      if (!LIQUID(r)) continue;
      const b = d1.rows.get(r.symbol);
      const a = d2.rows.get(r.symbol);
      if (!b || !a || !a.deliv || !b.deliv || !r.deliv) continue;
      const volUp = a.traded < b.traded && b.traded < r.traded;
      const delUp = a.deliv < b.deliv && b.deliv < r.deliv;
      if (!volUp || !delUp) continue;
      const priceUp = a.close < b.close && b.close < r.close;
      const priceDown = a.close > b.close && b.close > r.close;
      if (!priceUp && !priceDown) continue;
      const row = {
        company: r.symbol,
        d1Qty: k(a.traded), d1Del: k(a.deliv), d1Price: +a.close.toFixed(2),
        d2Qty: k(b.traded), d2Del: k(b.deliv), d2Price: +b.close.toFixed(2),
        d3Qty: k(r.traded), d3Del: k(r.deliv), d3Price: +r.close.toFixed(2),
        chgPct: +(((r.close - a.close) / a.close) * 100).toFixed(2),
      };
      (priceUp ? rising : falling).push(row);
    }
    const cols = [
      C('company', 'Company Name', 'text'),
      C('d1Qty', `${d2.stamp} Traded Qty`, 'num'), C('d1Del', `${d2.stamp} Del Vol`, 'num'), C('d1Price', `${d2.stamp} Price`, 'num'),
      C('d2Qty', `${d1.stamp} Traded Qty`, 'num'), C('d2Del', `${d1.stamp} Del Vol`, 'num'), C('d2Price', `${d1.stamp} Price`, 'num'),
      C('d3Qty', `${d0.stamp} Traded Qty`, 'num'), C('d3Del', `${d0.stamp} Del Vol`, 'num'), C('d3Price', `${d0.stamp} Price`, 'num'),
      C('chgPct', 'Change (%)', 'pct'),
    ];
    if (rising.length) {
      rising.sort((a, b) => b.chgPct - a.chgPct);
      sets.push({
        slug: 'rising-vdp',
        title: 'Rising Volume, Delivery & Price',
        group: 'equity',
        blurb: 'Securities where traded volume, delivery volume and price all rose for three straight sessions — accumulation with conviction.',
        columns: cols, rows: rising.slice(0, 30), defaultSort: 'chgPct',
      });
    }
    if (falling.length) {
      falling.sort((a, b) => a.chgPct - b.chgPct);
      sets.push({
        slug: 'rising-vd-falling-price',
        title: 'Rising VD, Fall in Price',
        group: 'equity',
        blurb: 'Volume and delivery climbing three sessions running while the price fell — distribution rather than accumulation.',
        columns: cols, rows: falling.slice(0, 30), defaultSort: 'chgPct',
      });
    }
  }

  /* ---- Five-session performance ----------------------------------- */
  const back5 = days[5] ?? days[days.length - 1];
  if (back5 && back5 !== d0 && d1) {
    const perf = [];
    for (const r of d0.rows.values()) {
      if (!LIQUID(r) || r.turnover < 100) continue; // ≥ ₹1 crore turnover
      const old = back5.rows.get(r.symbol);
      if (!old || !old.close) continue;
      perf.push({
        company: r.symbol,
        close: +r.close.toFixed(2),
        prev: +r.prevClose.toFixed(2),
        ago: +old.close.toFixed(2),
        chgPct: +(((r.close - old.close) / old.close) * 100).toFixed(2),
      });
    }
    perf.sort((a, b) => b.chgPct - a.chgPct);
    if (perf.length) {
      sets.push({
        slug: 'five-days-up-and-down',
        title: '5 Days Up & Down',
        group: 'equity',
        blurb: `Best and worst performers between ${back5.stamp} and ${stamp} — the 20 strongest and 20 weakest.`,
        columns: [
          C('company', 'Company Name', 'text'), C('close', "Day's Closing Price (₹)", 'num'),
          C('prev', 'Prev Close (₹)', 'num'), C('ago', '5 Days Ago (₹)', 'num'),
          C('chgPct', '5 Days Return (%)', 'pct'),
        ],
        rows: [...perf.slice(0, 20), ...perf.slice(-20)],
        defaultSort: 'chgPct',
      });
    }
  }

  return sets;
}
