/**
 * TrueData licensed exchange-feed adapter.
 *
 * TrueData (truedata.in) is an authorised real-time data vendor for
 * NSE EQ / NSE FO / NSE INDICES / BSE EQ / BSE FO / BSE INDICES / MCX.
 *
 * API surface (verified against the live endpoints):
 *   auth     POST https://auth.truedata.in/token
 *            body: grant_type=password&username=…&password=…
 *            ->  { access_token, expires_in, token_type: "bearer" }
 *   bars     GET  https://history.truedata.in/getbars
 *            ?symbol=RELIANCE&from=YYMMDDTHH:MM:SS&to=…&response=json&interval=1day
 *            headers: Authorization: Bearer <token>
 *            ->  { status: "Success", Records: [[time,open,high,low,close,volume,oi], …] }
 *   ticks    GET  https://history.truedata.in/getticks   (same auth)
 *
 * Credentials come from the environment — never commit them:
 *   TRUEDATA_USERNAME=…      TRUEDATA_PASSWORD=…
 * Optional:
 *   TRUEDATA_HISTORY_URL     (default https://history.truedata.in)
 *   TRUEDATA_AUTH_URL        (default https://auth.truedata.in/token)
 */

const AUTH_URL = process.env.TRUEDATA_AUTH_URL || 'https://auth.truedata.in/token';
const HISTORY_URL = (process.env.TRUEDATA_HISTORY_URL || 'https://history.truedata.in').replace(/\/$/, '');

export const isConfigured = () =>
  Boolean(process.env.TRUEDATA_USERNAME && process.env.TRUEDATA_PASSWORD);

let token = null;
let tokenExpiry = 0;

/** OAuth2 password-grant login; token is cached for its lifetime. */
export async function authenticate() {
  if (token && Date.now() < tokenExpiry) return token;
  const body = new URLSearchParams({
    grant_type: 'password',
    username: process.env.TRUEDATA_USERNAME,
    password: process.env.TRUEDATA_PASSWORD,
  });
  const r = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(20000),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) {
    throw new Error(
      `TrueData auth failed (HTTP ${r.status}): ${j.error_description || j.error || 'no token returned'}`,
    );
  }
  token = j.access_token;
  tokenExpiry = Date.now() + Math.max((Number(j.expires_in) || 3600) - 120, 60) * 1000;
  return token;
}

