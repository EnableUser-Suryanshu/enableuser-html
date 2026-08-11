/**
 * Corporate-record and mutual-fund adapter.
 *
 * Covers the datasets that are neither price quotes (Yahoo) nor delivery
 * figures (NSE bhavcopy):
 *
 *   book-closure           NSE corporate actions  (book-closure window)
 *   change-of-name         NSE symbolchange.csv
 *   delisted-companies     BSE list-of-scrips, status = Delisted
 *   exchange-announcements NSE + BSE filing feeds, merged
 *   fund-profile           AMFI NAVAll, aggregated per fund house
 *
 * Each builder returns null when its source is unreachable, so the caller can
 * leave that dataset out rather than publish a half-filled table.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const C = (key, label, type) => ({ key, label, type });
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

async function get(url, { json = true, headers = {}, timeout = 40000 } = {}) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: json ? 'application/json' : 'text/csv,text/plain,*/*', ...headers },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeout),
    });
    if (!r.ok) return null;
    return json ? await r.json() : await r.text();
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ book closure */

/**
 * NSE's corporate-actions feed carries the book-closure window (bcStartDate /
 * bcEndDate) alongside each action. Rows without a window are ex-date-only
 * events and are skipped.
 * @param {Array} corpActions already-fetched `/api/corporates-corporateActions`
 */
export async function buildBookClosure(corpActions) {
  const rows = [];

  const push = (company, symbol, from, to, purpose) => {
    if (!company || !from || from === '-') return;
    rows.push({ company, symbol: symbol || '—', from, to: to && to !== '-' ? to : '—', purpose });
  };

  if (Array.isArray(corpActions)) {
    for (const r of corpActions) {
      push(clean(r.comp), clean(r.symbol), clean(r.bcStartDate), clean(r.bcEndDate), clean(r.subject));
    }
  }

  // BSE publishes the same window as BCRD_FROM / BCRD_TO.
  const bse = await get('https://api.bseindia.com/BseIndiaAPI/api/DefaultData/w?type=index', {
    headers: { Referer: 'https://www.bseindia.com/', Origin: 'https://www.bseindia.com' },
  });
  if (Array.isArray(bse)) {
    for (const r of bse) {
      push(clean(r.long_name || r.short_name), clean(r.short_name), clean(r.BCRD_FROM), clean(r.BCRD_TO), clean(r.Purpose));
    }
  }

  return {
    slug: 'book-closure',
    title: 'Book Closure',
    group: 'corporate',
    blurb: 'Registers of members closing for dividends, bonuses and other entitlements.',
    columns: [
      C('company', 'Company Name', 'text'), C('symbol', 'Symbol', 'text'),
      C('from', 'From Date', 'date'), C('to', 'To Date', 'date'), C('purpose', 'Purpose', 'text'),
    ],
    rows: rows.slice(0, 40),
    defaultSort: 'from',
    // Most issuers now use a record date instead of closing the register, so
    // this table is legitimately empty for long stretches — the same is true
    // of the exchanges' own book-closure pages.
    note: 'Neither NSE nor BSE currently lists a company with an open book-closure window. Most issuers now set a record date instead, which appears under Corporate Actions.',
  };
}

/* ---------------------------------------------------------- change of name */

export async function buildChangeOfName() {
  const csv = await get('https://nsearchives.nseindia.com/content/equities/symbolchange.csv', {
    json: false,
    headers: { Referer: 'https://www.nseindia.com/' },
  });
  if (!csv) return null;

  const rows = [];
  for (const line of csv.trim().split(/\r?\n/)) {
    const parts = line.split(',');
    if (parts.length < 4) continue;
    // The company name itself may contain commas, so take the last three
    // fields as old symbol / new symbol / date and rejoin the rest.
    const date = clean(parts.pop());
    const newSym = clean(parts.pop());
    const oldSym = clean(parts.pop());
    const company = clean(parts.join(','));
    if (!company || !oldSym || !/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(date)) continue;
    rows.push({ company, oldSym, newSym, date, ts: Date.parse(date.replace(/-/g, ' ')) || 0 });
  }
  if (!rows.length) return null;
  rows.sort((a, b) => b.ts - a.ts);

  return {
    slug: 'change-of-name',
    title: 'Change of Name',
    group: 'corporate',
    blurb: 'Listed companies that have changed their name or trading symbol, most recent first.',
    columns: [
      C('company', 'Company Name', 'text'), C('oldSym', 'Old Symbol', 'text'),
      C('newSym', 'New Symbol', 'text'), C('date', 'Effective Date', 'date'),
    ],
    rows: rows.slice(0, 40).map(({ ts, ...r }) => r), // eslint-disable-line no-unused-vars
  };
}

