/**
 * CNBC quote adapter — the fallback for everything Yahoo Finance serves.
 *
 * Yahoo's API refuses datacenter egress outright (HTTP 429 in under 100ms from
 * both Vercel's build container and its serverless runtime), so it can never be
 * the source for a hosted build. CNBC's public quote service answers from the
 * same hosts, batches many symbols per request, and returns the identical
 * figures — its S&P 500 print matches Yahoo's to the paisa.
 *
 * Values arrive as display strings ("7,757.64", "+0.62%"), so everything is
 * parsed back to numbers here. A symbol CNBC does not recognise comes back with
 * a non-zero `code` and is dropped rather than guessed at.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const ENDPOINT = 'https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const C = (key, label, type) => ({ key, label, type });

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** CNBC's "2026-08-07" → "07-Aug-2026", matching every other table on the site. */
function fmtDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s ?? ''));
  if (!m) return String(s ?? '').trim() || '—';
  return `${m[3]}-${MONTHS[+m[2] - 1]}-${m[1]}`;
}

/** "7,757.64" → 7757.64 · "+0.62%" → 0.62 · "" / "-" / undefined → null */
function n(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).replace(/[,%\s+]/g, '');
  if (!s || s === '-' || s === 'UNCH') return null;
  const x = Number(s);
  return Number.isFinite(x) ? x : null;
}

