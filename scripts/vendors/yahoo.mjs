/**
 * Yahoo Finance adapter.
 *
 * Yahoo's quote API needs a crumb, which is itself rate-limited, so this
 * adapter uses the two endpoints that do not: `finance/spark` for batched
 * quotes (up to 25 symbols per request) and `v8/finance/chart` per symbol to
 * fill gaps and supply the day's high/low, which spark omits.
 *
 * Yahoo rate-limits hard per IP (HTTP 429). Three things keep a build under
 * that ceiling: batching, an adaptive pacer that widens after every throttle
 * and eases back in on a run of clean responses, and a circuit breaker that
 * abandons the phase early if the IP is in a penalty box.
 *
 * Every failure is survivable. A symbol that cannot be fetched is dropped, a
 * dataset with no rows is left out entirely, and the caller carries the
 * previous snapshot forward — clearly labelled — rather than publishing
 * invented numbers.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const HOSTS = ['query1', 'query2'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const C = (key, label, type) => ({ key, label, type });

let cookie = '';
let hostIdx = 0;

/* --------------------------------------------------------------- pacing --
 * Yahoo tolerates roughly one call every couple of seconds. `gap` adapts:
 * +60% on every throttle, -10% after five consecutive clean calls.
 */
const MIN_GAP = 1600;
const MAX_GAP = 9000;
let gap = 2300;
let clean = 0;

/* Circuit breaker: if Yahoo throttles this IP repeatedly and nothing at all
 * gets through, stop early rather than spending the whole budget on 429s. */
let consecutiveThrottles = 0;
let anySuccess = false;
const THROTTLE_LIMIT = 12;
const tripped = () => !anySuccess && consecutiveThrottles >= THROTTLE_LIMIT;

function throttled() {
  gap = Math.min(MAX_GAP, Math.round(gap * 1.6));
  clean = 0;
  consecutiveThrottles++;
}
function succeeded() {
  anySuccess = true;
  consecutiveThrottles = 0;
  if (++clean >= 5) {
    gap = Math.max(MIN_GAP, Math.round(gap * 0.9));
    clean = 0;
  }
}

/** Wall-clock budget for the whole Yahoo phase, so a bad day can't hang a build. */
let deadline = Infinity;
const outOfTime = () => Date.now() > deadline;

export function isConfigured() {
  return true; // public endpoint — no credentials required
}

/** Picks up the A1/A3 cookies Yahoo sets on a normal quote page view. */
export async function session() {
  try {
    const r = await fetch('https://finance.yahoo.com/quote/AAPL/', {
      headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(20000),
    });
    const set = r.headers.getSetCookie?.() ?? [];
    cookie = [...new Set(set.map((c) => c.split(';')[0]))].join('; ');
  } catch {
    /* cookieless still works, just throttles sooner */
  }
  return cookie;
}

/**
 * One `v8/finance/chart` call, alternating hosts and backing off on 429.
 * Returns the raw `chart.result[0]` or null.
 */
