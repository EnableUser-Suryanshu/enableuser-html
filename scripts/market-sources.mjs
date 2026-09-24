/**
 * Every market dataset, grouped by the upstream call that produces it.
 *
 * This module is the single source of truth for market data and is imported by
 * two very different callers:
 *
 *   scripts/fetch-market-data.mjs   builds the whole snapshot at deploy time
 *   app/api/markets/[slug]/route.ts refetches ONE group per request, live
 *
 * Grouping matters: a request for "gainers-and-losers" must not drag in six
 * bhavcopy CSVs and a 1.6 MB AMFI file. Each group declares only the upstream
 * calls it needs plus a `ttl` matched to how fast that data genuinely moves —
 * index levels tick through the session, delivery figures publish once a day.
 *
 * Nothing here touches the filesystem, so it bundles cleanly into a serverless
 * function.
 */
import * as delivery from './vendors/nse-delivery.mjs';
import * as corporate from './vendors/corporate.mjs';
import * as cnbc from './vendors/cnbc.mjs';
import * as yahoo from './vendors/yahoo.mjs';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const BASE = 'https://www.nseindia.com';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const num = (v) => {
  if (v === null || v === undefined || v === '-' || v === '') return 0;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const C = (key, label, type) => ({ key, label, type });

/* ------------------------------------------------------------- NSE client */

/**
 * NSE rejects cold requests, so every client primes a cookie from the homepage
 * first and re-primes once on failure. One client per build or per request.
 */
export function createNse() {
  let cookie = '';

  async function prime() {
    try {
      const r = await fetch(BASE + '/', {
        headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
        signal: AbortSignal.timeout(15000),
      });
      cookie = (r.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ');
    } catch {
      /* carry on cookieless; the call below will retry */
    }
  }

  async function get(path) {
    if (!cookie) await prime();
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(BASE + path, {
          headers: {
            'User-Agent': UA,
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            Referer: BASE + '/',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          signal: AbortSignal.timeout(20000),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return await r.json();
      } catch (e) {
        if (attempt === 2) {
          console.warn(`  ! ${path} -> ${e.message}`);
          return null;
        }
        await prime();
        await sleep(700);
      }
    }
    return null;
  }

  return { get, prime, cookie: () => cookie };
}

/** SENSEX from BSE's real-time endpoint, shaped like an NSE index row. */
export async function bseSensex() {
  try {
    const r = await fetch('https://api.bseindia.com/RealTimeBseIndiaAPI/api/GetSensexData/w', {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json',
        Referer: 'https://www.bseindia.com/',
        Origin: 'https://www.bseindia.com',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return null;
    const row = (await r.json())?.[0];
    const close = num(row?.ltp);
    if (!close) return null;
    return {
      index: 'S&P BSE SENSEX',
      close,
      prev: num(row.Prev_Close),
      open: num(row.I_open),
      high: num(row.High),
      low: num(row.Low),
      chgPct: num(row.perchg),
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------- builders */

async function buildIndices(nse) {
  const KEY_IDX = ['NIFTY 50', 'NIFTY NEXT 50', 'NIFTY BANK', 'NIFTY IT', 'NIFTY AUTO', 'NIFTY FMCG',
    'NIFTY PHARMA', 'NIFTY METAL', 'NIFTY REALTY', 'NIFTY ENERGY', 'NIFTY MIDCAP 100', 'NIFTY SMALLCAP 100'];
  const [indices, sensex] = await Promise.all([nse.get('/api/allIndices'), bseSensex()]);
  if (!indices?.data?.length) return [];

  const byName = new Map(indices.data.map((r) => [r.index, r]));
  const rows = KEY_IDX.map((n) => byName.get(n)).filter(Boolean).map((r) => ({
    index: r.index, close: num(r.last), prev: num(r.previousClose),
    open: num(r.open), high: num(r.high), low: num(r.low), chgPct: num(r.percentChange),
  }));
  if (sensex) rows.unshift(sensex);

  const breadth = indices.data
    .filter((r) => num(r.advances) + num(r.declines) > 0)
    .slice(0, 18)
    .map((r) => ({ group: r.index, adv: num(r.advances), dec: num(r.declines),
      unch: num(r.unchanged), ratio: num(r.declines) ? +(num(r.advances) / num(r.declines)).toFixed(2) : 0 }));

  return [
    { slug: 'live-indices', title: 'Live Indices', group: 'equity',
      blurb: 'Benchmark and sectoral index levels — SENSEX from BSE, the rest live from NSE.',
      columns: [C('index', 'Index', 'text'), C('close', 'Last', 'num'), C('prev', 'Prev Close', 'num'),
        C('open', 'Open', 'num'), C('high', 'High', 'num'), C('low', 'Low', 'num'), C('chgPct', 'Change (%)', 'pct')],
      rows, defaultSort: 'chgPct',
      meta: { timestamp: indices.timestamp } },
    { slug: 'advances-and-declines', title: 'Advances & Declines', group: 'equity',
      blurb: 'Market breadth by index — how many constituents rose versus fell.',
      columns: [C('group', 'Index', 'text'), C('adv', 'Advanced', 'num'), C('dec', 'Declined', 'num'),
        C('unch', 'Unchanged', 'num'), C('ratio', 'A/D Ratio', 'num')],
      rows: breadth, defaultSort: 'ratio' },
  ];
}

const mv = (o) => (o?.allSec?.data ?? o?.NIFTY?.data ?? []);
const mapMove = (r) => ({
  company: r.symbol, last: num(r.ltp), prev: num(r.prev_price),
  chgPct: num(r.perChange ?? r.net_price),
  chg: +(num(r.ltp) - num(r.prev_price)).toFixed(2),
  high: num(r.high_price), low: num(r.low_price),
  vol: +(num(r.trade_quantity) / 1000).toFixed(2),
});

async function buildMovers(nse) {
  const [gainers, losers, indices] = await Promise.all([
    nse.get('/api/live-analysis-variations?index=gainers'),
    nse.get('/api/live-analysis-variations?index=loosers'),
    nse.get('/api/allIndices'),
  ]);
  const gRows = mv(gainers), lRows = mv(losers);
  if (!gRows.length && !lRows.length) return [];

  const cols = [C('company', 'Symbol', 'text'), C('last', 'Last Price (₹)', 'num'), C('prev', 'Prev Close (₹)', 'num'),
    C('chgPct', 'Change (%)', 'pct'), C('chg', 'Change (₹)', 'change'), C('high', 'High (₹)', 'num'),
    C('low', 'Low (₹)', 'num'), C('vol', 'Volume (’000s)', 'num')];
  const out = [
    { slug: 'gainers-and-losers', title: 'Gainers & Losers', group: 'equity',
      blurb: 'Biggest movers of the session across all NSE securities.',
      columns: cols, rows: [...gRows.slice(0, 15), ...lRows.slice(0, 15)].map(mapMove), defaultSort: 'chgPct' },
  ];

  const bench = num(indices?.data?.find((r) => r.index === 'NIFTY 50')?.percentChange);
  out.push({ slug: 'out-and-under-performers', title: 'Out & Under Performers', group: 'equity',
    blurb: `Stocks beating or lagging the NIFTY 50 (benchmark ${bench >= 0 ? '+' : ''}${bench}% today).`,
    columns: [C('company', 'Symbol', 'text'), C('last', 'Last Price (₹)', 'num'), C('chgPct', 'Stock Change (%)', 'pct'),
      C('bench', 'NIFTY 50 (%)', 'pct'), C('outperf', 'Out/Under Performed By (%)', 'pct')],
    rows: [...gRows.slice(0, 12), ...lRows.slice(0, 12)].map((r) => {
      const m = mapMove(r);
      return { company: m.company, last: m.last, chgPct: m.chgPct, bench, outperf: +(m.chgPct - bench).toFixed(2) };
    }), defaultSort: 'outperf' });

  out.push({ slug: 'price-shockers', title: 'Price Shockers', group: 'equity',
    blurb: 'Sharpest absolute price moves in the session, up or down.',
    columns: [C('company', 'Symbol', 'text'), C('last', 'Last Price (₹)', 'num'), C('prev', 'Prev Close (₹)', 'num'),
      C('chg', 'Change (₹)', 'change'), C('chgPct', 'Change (%)', 'pct'), C('vol', 'Volume (’000s)', 'num')],
    rows: [...gRows, ...lRows].map(mapMove).sort((a, b) => Math.abs(b.chgPct) - Math.abs(a.chgPct)).slice(0, 20),
    defaultSort: 'chgPct' });

  const circuit = [...(gainers?.SecGtr20?.data ?? []), ...(losers?.SecLwr20?.data ?? [])].map(mapMove);
  if (circuit.length) {
    out.push({ slug: 'only-buyers-and-sellers', title: 'Only Buyers & Sellers', group: 'equity',
      blurb: 'Securities moving beyond 20% — typically locked with buyers or sellers only.',
      columns: cols, rows: circuit, defaultSort: 'chgPct' });
  }
  return out;
}

const maRow = (r) => ({
  company: r.symbol, last: num(r.lastPrice), prev: num(r.previousClose ?? r.prevClose),
  chgPct: num(r.pChange ?? r.perChange),
  qty: +(num(r.quantityTraded ?? r.totalTradedVolume) / 1000).toFixed(2),
  value: +(num(r.totalTurnover ?? r.turnover)).toFixed(2),
});
const maCols = [C('company', 'Symbol', 'text'), C('last', 'Last Price (₹)', 'num'), C('prev', 'Prev Close (₹)', 'num'),
  C('chgPct', 'Change (%)', 'pct'), C('qty', 'Volume (’000s)', 'num'), C('value', 'Turnover (₹ Lakh)', 'num')];

async function buildActive(nse) {
  const [vol, val] = await Promise.all([
    nse.get('/api/live-analysis-most-active-securities?index=volume'),
    nse.get('/api/live-analysis-most-active-securities?index=value'),
  ]);
  const out = [];
  if (vol?.data?.length) {
    out.push({ slug: 'most-active', title: 'Most Active by Volume', group: 'equity',
      blurb: 'Counters seeing the heaviest traded volume today.',
      columns: maCols, rows: vol.data.map(maRow), defaultSort: 'qty' });
    out.push({ slug: 'volume-shockers', title: 'Volume Leaders', group: 'equity',
      blurb: 'Highest traded quantity on NSE in the current session.',
      columns: maCols, rows: vol.data.map(maRow), defaultSort: 'qty' });
  }
  if (val?.data?.length) {
    out.push({ slug: 'most-active-value', title: 'Most Active by Value', group: 'equity',
      blurb: 'Counters with the largest rupee turnover today.',
      columns: maCols, rows: val.data.map(maRow), defaultSort: 'value' });
  }
  return out;
}

const hiRow = (r) => ({
  company: r.symbol, last: num(r.ltp ?? r.lastPrice), yHigh: num(r.new52WHL ?? r.yearHigh),
  prevHigh: num(r.prev52WHL ?? r.prevHigh), date: r.prev52WHLDate ?? r.date52WHL ?? '—',
  chgPct: num(r.pChange ?? r.perChange),
});

async function buildHighsLows(nse) {
  const [high52, low52] = await Promise.all([
    nse.get('/api/live-analysis-data-52weekhighstock'),
    nse.get('/api/live-analysis-data-52weeklowstock'),
  ]);
  const out = [];
  if (high52?.data?.length) {
    out.push({ slug: 'highs-and-lows', title: '52-Week Highs', group: 'equity',
      blurb: 'Stocks that touched a fresh 52-week high today.',
      columns: [C('company', 'Symbol', 'text'), C('last', 'Last Price (₹)', 'num'), C('yHigh', 'New 52W High (₹)', 'num'),
        C('prevHigh', 'Prev 52W High (₹)', 'num'), C('date', 'Prev High Date', 'date'), C('chgPct', 'Change (%)', 'pct')],
      rows: high52.data.slice(0, 40).map(hiRow), defaultSort: 'chgPct' });
  }
  if (low52?.data?.length) {
    out.push({ slug: 'fifty-two-week-lows', title: '52-Week Lows', group: 'equity',
      blurb: 'Stocks that touched a fresh 52-week low today.',
      columns: [C('company', 'Symbol', 'text'), C('last', 'Last Price (₹)', 'num'), C('yHigh', 'New 52W Low (₹)', 'num'),
        C('prevHigh', 'Prev 52W Low (₹)', 'num'), C('date', 'Prev Low Date', 'date'), C('chgPct', 'Change (%)', 'pct')],
      rows: low52.data.slice(0, 40).map(hiRow), defaultSort: 'chgPct' });
  }
  return out;
}

const dealRow = (r) => ({
  company: r.symbol || r.name, date: r.date || r.BD_DT_DATE || '—',
  client: r.clientName || r.BD_CLIENT_NAME || '—',
  deal: (r.buySell || r.BD_BUY_SELL || '—'),
  qty: +(num(r.quantityTraded ?? r.BD_QTY_TRD) / 1000).toFixed(2),
  price: num(r.tradePrice ?? r.BD_TP_WATP),
});
const dealCols = [C('company', 'Symbol', 'text'), C('date', 'Date', 'date'), C('client', 'Client Name', 'text'),
  C('deal', 'Deal Type', 'tag'), C('qty', 'Qty (’000s)', 'num'), C('price', 'Trade Price (₹)', 'num')];

async function buildDeals(nse) {
  const deals = await nse.get('/api/snapshot-capital-market-largedeal');
  const out = [];
  if (deals?.BULK_DEALS_DATA?.length) {
    out.push({ slug: 'bulk-deals', title: 'Bulk Deals', group: 'equity',
      blurb: 'Trades above 0.5% of a company’s listed equity, reported to NSE.',
      columns: dealCols, rows: deals.BULK_DEALS_DATA.slice(0, 40).map(dealRow) });
  }
  if (deals?.BLOCK_DEALS_DATA?.length) {
    out.push({ slug: 'block-deals', title: 'Block Deals', group: 'equity',
      blurb: 'Large negotiated trades executed in the NSE block window.',
      columns: dealCols, rows: deals.BLOCK_DEALS_DATA.slice(0, 40).map(dealRow) });
  }
  if (deals?.SHORT_DEALS_DATA?.length) {
    out.push({ slug: 'short-selling', title: 'Short Selling', group: 'equity',
      blurb: 'Securities-wise short selling positions reported to the exchange.',
      columns: [C('company', 'Symbol', 'text'), C('date', 'Date', 'date'), C('qty', 'Qty (’000s)', 'num')],
      rows: deals.SHORT_DEALS_DATA.slice(0, 40).map((r) => ({
        company: r.symbol || r.name, date: r.date || '—',
        qty: +(num(r.quantityTraded ?? r.SS_QTY) / 1000).toFixed(2) })) });
  }
  return out;
}

async function buildCorpActions(nse) {
  const corpActions = await nse.get('/api/corporates-corporateActions?index=equities');
  const out = [];
  if (Array.isArray(corpActions) && corpActions.length) {
    const ca = corpActions.map((r) => ({
      company: r.comp, symbol: r.symbol, subject: r.subject || '—',
      exDate: r.exDate || '—', recDate: r.recDate || '—', faceVal: r.faceVal || '—',
    }));
    const pick = (re) => ca.filter((r) => re.test(r.subject));
    const caCols = [C('symbol', 'Symbol', 'text'), C('company', 'Company', 'text'),
      C('subject', 'Purpose', 'text'), C('exDate', 'Ex Date', 'date'), C('recDate', 'Record Date', 'date')];

    out.push({ slug: 'corporate-actions', title: 'All Corporate Actions', group: 'corporate',
      blurb: 'Every upcoming corporate action filed with NSE.', columns: caCols, rows: ca });
    const push = (re, slug, title, blurb) => {
      const rows = pick(re);
      if (rows.length) out.push({ slug, title, group: 'corporate', blurb, columns: caCols, rows });
    };
    push(/dividend/i, 'dividend-details', 'Dividend Details', 'Declared dividends with ex-dates and record dates.');
    push(/bonus/i, 'bonus-issues', 'Bonus Issues', 'Free additional shares announced for existing holders.');
    push(/right/i, 'rights-issues', 'Right Issues', 'Rights offers open to existing shareholders.');
    push(/split|face value/i, 'split-of-face-value', 'Split of Face Value', 'Face-value splits that increase share count and liquidity.');
    push(/buy ?back/i, 'buyback', 'Buybacks', 'Share buyback offers announced by listed companies.');
  }
  const bookClosure = await corporate.buildBookClosure(corpActions);
  if (bookClosure) out.push(bookClosure);
  return out;
}

async function buildBoardMeetings(nse) {
  const boardMtgs = await nse.get('/api/event-calendar');
  if (!Array.isArray(boardMtgs) || !boardMtgs.length) return [];
  return [{
    slug: 'board-meetings', title: 'Board Meetings', group: 'corporate',
    blurb: 'Upcoming board meetings and the business scheduled.',
    columns: [C('symbol', 'Symbol', 'text'), C('company', 'Company', 'text'),
      C('date', 'Meeting Date', 'date'), C('purpose', 'Purpose', 'text')],
    rows: boardMtgs.slice(0, 60).map((r) => ({
      symbol: r.symbol, company: r.company, date: r.date || '—',
      purpose: (r.purpose || '—').replace(/\s+/g, ' ').slice(0, 90) })),
  }];
}

async function buildFiiDii(nse) {
  const fiidii = await nse.get('/api/fiidiiTradeReact');
  if (!Array.isArray(fiidii) || !fiidii.length) return [];
  const cols = [C('date', 'Reporting Date', 'date'), C('buy', 'Buy Value (₹ Cr)', 'num'),
    C('sale', 'Sell Value (₹ Cr)', 'num'), C('net', 'Net Value (₹ Cr)', 'change')];
  const mk = (cat) => fiidii.filter((r) => r.category?.includes(cat)).map((r) => ({
    date: r.date, buy: num(r.buyValue), sale: num(r.sellValue), net: num(r.netValue) }));
  const out = [];
  const f = mk('FII'), d = mk('DII');
  if (f.length) out.push({ slug: 'fii-investments', title: 'FII / FPI Investments', group: 'institutional',
    blurb: 'Foreign institutional cash-market flows reported by NSE.', columns: cols, rows: f });
  if (d.length) out.push({ slug: 'dii-investments', title: 'DII Investments', group: 'institutional',
    blurb: 'Domestic institutional cash-market flows reported by NSE.', columns: cols, rows: d });
  return out;
}

async function buildIpo(nse) {
  /*
   * Three separate questions an investor actually asks, from three NSE
   * endpoints:
   *   what is open now, and how well is it subscribed   /api/ipo-current-issue
   *   what is coming                     /api/all-upcoming-issues?category=ipo
   *   what just listed                            /api/public-past-issues
   *
   * The current-issue feed is the only one carrying subscription, which is
   * the number people are checking for — it is a live multiple of the shares
   * offered, so it moves through the day while an issue is open.
   */
  const [current, upcoming, past] = await Promise.all([
    nse.get('/api/ipo-current-issue').catch(() => null),
    nse.get('/api/all-upcoming-issues?category=ipo').catch(() => null),
    nse.get('/api/public-past-issues').catch(() => null),
  ]);

  const out = [];
  const name = (r) => r.companyName || r.company || r.symbol || '—';
  // "Rs.32 to Rs.34" reads better without the repetition.
  const band = (v) => (typeof v === 'string' ? v.replace(/Rs\./g, '₹').replace(/\s+to\s+/, ' – ') : '—');

  if (Array.isArray(current) && current.length) {
    out.push({
      slug: 'ipo-current-issues', title: 'IPOs Open Now', group: 'ipo',
      blurb: 'Public issues accepting bids today, with live subscription.',
      columns: [C('company', 'Company', 'text'), C('symbol', 'Symbol', 'text'),
        C('band', 'Price Band', 'text'), C('open', 'Opens', 'date'), C('close', 'Closes', 'date'),
        C('subscribed', 'Subscribed (times)', 'num'), C('offered', 'Shares Offered', 'num')],
      rows: current.map((r) => ({
        company: name(r), symbol: r.symbol || '—', band: band(r.issuePrice),
        open: r.issueStartDate || '—', close: r.issueEndDate || '—',
        subscribed: num(r.noOfTime), offered: num(r.noOfSharesOffered) })),
      defaultSort: 'close',
    });
  }

  /*
   * The upcoming feed includes issues that are already open — NSE marks those
   * "Active" and the genuinely future ones "Forthcoming". Without this filter
   * the two columns show the same six companies, which is how it first went
   * out.
   */
  const forthcoming = Array.isArray(upcoming)
    ? upcoming.filter((r) => String(r.status).toLowerCase() === 'forthcoming')
    : [];

  if (forthcoming.length) {
    out.push({
      slug: 'ipo-upcoming', title: 'Upcoming IPOs', group: 'ipo',
      blurb: 'Issues announced on NSE that have not opened yet.',
      columns: [C('company', 'Company', 'text'), C('symbol', 'Symbol', 'text'),
        C('series', 'Series', 'tag'), C('band', 'Price Band', 'text'),
        C('open', 'Opens', 'date'), C('close', 'Closes', 'date'), C('size', 'Issue Size', 'num')],
      rows: forthcoming.map((r) => ({
        company: name(r), symbol: r.symbol || '—', series: r.series || 'EQ',
        band: band(r.issuePrice), open: r.issueStartDate || '—',
        close: r.issueEndDate || '—', size: num(r.issueSize) })),
      defaultSort: 'open',
    });
  }

  if (Array.isArray(past) && past.length) {
    // The feed runs back years; only what has actually listed, most recent first.
    const listed = past
      .filter((r) => r.listingDate && r.listingDate !== '-' && (r.companyName || r.company))
      .slice(0, 40);
    if (listed.length) {
      out.push({
        slug: 'ipo-recently-listed', title: 'Recently Listed', group: 'ipo',
        blurb: 'Issues that have completed and started trading.',
        columns: [C('company', 'Company', 'text'), C('symbol', 'Symbol', 'text'),
          C('type', 'Type', 'tag'), C('band', 'Price Band', 'text'),
          C('issuePrice', 'Issue Price (₹)', 'num'), C('listed', 'Listed On', 'date')],
        rows: listed.map((r) => ({
          company: name(r), symbol: r.symbol || '—', type: r.securityType || 'EQ',
          band: band(r.priceRange), issuePrice: num(r.issuePrice), listed: r.listingDate })),
        defaultSort: 'listed',
      });
    }
  }

  return out;
}

async function buildFutures(nse) {
  const futures = await nse.get('/api/liveEquity-derivatives?index=nse50_fut');
  if (!futures?.data?.length) return [];
  return [{
    slug: 'futures', title: 'Index Futures', group: 'derivatives',
    blurb: 'Live NIFTY futures contracts with expiry-wise pricing.',
    columns: [C('contract', 'Contract', 'text'), C('expiry', 'Expiry', 'date'), C('last', 'Last Price (₹)', 'num'),
      C('chgPct', 'Change (%)', 'pct'), C('open', 'Open (₹)', 'num'), C('high', 'High (₹)', 'num'),
      C('low', 'Low (₹)', 'num'), C('oi', 'Open Interest', 'num')],
    rows: futures.data.map((r) => ({
      contract: r.contract || r.identifier, expiry: r.expiryDate, last: num(r.lastPrice),
      chgPct: num(r.pChange), open: num(r.openPrice), high: num(r.highPrice),
      low: num(r.lowPrice), oi: num(r.openInterest) })),
    defaultSort: 'expiry',
  }];
}

async function buildDelivery() {
  const days = await delivery.sessions(6);
  return days.length ? delivery.buildDatasets(days) : [];
}

async function buildAnnouncements(nse) {
  const d = await corporate.buildAnnouncements(nse?.cookie?.() ?? '');
  return d ? [d] : [];
}

async function buildReference() {
  const out = await Promise.all([
    corporate.buildChangeOfName(),
    corporate.buildDelisted(),
    corporate.buildFundProfile(),
  ]);
  return out.filter(Boolean);
}

/**
 * Global quotes. Yahoo is preferred but blocks datacenter egress outright, so
 * CNBC (which does not) supplies anything Yahoo could not — see vendors/cnbc.mjs.
 */
async function buildGlobal({ tryYahoo = true } = {}) {
  const out = [];
  const have = new Set();
  if (tryYahoo) {
    try {
      for (const d of await yahoo.buildDatasets({ budgetMs: 60_000 })) { out.push(d); have.add(d.slug); }
    } catch { /* fall through to CNBC */ }
  }
  if (have.size < 4) {
    try {
      const [sets, fx] = await Promise.all([cnbc.buildDatasets(), cnbc.buildCurrency()]);
      for (const d of [...sets, fx]) {
        if (d && !have.has(d.slug)) { out.push(d); have.add(d.slug); }
      }
    } catch { /* leave what we have */ }
  }
  return out;
}

/* -------------------------------------------------------------- registry */

/**
 * `ttl` is the browser/CDN cache lifetime in seconds, chosen from how often the
 * upstream actually changes — not from how often someone might refresh.
 */
export const GROUPS = [
  { id: 'indices',       ttl: 45,   needsNse: true,  build: buildIndices },
  { id: 'movers',        ttl: 45,   needsNse: true,  build: buildMovers },
  { id: 'active',        ttl: 60,   needsNse: true,  build: buildActive },
  { id: 'highs-lows',    ttl: 120,  needsNse: true,  build: buildHighsLows },
  { id: 'futures',       ttl: 60,   needsNse: true,  build: buildFutures },
  { id: 'deals',         ttl: 600,  needsNse: true,  build: buildDeals },
  { id: 'corp-actions',  ttl: 900,  needsNse: true,  build: buildCorpActions },
  { id: 'board-meetings', ttl: 900, needsNse: true,  build: buildBoardMeetings },
  { id: 'fii-dii',       ttl: 900,  needsNse: true,  build: buildFiiDii },
  { id: 'ipo',           ttl: 900,  needsNse: true,  build: buildIpo },
  { id: 'announcements', ttl: 300,  needsNse: true,  build: buildAnnouncements },
  { id: 'global',        ttl: 60,   needsNse: false, build: buildGlobal },
  { id: 'delivery',      ttl: 3600, needsNse: false, build: buildDelivery },
  { id: 'reference',     ttl: 3600, needsNse: false, build: buildReference },
];

/** slug → group id. Built once from a static map so a request can route in O(1). */
export const SLUG_GROUP = {
  'live-indices': 'indices', 'advances-and-declines': 'indices',
  'gainers-and-losers': 'movers', 'out-and-under-performers': 'movers',
  'price-shockers': 'movers', 'only-buyers-and-sellers': 'movers',
  'most-active': 'active', 'volume-shockers': 'active', 'most-active-value': 'active',
  'highs-and-lows': 'highs-lows', 'fifty-two-week-lows': 'highs-lows',
  futures: 'futures',
  'bulk-deals': 'deals', 'block-deals': 'deals', 'short-selling': 'deals',
  'corporate-actions': 'corp-actions', 'dividend-details': 'corp-actions',
  'bonus-issues': 'corp-actions', 'rights-issues': 'corp-actions',
  'split-of-face-value': 'corp-actions', buyback: 'corp-actions', 'book-closure': 'corp-actions',
  'board-meetings': 'board-meetings',
  'fii-investments': 'fii-dii', 'dii-investments': 'fii-dii',
  'ipo-current-issues': 'ipo', 'ipo-upcoming': 'ipo', 'ipo-recently-listed': 'ipo',
  'exchange-announcements': 'announcements',
  'world-indices': 'global', 'adr-prices': 'global',
  'mcx-commodities': 'global', 'currency-quotes': 'global',
  'highest-lowest-delivery': 'delivery', 'delivery-shockers': 'delivery',
  'five-days-up-and-down': 'delivery', 'rising-vdp': 'delivery',
  'rising-vd-falling-price': 'delivery',
  'change-of-name': 'reference', 'delisted-companies': 'reference', 'fund-profile': 'reference',
};

export const groupFor = (slug) => GROUPS.find((g) => g.id === SLUG_GROUP[slug]) ?? null;

/**
 * Runs one group and returns its datasets. Used by the live API route.
 *
 * `fast` skips the Yahoo attempt in the global group. Yahoo refuses datacenter
 * egress, so on a hosted request it can only ever burn seconds before the
 * circuit breaker trips — the deploy-time build still tries it, in case this
 * ever runs from an ordinary connection.
 *
 * @param {string} id
 * @param {{ nse?: ReturnType<typeof createNse>, fast?: boolean }} [opts]
 */
export async function buildOneGroup(id, { nse, fast = false } = {}) {
  const g = GROUPS.find((x) => x.id === id);
  if (!g) return [];
  // Pass undefined, not null — `build` uses destructuring defaults, which only
  // apply to undefined.
  const arg = g.needsNse ? nse ?? createNse() : g.id === 'global' ? { tryYahoo: !fast } : undefined;
  return (await g.build(arg)) ?? [];
}

/** NSE's own market-status feed — drives the Open/Closed pill and the stamp. */
export async function marketStatus(nse) {
  const status = await (nse ?? createNse()).get('/api/marketStatus');
  const cm = status?.marketState?.find((m) => m.market === 'Capital Market');
  return {
    marketStatus: cm?.marketStatus ?? 'Unknown',
    marketTimestamp: cm?.tradeDate ?? new Date().toISOString(),
  };
}

/** Everything, for the deploy-time snapshot. Groups run in parallel. */
export async function buildAll({ log = () => {} } = {}) {
  const nse = createNse();
  await nse.prime();

  const results = await Promise.all(
    GROUPS.map(async (g) => {
      try {
        const sets = await g.build(g.needsNse ? nse : undefined);
        log(`  ✓ ${g.id}: ${sets.length} dataset(s)`);
        return sets ?? [];
      } catch (e) {
        log(`  ! ${g.id} failed: ${e.message}`);
        return [];
      }
    }),
  );

  const sets = [];
  for (const d of results.flat()) {
    const i = sets.findIndex((s) => s.slug === d.slug);
    if (i >= 0) sets[i] = d;
    else sets.push(d);
  }
  return { sets, status: await marketStatus(nse) };
}