const stamp = (d) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`;
};

/**
 * Last N daily bars for one symbol.
 * Returns [{ time, open, high, low, close, volume, oi }] newest-last.
 */
export async function getBars(symbol, { days = 10, interval = '1day' } = {}) {
  const tk = await authenticate();
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 3600 * 1000);
  const url =
    `${HISTORY_URL}/getbars?symbol=${encodeURIComponent(symbol)}` +
    `&from=${stamp(from)}&to=${stamp(to)}&response=json&interval=${interval}`;

  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${tk}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(25000),
  });
  if (!r.ok) throw new Error(`getbars ${symbol} -> HTTP ${r.status}`);
  const j = await r.json();

  // TrueData returns { status, Records: [[t,o,h,l,c,v,oi], …] }.
  // Some deployments return { Records: [{time, open, …}] } — handle both.
  const recs = j?.Records ?? j?.records ?? [];
  if (!Array.isArray(recs)) return [];
  return recs
    .map((row) =>
      Array.isArray(row)
        ? { time: row[0], open: +row[1], high: +row[2], low: +row[3], close: +row[4], volume: +row[5] || 0, oi: +row[6] || 0 }
        : { time: row.time ?? row.timestamp, open: +row.open, high: +row.high, low: +row.low, close: +row.close, volume: +(row.volume ?? 0), oi: +(row.oi ?? 0) },
    )
    .filter((b) => Number.isFinite(b.close));
}

/**
 * Builds a quote (LTP, prev close, change, day range, volume) from the last
 * two daily bars. `label` is what the UI displays.
 */
export async function getQuote(symbol, label = symbol) {
  const bars = await getBars(symbol, { days: 12 });
  if (bars.length === 0) return null;
  const last = bars[bars.length - 1];
  const prev = bars.length > 1 ? bars[bars.length - 2] : last;
  const chg = last.close - prev.close;
  return {
    symbol: label,
    last: +last.close.toFixed(2),
    prev: +prev.close.toFixed(2),
    chg: +chg.toFixed(2),
    chgPct: prev.close ? +((chg / prev.close) * 100).toFixed(2) : 0,
    open: +last.open.toFixed(2),
    high: +last.high.toFixed(2),
    low: +last.low.toFixed(2),
    vol: +(last.volume / 1000).toFixed(2),
    oi: last.oi,
    time: last.time,
    /** Closing series for sparklines. */
    series: bars.map((b) => +b.close.toFixed(2)),
  };
}

/** Fetches many symbols with limited concurrency so the feed isn't hammered. */
export async function getQuotes(entries, { concurrency = 4 } = {}) {
  const out = [];
  const queue = [...entries];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      const { symbol, label } = typeof item === 'string' ? { symbol: item, label: item } : item;
      try {
        const q = await getQuote(symbol, label);
        if (q) out.push(q);
      } catch (e) {
        console.warn(`  ! TrueData ${symbol}: ${e.message}`);
      }
    }
  });
  await Promise.all(workers);
  return out;
}

/* ------------------------------------------------------------------ *
 * Symbol universes. Adjust to match the client's TrueData subscription.
 * ------------------------------------------------------------------ */

export const NSE_INDICES = [
  { symbol: 'NIFTY 50', label: 'NIFTY 50' },
  { symbol: 'NIFTY BANK', label: 'NIFTY BANK' },
  { symbol: 'NIFTY IT', label: 'NIFTY IT' },
  { symbol: 'NIFTY AUTO', label: 'NIFTY AUTO' },
  { symbol: 'NIFTY FMCG', label: 'NIFTY FMCG' },
  { symbol: 'NIFTY PHARMA', label: 'NIFTY PHARMA' },
  { symbol: 'NIFTY METAL', label: 'NIFTY METAL' },
  { symbol: 'NIFTY REALTY', label: 'NIFTY REALTY' },
];

export const BSE_INDICES = [
  { symbol: 'SENSEX', label: 'BSE SENSEX' },
  { symbol: 'BSE100', label: 'BSE 100' },
  { symbol: 'BSE500', label: 'BSE 500' },
  { symbol: 'BSEMIDCAP', label: 'BSE MIDCAP' },
  { symbol: 'BSESMLCAP', label: 'BSE SMALLCAP' },
];

/** MCX commodity futures — the segment NSE's public API cannot provide. */
export const MCX_COMMODITIES = [
  { symbol: 'GOLD-I', label: 'Gold' },
  { symbol: 'SILVER-I', label: 'Silver' },
  { symbol: 'CRUDEOIL-I', label: 'Crude Oil' },
  { symbol: 'NATURALGAS-I', label: 'Natural Gas' },
  { symbol: 'COPPER-I', label: 'Copper' },
  { symbol: 'ZINC-I', label: 'Zinc' },
  { symbol: 'ALUMINIUM-I', label: 'Aluminium' },
  { symbol: 'LEAD-I', label: 'Lead' },
  { symbol: 'NICKEL-I', label: 'Nickel' },
  { symbol: 'GOLDM-I', label: 'Gold Mini' },
  { symbol: 'SILVERM-I', label: 'Silver Mini' },
  { symbol: 'MENTHAOIL-I', label: 'Mentha Oil' },
];

export const CURRENCY_FUTURES = [
  { symbol: 'USDINR-I', label: 'USD / INR' },
  { symbol: 'EURINR-I', label: 'EUR / INR' },
  { symbol: 'GBPINR-I', label: 'GBP / INR' },
  { symbol: 'JPYINR-I', label: 'JPY / INR' },
];

const C = (key, label, type) => ({ key, label, type });

const QUOTE_COLS = [
  C('symbol', 'Symbol', 'text'), C('last', 'Last Price (₹)', 'num'),
  C('prev', 'Prev Close (₹)', 'num'), C('chgPct', 'Change (%)', 'pct'),
  C('chg', 'Change (₹)', 'change'), C('open', 'Open (₹)', 'num'),
  C('high', 'High (₹)', 'num'), C('low', 'Low (₹)', 'num'),
];

/**
 * Builds every dataset TrueData can serve. Each is returned only when the
 * feed actually answered, so a partial outage degrades gracefully.
 */
export async function buildDatasets() {
  const out = [];

  const mcx = await getQuotes(MCX_COMMODITIES);
  if (mcx.length) {
    out.push({
      slug: 'mcx-commodities', title: 'MCX Commodity Futures', group: 'commodity',
      blurb: 'Live bullion, energy and base-metal futures from MCX.',
      columns: [...QUOTE_COLS, C('vol', 'Volume (’000s)', 'num')],
      rows: mcx.map(({ series, oi, time, ...r }) => r), defaultSort: 'chgPct',
      vendor: 'TrueData (MCX)',
    });
  }

  const bse = await getQuotes(BSE_INDICES);
  if (bse.length) {
    out.push({
      slug: 'bse-indices', title: 'BSE Indices', group: 'equity',
      blurb: 'Live SENSEX and BSE broad-market index levels.',
      columns: [C('symbol', 'Index', 'text'), C('last', 'Last', 'num'), C('prev', 'Prev Close', 'num'),
        C('chgPct', 'Change (%)', 'pct'), C('open', 'Open', 'num'), C('high', 'High', 'num'), C('low', 'Low', 'num')],
      rows: bse.map(({ series, oi, time, vol, chg, ...r }) => r), defaultSort: 'chgPct',
      vendor: 'TrueData (BSE Indices)',
    });
  }

  const fx = await getQuotes(CURRENCY_FUTURES);
  if (fx.length) {
    out.push({
      slug: 'currency-quotes', title: 'Currency Futures', group: 'currency',
      blurb: 'Live exchange-traded currency futures (NSE CDS).',
      columns: QUOTE_COLS, rows: fx.map(({ series, oi, time, vol, ...r }) => r),
      defaultSort: 'chgPct', vendor: 'TrueData (NSE CDS)',
    });
  }

  return out;
}
