'use client';

import { useEffect, useRef, useState } from 'react';
import { liveIndices } from '@/lib/markets';

type Exchange = 'NSE' | 'BSE' | 'MCX';

interface Quote {
  name: string;
  value: number;
  prev: number;
  chgPct: number;
  ex: Exchange;
}

interface Mover {
  symbol: string;
  value: number;
  chgPct: number;
  ex: Exchange;
}

interface Row extends Quote {
  /** Bumped whenever the value actually changes, to restart the flash. */
  nonce: number;
  rising: boolean;
}

const POLL_MS = 30000;

const inr = (n: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Seeded from the build-time snapshot so the first paint is never empty. */
function seed(): Row[] {
  return liveIndices()
    .slice(0, 6)
    .map((r) => ({
      name: r.index,
      value: r.close,
      prev: r.prev,
      chgPct: r.chgPct,
      ex: 'NSE' as const,
      nonce: 0,
      rising: r.chgPct >= 0,
    }));
}

export default function Ticker() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [movers, setMovers] = useState<Mover[]>([]);
  const [live, setLive] = useState(false);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  useEffect(() => {
    let cancelled = false;

    let loadedOnce = false;

    const pull = async (force = false) => {
      // The first load always runs — a page opened in a background tab must
      // still show real numbers. Later polls back off while hidden or paused.
      if (!force && !loadedOnce) return;
      if (!force) {
        if (document.documentElement.classList.contains('motion-paused')) return;
        if (document.hidden) return;
      }
      try {
        const r = await fetch('/api/ticker', { cache: 'no-store' });
        if (!r.ok) return;
        const j = (await r.json()) as { quotes: Quote[]; movers?: Mover[]; status: string };
        if (cancelled || !j.quotes?.length) return;

        loadedOnce = true;
        setLive(j.status === 'live');
        if (j.movers) setMovers(j.movers);
        setRows((prev) =>
          j.quotes.map((q) => {
            const old = prev.find((p) => p.name === q.name);
            const changed = !old || old.value !== q.value;
            return {
              ...q,
              nonce: changed ? (old?.nonce ?? 0) + 1 : (old?.nonce ?? 0),
              rising: old ? q.value >= old.value : q.chgPct >= 0,
            };
          }),
        );
      } catch {
        /* keep showing the last good values rather than faking movement */
      }
    };

    pull(true);
    const id = setInterval(() => pull(), POLL_MS);
    const onVis = () => { if (!document.hidden) pull(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Two identical halves make the marquee loop seamlessly; the duplicate is
  // hidden from assistive tech so each index is announced once.
  const renderHalf = () => (
    <>
      {rows.map((q, i) => {
        const up = q.chgPct >= 0;
        return (
          <span className="ticker-item" key={`${q.name}-${i}`}>
            <span className={`dot ${up ? 'up' : 'down'}`}></span>
            <span className={`tk-ex ${q.ex.toLowerCase()}`}>{q.ex}</span>
            {q.name}:{' '}
            <span
              key={`v-${q.nonce}`}
              className={`val${q.nonce > 0 ? (q.rising ? ' fl-up' : ' fl-down') : ''}`}
            >
              {inr(q.value)}
            </span>
            &nbsp;
            <span className={`chg ${up ? 'up' : 'down'}`}>
              ({q.chgPct >= 0 ? '+' : ''}
              {q.chgPct.toFixed(2)}%)
            </span>
          </span>
        );
      })}

      {movers.map((m, i) => {
        const up = m.chgPct >= 0;
        return (
          <span className="ticker-item" key={`m-${m.ex}-${m.symbol}-${i}`}>
            <span className={`tk-ex ${m.ex.toLowerCase()}`}>{m.ex}</span>
            <span className="tk-sym">{m.symbol}</span>
            <span className="val">{inr(m.value)}</span>
            &nbsp;
            <span className={`chg ${up ? 'up' : 'down'}`}>
              {up ? '▲' : '▼'} {Math.abs(m.chgPct).toFixed(2)}%
            </span>
          </span>
        );
      })}
    </>
  );

  return (
    <section
      className="ticker"
      aria-label={live ? 'Live NSE and BSE index levels' : 'NSE and BSE index levels (last close)'}
    >
      <div className="ticker-track">
        <div className="t-half">{renderHalf()}</div>
        <div className="t-half" aria-hidden="true">{renderHalf()}</div>
      </div>
    </section>
  );
}
