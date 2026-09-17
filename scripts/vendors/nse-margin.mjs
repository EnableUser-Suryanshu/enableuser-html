/**
 * Cash-market margin rates, straight from NSE Clearing's daily VaR file.
 *
 *   https://nsearchives.nseindia.com/archives/nsccl/var/C_VAR1_<DDMMYYYY>_<n>.DAT
 *
 * The file is published in numbered intraday revisions (…_1 through …_6+), so we
 * walk revisions downward for today, then step back a day if today's has not
 * been posted yet — before market open, or on a holiday.
 *
 * Record layout (type 20):
 *   20, SYMBOL, SERIES, ISIN, SecurityVaR, IndexVaR, VaRMargin, ELM, Adhoc, ApplicableMarginRate
 *
 * Every figure the calculator shows comes from this file. Nothing is estimated:
 * the whole point of sourcing it is that a SEBI-registered broker must not put
 * invented leverage numbers in front of clients.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const ARCHIVE = 'https://nsearchives.nseindia.com/archives/nsccl/var/C_VAR1_';

const pad = (n) => String(n).padStart(2, '0');
const ddmmyyyy = (d) => `${pad(d.getUTCDate())}${pad(d.getUTCMonth() + 1)}${d.getUTCFullYear()}`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const label = (d) => `${pad(d.getUTCDate())}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;

const numOr = (v, f = 0) => {
  const n = Number(String(v ?? '').trim());
  return Number.isFinite(n) ? n : f;
};

async function tryFetch(url) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Referer: 'https://www.nseindia.com/', Accept: 'text/plain,*/*' },
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok) return null;
    const text = await r.text();
    return text.startsWith('10,') ? text : null;
  } catch {
    return null;
  }
}

/** Fetches the most recent VaR file, newest revision first. */
async function latestFile() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let back = 0; back <= 6; back++) {
    const d = new Date(today.getTime() - back * 86400000);
    const day = d.getUTCDay();
    if (day === 0 || day === 6) continue;
    // Revisions are posted through the session; the highest is the current one.
    for (let rev = 8; rev >= 1; rev--) {
      const text = await tryFetch(`${ARCHIVE}${ddmmyyyy(d)}_${rev}.DAT`);
      if (text) return { text, date: d, revision: rev };
    }
  }
  return null;
}

/**
 * @returns {Promise<{asOf: string, revision: number, rates: Array<object>} | null>}
 */
export async function fetchMarginRates() {
  const file = await latestFile();
  if (!file) return null;

  const rates = [];
  for (const line of file.text.split(/\r?\n/)) {
    if (!line.startsWith('20,')) continue;
    const c = line.split(',');
    if (c.length < 10) continue;

    const series = (c[2] ?? '').trim();
    // EQ and BE are the two series a retail cash-market client can trade.
    if (series !== 'EQ' && series !== 'BE') continue;

    const symbol = (c[1] ?? '').trim();
    const applicable = numOr(c[9]);
    if (!symbol || applicable <= 0) continue;

    rates.push({
      symbol,
      series,
      isin: (c[3] ?? '').trim(),
      varMargin: numOr(c[6]),
      elm: numOr(c[7]),
      adhoc: numOr(c[8]),
      applicable,
    });
  }
  if (!rates.length) return null;

  rates.sort((a, b) => a.symbol.localeCompare(b.symbol));
  return { asOf: label(file.date), revision: file.revision, rates };
}

/**
 * Margin rates joined to each security's last traded price, so the calculator
 * can pre-fill a real price when a symbol is picked.
 *
 * @param {(want?: number) => Promise<Array<{stamp: string, rows: Map}>>} sessions
 *        the bhavcopy reader from vendors/nse-delivery.mjs
 */
export async function fetchMarginRatesWithPrices(sessions) {
  const [margin, days] = await Promise.all([
    fetchMarginRates(),
    sessions(1).catch(() => []),
  ]);
  if (!margin) return null;

  const prices = days?.[0]?.rows ?? null;
  if (prices) {
    for (const r of margin.rates) {
      const p = prices.get(r.symbol);
      if (p?.close) r.close = +p.close.toFixed(2);
    }
  }
  return { ...margin, priceStamp: days?.[0]?.stamp ?? null };
}
