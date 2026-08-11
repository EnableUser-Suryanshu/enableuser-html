'use client';

import { useEffect, useRef, useState } from 'react';

interface IndexRow {
  index: string;
  close: number;
  prev: number;
  chgPct: number;
}

/** Deterministic pseudo-random walk so server and client render identically. */
function sparkPath(seed: string, up: boolean, w = 132, h = 40) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 9973;
  const rand = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  const n = 22;
  const pts: string[] = [];
  let v = 0.5;
  for (let i = 0; i < n; i++) {
    v += (rand() - (up ? 0.42 : 0.58)) * 0.16;
    v = Math.max(0.08, Math.min(0.92, v));
    pts.push(`${((i / (n - 1)) * w).toFixed(1)},${((1 - v) * h).toFixed(1)}`);
  }
  return pts.join(' ');
}

function useCountUp(target: number, decimals = 2) {
  const [val, setVal] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(el);
          const t0 = performance.now();
          const dur = 1100;
          const from = target * 0.985;
          const step = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            setVal(from + (target - from) * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return {
    ref,
    text: val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  };
}

function IndexCard({ row }: { row: IndexRow }) {
  const up = row.chgPct >= 0;
  const { ref, text } = useCountUp(row.close);
  const diff = row.close - row.prev;
  return (
    <article className={`idx-card ${up ? 'up' : 'down'}`}>
      <div className="idx-top">
        <h3>{row.index}</h3>
        <span className="idx-pill">{up ? '▲' : '▼'} {Math.abs(row.chgPct).toFixed(2)}%</span>
      </div>
      <div className="idx-value">
        <span ref={ref}>{text}</span>
      </div>
      <div className="idx-diff">
        {diff >= 0 ? '+' : ''}{diff.toLocaleString('en-IN', { maximumFractionDigits: 2 })} pts
      </div>
      <svg className="idx-spark" viewBox="0 0 132 40" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={sparkPath(row.index, up)} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </article>
  );
}

export default function IndexCards({ rows }: { rows: IndexRow[] }) {
  return (
    <div className="idx-grid stagger">
      {rows.map((r) => (
        <IndexCard key={r.index} row={r} />
      ))}
    </div>
  );
}