/* ------------------------------------------------------ delisted companies */

export async function buildDelisted() {
  const j = await get(
    'https://api.bseindia.com/BseIndiaAPI/api/ListofScripData/w?Group=&Scripcode=&industry=&segment=Equity&status=Delisted',
    { headers: { Referer: 'https://www.bseindia.com/', Origin: 'https://www.bseindia.com' }, timeout: 60000 },
  );
  if (!Array.isArray(j) || !j.length) return null;

  const rows = j
    .map((r) => ({
      company: clean(r.Scrip_Name || r.Issuer_Name),
      bseCode: clean(r.SCRIP_CD),
      ticker: clean(r.scrip_id) || '—',
      faceValue: clean(r.FACE_VALUE) || '—',
      isin: clean(r.ISIN_NUMBER) || '—',
    }))
    .filter((r) => r.company && r.bseCode);
  if (!rows.length) return null;

  return {
    slug: 'delisted-companies',
    title: 'Delisted Companies',
    group: 'corporate',
    blurb: 'Equity scrips removed from the exchange trading platform. Ticker and ISIN are the identifiers BSE last held on record.',
    columns: [
      C('company', 'Company Name', 'text'), C('bseCode', 'BSE Code', 'text'),
      C('ticker', 'Ticker', 'text'), C('faceValue', 'Face Value (₹)', 'text'), C('isin', 'ISIN', 'text'),
    ],
    rows: rows.slice(0, 60),
  };
}

/* ------------------------------------------------------ exchange announcements */

export async function buildAnnouncements(nseCookie = '') {
  const rows = [];

  const nse = await get('https://www.nseindia.com/api/corporate-announcements?index=equities', {
    headers: { Referer: 'https://www.nseindia.com/', ...(nseCookie ? { Cookie: nseCookie } : {}) },
  });
  if (Array.isArray(nse)) {
    for (const r of nse.slice(0, 30)) {
      const company = clean(r.sm_name || r.symbol);
      if (!company) continue;
      rows.push({
        exchange: 'NSE',
        company,
        subject: clean(r.desc || r.attchmntText).slice(0, 120) || '—',
        date: clean(r.an_dt),
        ts: Date.parse(r.sort_date ?? '') || 0,
      });
    }
  }

  const today = new Date();
  const back = new Date(today.getTime() - 7 * 86400000);
  const ymd = (d) =>
    `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const bse = await get(
    `https://api.bseindia.com/BseIndiaAPI/api/AnnGetData/w?strCat=-1&strPrevDate=${ymd(back)}&strScrip=&strSearch=P&strToDate=${ymd(today)}&strType=C&pageno=1`,
    { headers: { Referer: 'https://www.bseindia.com/', Origin: 'https://www.bseindia.com' } },
  );
  const bseRows = Array.isArray(bse) ? bse : bse?.Table ?? [];
  if (Array.isArray(bseRows)) {
    for (const r of bseRows.slice(0, 30)) {
      const company = clean(r.SLONGNAME || r.NEWSSUB);
      if (!company) continue;
      rows.push({
        exchange: 'BSE',
        company,
        subject: clean(r.HEADLINE || r.NEWSSUB || r.MORE).slice(0, 120) || '—',
        date: clean(r.NEWS_DT || r.DT_TM),
        ts: Date.parse(r.NEWS_DT ?? r.DT_TM ?? '') || 0,
      });
    }
  }

  if (!rows.length) return null;
  rows.sort((a, b) => b.ts - a.ts);

  return {
    slug: 'exchange-announcements',
    title: 'BSE & NSE Announcements',
    group: 'corporate',
    blurb: 'Filings and disclosures made by listed companies to both exchanges, newest first.',
    columns: [
      C('exchange', 'Exchange', 'tag'), C('company', 'Company', 'text'),
      C('subject', 'Subject', 'text'), C('date', 'Date', 'date'),
    ],
    rows: rows.slice(0, 50).map(({ ts, ...r }) => r), // eslint-disable-line no-unused-vars
  };
}