/** One batched request. CNBC pipes symbols, and 25 per call is comfortable. */
async function batch(symbols) {
  const url =
    `${ENDPOINT}?symbols=${symbols.map(encodeURIComponent).join('|')}` +
    `&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json', Referer: 'https://www.cnbc.com/' },
        signal: AbortSignal.timeout(25000),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      const raw = j?.FormattedQuoteResult?.FormattedQuote ?? [];
      return Array.isArray(raw) ? raw : [raw];
    } catch {
      await sleep(1200 * (attempt + 1));
    }
  }
  return [];
}

/**
 * Resolves a symbol list to a Map of symbol → normalised quote.
 * Only quotes with `code === 0` and a usable last price are kept.
 */
export async function quotes(symbols, label) {
  const out = new Map();
  for (let i = 0; i < symbols.length; i += 25) {
    if (i) await sleep(400);
    for (const q of await batch(symbols.slice(i, i + 25))) {
      if (!q || Number(q.code) !== 0) continue;
      const last = n(q.last);
      if (last === null) continue;
      const prev = n(q.previous_day_closing);
      out.set(q.symbol, {
        symbol: q.symbol,
        name: q.name || q.shortName || q.symbol,
        last,
        prev,
        open: n(q.open),
        high: n(q.high),
        low: n(q.low),
        change: n(q.change) ?? (prev !== null ? +(last - prev).toFixed(4) : null),
        chgPct: n(q.change_pct) ?? (prev ? +(((last - prev) / prev) * 100).toFixed(2) : null),
        currency: q.currencyCode || '',
        exchange: q.exchange || '',
        date: fmtDate(q.last_time || q.last_timedate),
        yrHigh: n(q.yrhiprice),
        yrLow: n(q.yrloprice),
      });
    }
  }
  if (label) console.log(`    ${label}: ${out.size}/${symbols.length} symbols`);
  return out;
}

/* ------------------------------------------------------------- universes */

const WORLD = [
  ['United States', 'S&P 500', '.SPX'],
  ['United States', 'Dow Jones Industrial Average', '.DJI'],
  ['United States', 'NASDAQ Composite', '.IXIC'],
  ['United Kingdom', 'FTSE 100', '.FTSE'],
  ['Germany', 'DAX', '.GDAXI'],
  ['France', 'CAC 40', '.FCHI'],
  ['Japan', 'Nikkei 225', '.N225'],
  ['Hong Kong', 'Hang Seng', '.HSI'],
  ['China', 'Shanghai Composite', '.SSEC'],
  ['South Korea', 'KOSPI', '.KS11'],
  ['Australia', 'S&P/ASX 200', '.AXJO'],
  ['Canada', 'S&P/TSX Composite', '.GSPTSE'],
  ['Brazil', 'Bovespa', '.BVSP'],
  ['India', 'NIFTY 50', '.NSEI'],
  ['India', 'NIFTY Bank', '.NSEBANK'],
];

const ADRS = [
  ['INFY', 'Infosys Ltd'],
  ['WIT', 'Wipro Ltd'],
  ['HDB', 'HDFC Bank Ltd'],
  ['IBN', 'ICICI Bank Ltd'],
  ['RDY', "Dr. Reddy's Laboratories Ltd"],
  ['SIFY', 'Sify Technologies Ltd'],
  ['MMYT', 'MakeMyTrip Ltd'],
  ['YTRA', 'Yatra Online Inc'],
];

/**
 * Front-month international futures. MCX bullion and energy contracts settle
 * against these benchmarks; CNBC labels each with its exchange and contract
 * month, both of which are carried through to the table so nothing reads as an
 * MCX quote.
 */
const COMMODITIES = [
  ['Gold', '@GC.1'],
  ['Silver', '@SI.1'],
  ['Copper', '@HG.1'],
  ['Platinum', '@PL.1'],
  ['WTI Crude Oil', '@CL.1'],
  ['Brent Crude', '@BZ.1'],
  ['Natural Gas', '@NG.1'],
];

/* -------------------------------------------------------------- builders */

export async function buildDatasets() {
  const sets = [];

  /* ---- World indices ---- */
  const world = await quotes(WORLD.map((w) => w[2]), 'world indices');
  const worldRows = WORLD.map(([country, name, sym]) => {
    const q = world.get(sym);
    if (!q || q.prev === null) return null;
    return {
      country,
      index: name,
      date: q.date,
      value: q.last,
      prev: q.prev,
      high: q.high ?? 0,
      low: q.low ?? 0,
      change: q.change ?? 0,
      chgPct: q.chgPct ?? 0,
    };
  }).filter(Boolean);
  if (worldRows.length) {
    sets.push({
      slug: 'world-indices',
      title: 'World Indices',
      group: 'institutional',
      blurb: 'Global benchmark levels, the move against the previous close and the day’s trading range.',
      columns: [
        C('country', 'Country', 'text'), C('index', 'Index', 'text'), C('date', 'Reporting Date', 'date'),
        C('value', 'Current Value', 'num'), C('prev', 'Previous Close', 'num'),
        C('high', 'High', 'num'), C('low', 'Low', 'num'),
        C('change', 'Net Change', 'change'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: worldRows,
      defaultSort: 'chgPct',
      vendor: 'CNBC market data',
    });
  }

  /* ---- ADR prices ---- */
  const adr = await quotes(ADRS.map((a) => a[0]), 'ADRs');
  const adrRows = ADRS.map(([sym, name]) => {
    const q = adr.get(sym);
    if (!q) return null;
    return {
      symbol: sym,
      company: name,
      date: q.date,
      ltp: q.last,
      prev: q.prev ?? 0,
      chgPct: q.chgPct ?? 0,
    };
  }).filter(Boolean);
  if (adrRows.length) {
    sets.push({
      slug: 'adr-prices',
      title: 'ADR Prices',
      group: 'institutional',
      blurb: 'Indian companies trading as depositary receipts on the NYSE and NASDAQ, priced in US dollars.',
      columns: [
        C('symbol', 'Symbol', 'text'), C('company', 'Company Name', 'text'), C('date', 'Date', 'date'),
        C('ltp', 'LTP ($)', 'num'), C('prev', 'Prev Close ($)', 'num'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: adrRows,
      defaultSort: 'chgPct',
      vendor: 'CNBC market data',
    });
  }

  /* ---- Commodity benchmarks ---- */
  const com = await quotes(COMMODITIES.map((c) => c[1]), 'commodities');
  const comRows = COMMODITIES.map(([name, sym]) => {
    const q = com.get(sym);
    if (!q) return null;
    // CNBC names carry the venue and contract month, e.g. "Gold COMEX (Dec'26)".
    const m = /\(([^)]+)\)\s*$/.exec(q.name);
    return {
      commodity: name,
      contract: m ? m[1] : '—',
      venue: q.name.replace(/\s*\([^)]*\)\s*$/, '').replace(new RegExp(`^${name}\\s*`, 'i'), '').trim() || q.exchange || '—',
      last: q.last,
      prev: q.prev ?? 0,
      change: q.change ?? 0,
      chgPct: q.chgPct ?? 0,
    };
  }).filter(Boolean);
  if (comRows.length) {
    sets.push({
      slug: 'mcx-commodities',
      title: 'Commodity Benchmarks',
      group: 'commodity',
      blurb:
        'Front-month international bullion, energy and base-metal futures — the benchmarks MCX contracts settle against. Prices are in US dollars, not rupees.',
      columns: [
        C('commodity', 'Commodity', 'text'), C('venue', 'Exchange', 'text'), C('contract', 'Contract', 'tag'),
        C('last', 'Last ($)', 'num'), C('prev', 'Prev Close ($)', 'num'),
        C('change', 'Change', 'change'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: comRows,
      defaultSort: 'chgPct',
      vendor: 'CNBC market data',
    });
  }

  return sets;
}

/**
 * Rupee reference rates from the ECB via frankfurter.app — free, keyless and
 * reachable from datacenter IPs, unlike most FX APIs.
 */
export async function buildCurrency() {
  const majors = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD', 'CNY', 'HKD'];
  const fetchDay = async (extra = '') => {
    try {
      const r = await fetch(`https://api.frankfurter.app/${extra || 'latest'}?from=INR&to=${majors.join(',')}`, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  };

  const today = await fetchDay();
  if (!today?.rates) return null;
  // Frankfurter's "latest" is the last ECB publication; step back for a prior
  // reference so the table can show a change rather than a bare level.
  const prevDay = await fetchDay(
    new Date(new Date(today.date).getTime() - 4 * 86400000).toISOString().slice(0, 10),
  );

  const rows = majors
    .map((code) => {
      const perInr = today.rates[code];
      if (!perInr) return null;
      const rate = +(1 / perInr).toFixed(4); // rupees per unit of foreign currency
      const p = prevDay?.rates?.[code];
      const prev = p ? +(1 / p).toFixed(4) : null;
      return {
        pair: `${code} / INR`,
        rate,
        prev: prev ?? 0,
        change: prev ? +(rate - prev).toFixed(4) : 0,
        chgPct: prev ? +(((rate - prev) / prev) * 100).toFixed(2) : 0,
      };
    })
    .filter(Boolean);
  if (!rows.length) return null;

  return {
    slug: 'currency-quotes',
    title: 'Currency Rates',
    group: 'currency',
    blurb: `Rupees per unit of each major currency, from the European Central Bank reference rates published ${today.date}${prevDay?.date ? ` (compared with ${prevDay.date})` : ''}.`,
    columns: [
      C('pair', 'Currency Pair', 'text'), C('rate', 'Rate (₹)', 'num'), C('prev', 'Prev (₹)', 'num'),
      C('change', 'Change', 'change'), C('chgPct', 'Change (%)', 'pct'),
    ],
    rows,
    defaultSort: 'chgPct',
    vendor: 'ECB via frankfurter.app',
  };
}
