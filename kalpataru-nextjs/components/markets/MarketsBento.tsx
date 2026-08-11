'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from '../icons';
import { useLiveRows } from './useLiveDataset';

interface IndexRow { index: string; close: number; prev: number; chgPct: number }
interface Mover { company: string; last: number; chgPct: number }
interface Breadth { group: string; adv: number; dec: number }

/** Deterministic walk so SSR and client markup match exactly. */
function series(seed: string, up: boolean, n = 28) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 9973;
  const rand = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  const pts: number[] = [];
  let v = 0.5;
  for (let i = 0; i < n; i++) {
    v += (rand() - (up ? 0.4 : 0.6)) * 0.15;
    v = Math.max(0.1, Math.min(0.9, v));
    pts.push(v);
  }
  return pts;
}

function line(vals: number[], w: number, h: number) {
  return vals.map((v, i) => `${((i / (vals.length - 1)) * w).toFixed(1)},${((1 - v) * h).toFixed(1)}`).join(' ');
}

function useCountUp(target: number) {
  const [val, setVal] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        const t0 = performance.now(), from = target * 0.99;
        const step = (t: number) => {
          const p = Math.min((t - t0) / 900, 1);
          setVal(from + (target - from) * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return { ref, text: val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
}

function Featured({ row }: { row: IndexRow }) {
  const up = row.chgPct >= 0;
  const { ref, text } = useCountUp(row.close);
  const vals = series(row.index, up, 34);
  const W = 520, H = 120;
  const pts = line(vals, W, H);
  return (
    <article className={`bento-feat ${up ? 'up' : 'down'}`}>
      <div className="bf-head">
        <span className="bf-tag">Benchmark</span>
        <h3>{row.index}</h3>
      </div>
      <div className="bf-num">
        <span ref={ref}>{text}</span>
        <span className="bf-chg">{up ? '▲' : '▼'} {Math.abs(row.chgPct).toFixed(2)}%</span>
      </div>
      <div className="bf-sub">
        {(row.close - row.prev >= 0 ? '+' : '') + (row.close - row.prev).toLocaleString('en-IN', { maximumFractionDigits: 2 })} pts
        <span className="bf-dot">·</span> Prev {row.prev.toLocaleString('en-IN')}
      </div>
      <svg className="bf-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="bfgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? '#11bf83' : '#e8000b'} stopOpacity="0.28" />
            <stop offset="100%" stopColor={up ? '#11bf83' : '#e8000b'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#bfgrad)" />
        <polyline points={pts} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </article>
  );
}

function Tile({ row }: { row: IndexRow }) {
  const up = row.chgPct >= 0;
  const vals = series(row.index, up, 20);
  return (
    <article className={`bento-tile ${up ? 'up' : 'down'}`}>
      <h4>{row.index.replace('NIFTY ', '')}</h4>
      <div className="bt-num">{row.close.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
      <div className="bt-row">
        <span className="bt-chg">{up ? '▲' : '▼'} {Math.abs(row.chgPct).toFixed(2)}%</span>
        <svg className="bt-spark" viewBox="0 0 60 20" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={line(vals, 60, 20)} fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </article>
  );
}

export default function MarketsBento({
  indices, gainers, losers, breadth,
}: { indices: IndexRow[]; gainers: Mover[]; losers: Mover[]; breadth: Breadth[] }) {
  // Props are the deploy-time snapshot (instant first paint); these keep the
  // dashboard current from the same live routes the tables use.
  const { rows: liveIdx } = useLiveRows<IndexRow>('live-indices', indices);
  const { rows: liveBreadth } = useLiveRows<Breadth>('advances-and-declines', breadth);
  const { rows: moverRows } = useLiveRows<Mover & { chgPct: number }>(
    'gainers-and-losers',
    [...gainers, ...losers],
  );

  const sortedMovers = [...moverRows].sort((a, b) => b.chgPct - a.chgPct);
  const liveGainers = sortedMovers.slice(0, 4);
  const liveLosers = sortedMovers.slice(-4).reverse();

  const [feat, ...rest] = liveIdx;
  const tiles = rest.slice(0, 5);
  const totals = liveBreadth.reduce((a, b) => ({ adv: a.adv + b.adv, dec: a.dec + b.dec }), { adv: 0, dec: 0 });
  const advPct = totals.adv + totals.dec ? (totals.adv / (totals.adv + totals.dec)) * 100 : 50;

  return (
    <div className="bento">
      {feat && <Featured row={feat} />}

      <div className="bento-tiles">
        {tiles.map((t) => <Tile key={t.index} row={t} />)}
      </div>

      <article className="bento-movers">
        <div className="bm-head">
          <h3>Top Movers</h3>
          <Link href="/markets/gainers-and-losers" className="bm-link">
            All <ArrowRight size={13} strokeW={2.4} />
          </Link>
        </div>
        <div className="bm-cols">
          <div>
            <span className="bm-label up">Gainers</span>
            {liveGainers.map((m) => (
              <div className="bm-row" key={m.company}>
                <span className="bm-sym">{m.company}</span>
                <span className="bm-val up">+{m.chgPct.toFixed(2)}%</span>
              </div>
            ))}
          </div>
          <div>
            <span className="bm-label down">Losers</span>
            {liveLosers.map((m) => (
              <div className="bm-row" key={m.company}>
                <span className="bm-sym">{m.company}</span>
                <span className="bm-val down">{m.chgPct.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="bento-breadth">
        <h3>Market Breadth</h3>
        <div className="bb-bar" role="img"
          aria-label={`${totals.adv} advancing versus ${totals.dec} declining across tracked indices`}>
          <span className="bb-adv" style={{ width: `${advPct}%` }}></span>
          <span className="bb-dec" style={{ width: `${100 - advPct}%` }}></span>
        </div>
        <div className="bb-legend">
          <span><b className="up">{totals.adv}</b> advancing</span>
          <span><b className="down">{totals.dec}</b> declining</span>
        </div>
        <Link href="/markets/advances-and-declines" className="bm-link">
          Breadth by index <ArrowRight size={13} strokeW={2.4} />
        </Link>
      </article>
    </div>
  );
}