/* --------------------------------------------------------- fund house profile */

/**
 * AMFI's NAVAll file is grouped as:
 *   "<Scheme type> Schemes(<category>)"   ← section header
 *   "<Fund house name>"                   ← bare line
 *   "code;isin;isin;name;nav;date"        ← one line per scheme
 * so scheme counts per house fall straight out of a single pass.
 */
export async function buildFundProfile() {
  const txt = await get('https://portal.amfiindia.com/spages/NAVAll.txt', { json: false, timeout: 90000 });
  if (!txt || txt.length < 10000) return null;

  const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  /** "07-Aug-2026" → epoch ms, or 0 when unparseable. */
  const parseDate = (s) => {
    const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/.exec(s);
    if (!m) return 0;
    const mo = MONTHS[m[2].toLowerCase()];
    return mo === undefined ? 0 : Date.UTC(+m[3], mo, +m[1]);
  };

  // AMFI's file still carries thousands of matured close-ended schemes whose
  // NAV last moved years ago. Parse everything once, then count only schemes
  // priced in the same recent window as the file's newest NAV, so the table
  // reflects the schemes a client can actually buy today.
  const parsed = [];
  let type = '';
  let house = '';
  let newest = 0;

  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('Scheme Code')) continue;

    if (!line.includes(';')) {
      if (/Schemes?\s*\(/i.test(line)) type = line;
      else house = line;
      continue;
    }
    if (!house) continue;

    const cols = line.split(';');
    if (cols.length < 6) continue;
    const date = clean(cols[5]);
    const ts = parseDate(date);
    if (ts > newest) newest = ts;
    parsed.push({ house, type, date, ts });
  }
  if (!parsed.length || !newest) return null;

  const CUTOFF = newest - 10 * 86400000; // within ten days of the latest NAV
  const houses = new Map();
  for (const s of parsed) {
    if (s.ts < CUTOFF) continue;
    let h = houses.get(s.house);
    if (!h) houses.set(s.house, (h = { house: s.house, open: 0, close: 0, interval: 0, total: 0, ts: 0, date: '' }));
    if (/^Open/i.test(s.type)) h.open++;
    else if (/^Close/i.test(s.type)) h.close++;
    else if (/Interval/i.test(s.type)) h.interval++;
    h.total++;
    if (s.ts > h.ts) { h.ts = s.ts; h.date = s.date; }
  }

  const rows = [...houses.values()]
    .filter((h) => h.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(({ ts, ...h }) => h); // eslint-disable-line no-unused-vars
  if (!rows.length) return null;

  return {
    slug: 'fund-profile',
    title: 'Fund House Profile',
    group: 'mutual-fund',
    blurb: `Every AMFI-registered fund house and the schemes it currently prices — ${rows.length} houses, ${rows.reduce((n, r) => n + r.total, 0).toLocaleString('en-IN')} actively-quoted schemes as at ${rows[0].date}. Matured close-ended schemes AMFI still lists are excluded.`,
    columns: [
      C('house', 'Fund House', 'text'), C('open', 'Open-Ended Schemes', 'num'),
      C('close', 'Close-Ended Schemes', 'num'), C('interval', 'Interval Schemes', 'num'),
      C('total', 'Total Schemes', 'num'), C('date', 'NAV Date', 'date'),
    ],
    rows,
    defaultSort: 'total',
  };
}

/** Runs every builder that does not depend on data the caller already holds. */
export async function buildDatasets({ corpActions = null, nseCookie = '' } = {}) {
  const results = await Promise.all([
    buildBookClosure(corpActions),
    buildChangeOfName(),
    buildDelisted(),
    buildAnnouncements(nseCookie),
    buildFundProfile(),
  ]);
  return results.filter(Boolean);
}
