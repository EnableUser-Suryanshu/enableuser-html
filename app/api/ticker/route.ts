import { NextResponse } from 'next/server';
import snapshot from '@/lib/markets/snapshot.json';

/**
 * Live ticker feed.
 *
 * Runs on the server (the browser cannot call NSE directly — no CORS), fetches
 * current index levels, and caches them briefly so we never hammer the exchange.
 * If the upstream is unreachable, it falls back to the build-time snapshot and
 * says so, rather than inventing movement.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const NSE = 'https://www.nseindia.com';
const BSE = 'https://api.bseindia.com';

/** NSE indices shown in the ticker, in order. */
const WANTED = ['NIFTY 50', 'NIFTY BANK', 'NIFTY IT', 'NIFTY AUTO', 'NIFTY FMCG', 'NIFTY PHARMA'];

type Exchange = 'NSE' | 'BSE' | 'MCX';

interface Quote {
  name: string;
  value: number;
  prev: number;
  chgPct: number;
  /** Which exchange the number came from. */
  ex: Exchange;
}

/** A top gainer or loser on one exchange. */
interface Mover {
  symbol: string;
  value: number;
  chgPct: number;
  ex: Exchange;
}

/** How many gainers and losers to show per exchange. */
const PER_SIDE = 3;

const num = (v: unknown) => {
  const n = Number(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** NSE rejects API calls without a session — grab cookies once and share them. */
async function primeNse(): Promise<string> {
  try {
    const home = await fetch(NSE + '/', {
      headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    return (home.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ');
  } catch {
    return '';
  }
}

async function fromNse(cookie: string): Promise<{ quotes: Quote[]; status: string; stamp: string } | null> {
  try {
    const r = await fetch(NSE + '/api/allIndices', {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: NSE + '/market-data/live-market-indices',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return null;

    const json = (await r.json()) as { data?: Array<Record<string, unknown>>; timestamp?: string };
    const rows = json?.data ?? [];
    if (!rows.length) return null;

    const byName = new Map(rows.map((x) => [String(x.index), x]));
    const quotes: Quote[] = WANTED.map((n) => byName.get(n))
      .filter(Boolean)
      .map((x) => ({
        name: String(x!.index),
        value: num(x!.last),
        prev: num(x!.previousClose),
        chgPct: num(x!.percentChange),
        ex: 'NSE' as const,
      }))
      .filter((q) => q.value > 0);

    if (!quotes.length) return null;
    return { quotes, status: 'live', stamp: String(json.timestamp ?? '') };
  } catch {
    return null;
  }
}

/** BSE SENSEX, live from BSE's own real-time endpoint. */
async function fromBse(): Promise<Quote | null> {
  try {
    const r = await fetch(BSE + '/RealTimeBseIndiaAPI/api/GetSensexData/w', {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://www.bseindia.com/',
        Origin: 'https://www.bseindia.com',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return null;
    const arr = (await r.json()) as Array<Record<string, unknown>>;
    const row = Array.isArray(arr) ? arr[0] : null;
    if (!row) return null;

    const value = num(row.ltp);
    const chg = num(row.chg);
    if (!value) return null;
    return {
      name: 'SENSEX',
      value,
      prev: +(value - chg).toFixed(2),
      chgPct: num(row.perchg),
      ex: 'BSE',
    };
  } catch {
    return null;
  }
}

/** NSE top gainers and losers across all securities. */
async function nseMovers(cookie: string): Promise<Mover[]> {
  const hit = async (kind: 'gainers' | 'loosers') => {
    try {
      const r = await fetch(`${NSE}/api/live-analysis-variations?index=${kind}`, {
        headers: {
          'User-Agent': UA,
          Accept: 'application/json, text/plain, */*',
          Referer: NSE + '/market-data/top-gainers-losers',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(9000),
      });
      if (!r.ok) return [];
      const j = (await r.json()) as Record<string, { data?: Array<Record<string, unknown>> }>;
      const rows = j?.allSec?.data ?? j?.NIFTY?.data ?? [];
      return rows.slice(0, PER_SIDE).map((x) => ({
        symbol: String(x.symbol),
        value: num(x.ltp),
        chgPct: num(x.perChange ?? x.net_price),
        ex: 'NSE' as const,
      }));
    } catch {
      return [];
    }
  };
  const [g, l] = await Promise.all([hit('gainers'), hit('loosers')]);
  return [...g, ...l].filter((m) => m.value > 0);
}

/**
 * BSE top gainers.
 *
 * Note: BSE's MktRGainerLoserData endpoint ignores the GLtype parameter and
 * returns only advancing scrips (verified — the `gainer` and `loser` responses
 * are identical and contain no negative moves). So we publish gainers only
 * rather than mislabelling flat scrips as losers. BSE losers need the licensed
 * feed.
 */
async function bseMovers(): Promise<Mover[]> {
  try {
    const r = await fetch(
      `${BSE}/BseIndiaAPI/api/MktRGainerLoserData/w?GLtype=gainer&IndxGrp=&orderby=`,
      {
        headers: {
          'User-Agent': UA,
          Accept: 'application/json, text/plain, */*',
          Referer: 'https://www.bseindia.com/',
          Origin: 'https://www.bseindia.com',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!r.ok) return [];
    const j = (await r.json()) as { Table?: Array<Record<string, unknown>> };

    const rows = (j?.Table ?? [])
      .filter((x) => String(x.trend) === '+')
      .map((x) => ({
        symbol: String(x.scripname ?? ''),
        value: num(x.ltradert),
        chgPct: num(x.change_percent),
        ex: 'BSE' as const,
      }))
      // Untraded or flat scrips are noise, not news.
      .filter((m) => m.symbol && m.value > 0 && m.chgPct > 0);

    return [...rows].sort((a, b) => b.chgPct - a.chgPct).slice(0, PER_SIDE * 2);
  } catch {
    return [];
  }
}

/**
 * MCX top gainers and losers.
 * MCX's WAF rejects most server-to-server calls, so this is best-effort: if it
 * is blocked the ticker simply carries NSE and BSE. The licensed TrueData feed
 * (see scripts/vendors/truedata.mjs) is the reliable route for MCX.
 */
async function mcxMovers(): Promise<Mover[]> {
  try {
    const r = await fetch('https://www.mcxindia.com/backpage.aspx/GetGainerLooserData', {
      method: 'POST',
      headers: {
        'User-Agent': UA,
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        Referer: 'https://www.mcxindia.com/market-data/gainer-looser',
        Origin: 'https://www.mcxindia.com',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ Ddlvalue: 'ALL' }),
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return [];
    const j = (await r.json()) as { d?: { Data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> };
    const raw = Array.isArray(j?.d) ? j.d : (j?.d as { Data?: Array<Record<string, unknown>> })?.Data ?? [];
    const rows = raw.map((x) => ({
      symbol: String(x.Symbol ?? x.InstrumentName ?? ''),
      value: num(x.LTP ?? x.CurrentPrice),
      chgPct: num(x.PercentChange ?? x.PerChange),
      ex: 'MCX' as const,
    })).filter((m) => m.symbol && m.value > 0);

    const sorted = [...rows].sort((a, b) => b.chgPct - a.chgPct);
    return [...sorted.slice(0, PER_SIDE), ...sorted.slice(-PER_SIDE).reverse()];
  } catch {
    return [];
  }
}

/** Build-time snapshot — real closes, just not refreshed this second. */
function fromSnapshot(): { quotes: Quote[]; status: string; stamp: string } {
  const ds = (snapshot as { datasets: Array<{ slug: string; rows: Array<Record<string, unknown>> }> })
    .datasets.find((d) => d.slug === 'live-indices');
  const quotes: Quote[] = (ds?.rows ?? [])
    .filter((r) => WANTED.includes(String(r.index)))
    .map((r) => ({
      name: String(r.index),
      value: num(r.close),
      prev: num(r.prev),
      chgPct: num(r.chgPct),
      ex: 'NSE' as const,
    }));
  return {
    quotes,
    status: 'snapshot',
    stamp: (snapshot as { marketTimestamp?: string }).marketTimestamp ?? '',
  };
}

export async function GET() {
  const cookie = await primeNse();

  // Every exchange in parallel; any one can fail without taking down the rest.
  const [nse, sensex, nseM, bseM, mcxM] = await Promise.all([
    fromNse(cookie),
    fromBse(),
    nseMovers(cookie),
    bseMovers(),
    mcxMovers(),
  ]);

  const base = nse ?? fromSnapshot();

  // Order: NIFTY 50, SENSEX, then the NSE sectorals.
  const quotes = [...base.quotes];
  if (sensex) quotes.splice(1, 0, sensex);

  const movers = [...nseM, ...bseM, ...mcxM];
  const status = nse && sensex ? 'live' : nse || sensex ? 'partial' : 'snapshot';

  return NextResponse.json(
    {
      quotes,
      movers,
      status,
      stamp: base.stamp,
      exchanges: {
        nse: Boolean(nse),
        bse: Boolean(sensex),
        mcx: mcxM.length > 0,
      },
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        // Cache at the edge so repeat visitors don't each hit NSE.
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
      },
    },
  );
}