async function chart(symbol, range = '1d', interval = '1d') {
  const backoff = [4000, 9000, 18000, 30000];
  for (let attempt = 0; attempt <= backoff.length; attempt++) {
    if (outOfTime() || tripped()) return null;
    const host = HOSTS[hostIdx++ % HOSTS.length];
    const url =
      `https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
      `?range=${range}&interval=${interval}`;
    try {
      const r = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://finance.yahoo.com/',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if (r.status === 429) {
        throttled();
        if (attempt < backoff.length) await sleep(backoff[attempt]);
        continue;
      }
      if (!r.ok) return null; // 404 delisted symbol etc — no point retrying
      const j = await r.json();
      succeeded();
      return j?.chart?.result?.[0] ?? null;
    } catch {
      if (attempt < backoff.length) await sleep(backoff[attempt]);
    }
  }
  return null;
}

/** Flattens a chart result into the fields every dataset here needs. */
function toQuote(res) {
  if (!res?.meta) return null;
  const m = res.meta;
  const price = m.regularMarketPrice;
  const prev = m.chartPreviousClose ?? m.previousClose;
  if (!Number.isFinite(price) || !Number.isFinite(prev) || prev === 0) return null;
  const q = res.indicators?.quote?.[0] ?? {};
  const vols = (q.volume ?? []).filter((v) => Number.isFinite(v));
  return {
    symbol: m.symbol,
    name: m.longName || m.shortName || m.symbol,
    price,
    prev,
    change: +(price - prev).toFixed(4),
    chgPct: +(((price - prev) / prev) * 100).toFixed(2),
    high: Number.isFinite(m.regularMarketDayHigh) ? m.regularMarketDayHigh : null,
    low: Number.isFinite(m.regularMarketDayLow) ? m.regularMarketDayLow : null,
    volume: vols.length ? vols[vols.length - 1] : Number(m.regularMarketVolume) || 0,
    currency: m.currency || '',
    exchange: m.fullExchangeName || m.exchangeName || '',
    time: m.regularMarketTime ? new Date(m.regularMarketTime * 1000) : null,
  };
}

/**
 * Batch quotes via `finance/spark`, which accepts many symbols per request and
 * needs no crumb. One call for 25 symbols instead of 25 calls is the single
 * biggest thing that keeps us under Yahoo's rate limit.
 *
 * Yahoo has shipped two response shapes for this endpoint over the years, so
 * both are handled; anything unrecognised just returns an empty map and the
 * caller falls back to per-symbol chart calls.
 */
async function spark(symbols) {
  const out = new Map();
  const url =
    `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbols.join(','))}` +
    `&range=1d&interval=1d`;
  const backoff = [4000, 9000, 18000];
  for (let attempt = 0; attempt <= backoff.length; attempt++) {
    if (outOfTime() || tripped()) return out;
    try {
      const r = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://finance.yahoo.com/',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        signal: AbortSignal.timeout(25000),
      });
      if (r.status === 429) {
        throttled();
        if (attempt < backoff.length) await sleep(backoff[attempt]);
        continue;
      }
      if (!r.ok) return out;
      const j = await r.json();
      succeeded();

      // Shape A: { spark: { result: [ { symbol, response: [ chartResult ] } ] } }
      const results = j?.spark?.result;
      if (Array.isArray(results)) {
        for (const entry of results) {
          const q = toQuote(entry?.response?.[0]);
          if (q) out.set(entry.symbol ?? q.symbol, q);
        }
        return out;
      }
      // Shape B: { "^GSPC": { symbol, close: [...], chartPreviousClose, ... } }
      for (const [sym, v] of Object.entries(j ?? {})) {
        if (!v || typeof v !== 'object') continue;
        const closes = (v.close ?? []).filter((c) => Number.isFinite(c));
        const price = Number.isFinite(v.regularMarketPrice)
          ? v.regularMarketPrice
          : closes[closes.length - 1];
        const prev = v.chartPreviousClose ?? v.previousClose;
        if (!Number.isFinite(price) || !Number.isFinite(prev) || !prev) continue;
        out.set(sym, {
          symbol: sym,
          name: sym,
          price,
          prev,
          change: +(price - prev).toFixed(4),
          chgPct: +(((price - prev) / prev) * 100).toFixed(2),
          high: null,
          low: null,
          volume: 0,
          currency: v.currency ?? '',
          exchange: v.exchange ?? '',
          time: v.timestamp?.length ? new Date(v.timestamp[v.timestamp.length - 1] * 1000) : null,
        });
      }
      return out;
    } catch {
      if (attempt < backoff.length) await sleep(backoff[attempt]);
    }
  }
  return out;
}

/**
 * Resolves a symbol list: one batched spark call first, then individual chart
 * calls for whatever the batch missed (spark omits high/low, so index tables
 * that need a day range top up from chart regardless).
 */
async function quotes(symbols, label, { needRange = false } = {}) {
  const out = new Map();

  if (!needRange) {
    for (let i = 0; i < symbols.length; i += 25) {
      if (outOfTime() || tripped()) break;
      if (i) await sleep(gap);
      for (const [k, v] of await spark(symbols.slice(i, i + 25))) out.set(k, v);
    }
  }

  const missing = symbols.filter((s) => !out.has(s));
  let n = 0;
  for (const sym of missing) {
    if (outOfTime() || tripped()) break;
    if (n++) await sleep(gap);
    const q = toQuote(await chart(sym));
    if (q) out.set(sym, q);
  }

  if (label) {
    const via = needRange ? 'chart' : `spark+${missing.length} chart`;
    console.log(`    ${label}: ${out.size}/${symbols.length} symbols (${via}, pace ${gap}ms)`);
  }
  return out;
}

/** Historical daily closes — used for the 5-session performance table. */
async function history(symbol, range = '1mo') {
  const res = await chart(symbol, range, '1d');
  const closes = res?.indicators?.quote?.[0]?.close;
  const stamps = res?.timestamp;
  if (!Array.isArray(closes) || !Array.isArray(stamps)) return null;
  const bars = [];
  for (let i = 0; i < stamps.length; i++) {
    if (Number.isFinite(closes[i])) bars.push({ t: stamps[i] * 1000, close: closes[i] });
  }
  return bars.length ? bars : null;
}

const fmtDate = (d) =>
  d
    ? `${String(d.getUTCDate()).padStart(2, '0')}-${
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]
      }-${d.getUTCFullYear()}`
    : '—';

/* ------------------------------------------------------------- universes */

/** Country label → Yahoo index symbol, mirroring the main site's World Indices page. */
const WORLD = [
  ['United States', 'S&P 500', '^GSPC'],
  ['United States', 'Dow Jones Industrial Average', '^DJI'],
  ['United States', 'NASDAQ Composite', '^IXIC'],
  ['United Kingdom', 'FTSE 100', '^FTSE'],
  ['Germany', 'DAX', '^GDAXI'],
  ['France', 'CAC 40', '^FCHI'],
  ['Japan', 'Nikkei 225', '^N225'],
  ['Hong Kong', 'Hang Seng', '^HSI'],
  ['China', 'SSE Composite', '000001.SS'],
  ['South Korea', 'KOSPI', '^KS11'],
  ['Australia', 'S&P/ASX 200', '^AXJO'],
  ['Canada', 'S&P/TSX Composite', '^GSPTSE'],
  ['Brazil', 'Bovespa', '^BVSP'],
  ['India', 'NIFTY 50', '^NSEI'],
  ['India', 'S&P BSE SENSEX', '^BSESN'],
];

/** Indian companies with US-listed depositary receipts. */
const ADRS = [
  ['INFY', 'Infosys Ltd'],
  ['WIT', 'Wipro Ltd'],
  ['HDB', 'HDFC Bank Ltd'],
  ['IBN', 'ICICI Bank Ltd'],
  ['RDY', "Dr. Reddy's Laboratories Ltd"],
  ['SIFY', 'Sify Technologies Ltd'],
  ['MMYT', 'MakeMyTrip Ltd'],
  ['WNS', 'WNS Holdings Ltd'],
  ['YTRA', 'Yatra Online Inc'],
];

/**
 * Commodity benchmarks. Yahoo does not carry MCX contracts, so these are the
 * international futures MCX bullion/energy contracts settle against, plus the
 * rupee-denominated bullion ETFs that trade on NSE. The Exchange and Currency
 * columns make the distinction explicit — nothing here is labelled as MCX.
 */
const COMMODITIES = [
  ['Gold', 'GC=F'],
  ['Silver', 'SI=F'],
  ['Copper', 'HG=F'],
  ['Crude Oil (WTI)', 'CL=F'],
  ['Brent Crude', 'BZ=F'],
  ['Natural Gas', 'NG=F'],
  ['Platinum', 'PL=F'],
  ['Zinc (LME 3M)', 'ZS=F'],
  ['Gold ETF (NSE)', 'GOLDBEES.NS'],
  ['Silver ETF (NSE)', 'SILVERBEES.NS'],
];

/** BSE benchmark and sectoral indices that Yahoo carries. */
const BSE_INDICES = [
  ['S&P BSE SENSEX', '^BSESN'],
  ['S&P BSE SENSEX 50', 'BSE-50.BO'],
  ['S&P BSE 100', 'BSE-100.BO'],
  ['S&P BSE 200', 'BSE-200.BO'],
  ['S&P BSE 500', 'BSE-500.BO'],
  ['S&P BSE MidCap', 'BSE-MIDCAP.BO'],
  ['S&P BSE SmallCap', 'BSE-SMLCAP.BO'],
  ['S&P BSE Bankex', 'BSE-BANK.BO'],
  ['S&P BSE IT', 'BSE-IT.BO'],
  ['S&P BSE Auto', 'BSE-AUTO.BO'],
];

const CURRENCIES = [
  ['USD / INR', 'USDINR=X'],
  ['EUR / INR', 'EURINR=X'],
  ['GBP / INR', 'GBPINR=X'],
  ['JPY / INR', 'JPYINR=X'],
  ['AUD / INR', 'AUDINR=X'],
  ['CAD / INR', 'CADINR=X'],
  ['CHF / INR', 'CHFINR=X'],
  ['SGD / INR', 'SGDINR=X'],
  ['AED / INR', 'AEDINR=X'],
  ['CNY / INR', 'CNYINR=X'],
];

/* -------------------------------------------------------------- builders */

/**
 * Fetches every Yahoo-backed dataset.
 * @param {{budgetMs?: number}} opts wall-clock cap for the whole phase.
 */
export async function buildDatasets({ budgetMs = 9 * 60 * 1000 } = {}) {
  deadline = Date.now() + budgetMs;
  await session();

  const sets = [];

  /* ---- World indices ----
   * `spark` carries no day range, so High/Low are only published when the
   * per-symbol chart call supplied them; otherwise those columns are dropped
   * rather than filled with zeros.
   */
  const world = await quotes(WORLD.map((w) => w[2]), 'world indices');
  const worldRows = WORLD.map(([country, name, sym]) => {
    const q = world.get(sym);
    if (!q) return null;
    return {
      country,
      index: name,
      date: fmtDate(q.time),
      value: +q.price.toFixed(2),
      prev: +q.prev.toFixed(2),
      ...(q.high != null && q.low != null
        ? { high: +q.high.toFixed(2), low: +q.low.toFixed(2) }
        : {}),
      change: +q.change.toFixed(2),
      chgPct: q.chgPct,
    };
  }).filter(Boolean);
  if (worldRows.length) {
    const hasRange = worldRows.some((r) => 'high' in r);
    sets.push({
      slug: 'world-indices',
      title: 'World Indices',
      group: 'institutional',
      blurb: hasRange
        ? 'Global benchmark levels, overnight moves and the day’s trading range.'
        : 'Global benchmark levels and their move against the previous close.',
      columns: [
        C('country', 'Country', 'text'), C('index', 'Index', 'text'), C('date', 'Reporting Date', 'date'),
        C('value', 'Current Value', 'num'), C('prev', 'Previous Close', 'num'),
        ...(hasRange ? [C('high', 'High', 'num'), C('low', 'Low', 'num')] : []),
        C('change', 'Net Change', 'change'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: worldRows,
      defaultSort: 'chgPct',
      vendor: 'Yahoo Finance',
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
      date: fmtDate(q.time),
      ltp: +q.price.toFixed(2),
      volume: +(q.volume / 1000).toFixed(2),
      chgPct: q.chgPct,
    };
  }).filter(Boolean);
  if (adrRows.length) {
    sets.push({
      slug: 'adr-prices',
      title: 'ADR Prices',
      group: 'institutional',
      blurb: 'Indian companies trading as depositary receipts on the NYSE and NASDAQ.',
      columns: [
        C('symbol', 'Symbol', 'text'), C('company', 'Company Name', 'text'), C('date', 'Date', 'date'),
        C('ltp', 'LTP ($)', 'num'), C('volume', "Volume (000's)", 'num'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: adrRows,
      defaultSort: 'chgPct',
      vendor: 'Yahoo Finance',
    });
  }

  /* ---- Commodity benchmarks ---- */
  const com = await quotes(COMMODITIES.map((c) => c[1]), 'commodities');
  const comRows = COMMODITIES.map(([name, sym]) => {
    const q = com.get(sym);
    if (!q) return null;
    return {
      commodity: name,
      exchange: q.exchange || '—',
      currency: q.currency || '—',
      last: +q.price.toFixed(2),
      prev: +q.prev.toFixed(2),
      change: +q.change.toFixed(2),
      chgPct: q.chgPct,
    };
  }).filter(Boolean);
  if (comRows.length) {
    sets.push({
      slug: 'mcx-commodities',
      title: 'Commodity Benchmarks',
      group: 'commodity',
      blurb:
        'International bullion, energy and base-metal futures that MCX contracts settle against, plus rupee-denominated bullion ETFs listed on NSE.',
      columns: [
        C('commodity', 'Commodity', 'text'), C('exchange', 'Exchange', 'text'), C('currency', 'Currency', 'tag'),
        C('last', 'Last', 'num'), C('prev', 'Prev Close', 'num'),
        C('change', 'Change', 'change'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: comRows,
      defaultSort: 'chgPct',
      vendor: 'Yahoo Finance',
    });
  }

  /* ---- BSE indices ---- */
  const bse = await quotes(BSE_INDICES.map((b) => b[1]), 'BSE indices');
  const bseRows = BSE_INDICES.map(([name, sym]) => {
    const q = bse.get(sym);
    if (!q) return null;
    return {
      index: name,
      close: +q.price.toFixed(2),
      prev: +q.prev.toFixed(2),
      ...(q.high != null && q.low != null
        ? { high: +q.high.toFixed(2), low: +q.low.toFixed(2) }
        : {}),
      change: +q.change.toFixed(2),
      chgPct: q.chgPct,
    };
  }).filter(Boolean);
  if (bseRows.length) {
    const hasRange = bseRows.some((r) => 'high' in r);
    sets.push({
      slug: 'bse-indices',
      title: 'BSE Indices',
      group: 'equity',
      blurb: 'SENSEX and the BSE broad-market and sectoral index levels.',
      columns: [
        C('index', 'Index', 'text'), C('close', 'Close', 'num'), C('prev', 'Prev Close', 'num'),
        ...(hasRange ? [C('high', 'High', 'num'), C('low', 'Low', 'num')] : []),
        C('change', 'Change', 'change'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: bseRows,
      defaultSort: 'chgPct',
      vendor: 'Yahoo Finance',
    });
  }

  /* ---- Currency ---- */
  const fx = await quotes(CURRENCIES.map((c) => c[1]), 'currency pairs');
  const fxRows = CURRENCIES.map(([pair, sym]) => {
    const q = fx.get(sym);
    if (!q) return null;
    return {
      pair,
      rate: +q.price.toFixed(4),
      prev: +q.prev.toFixed(4),
      change: +q.change.toFixed(4),
      chgPct: q.chgPct,
    };
  }).filter(Boolean);
  if (fxRows.length) {
    sets.push({
      slug: 'currency-quotes',
      title: 'Currency Rates',
      group: 'currency',
      blurb: 'Live rupee exchange rates against the major traded currencies.',
      columns: [
        C('pair', 'Currency Pair', 'text'), C('rate', 'Rate (₹)', 'num'), C('prev', 'Prev Close', 'num'),
        C('change', 'Change', 'change'), C('chgPct', 'Change (%)', 'pct'),
      ],
      rows: fxRows,
      defaultSort: 'chgPct',
      vendor: 'Yahoo Finance',
    });
  }

  return sets;
}

export { chart, history, quotes, toQuote };
