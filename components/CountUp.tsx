'use client';

import { useEffect, useRef } from 'react';

interface Props {
  target: number;
  suffix?: string;
  /** Rendered before the animation triggers (and for no-JS/SEO). */
  className?: string;
}

/** Counts from 0 to `target` (en-IN grouped) when scrolled into view. */
export default function CountUp({ target, suffix = '', className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) => n.toLocaleString('en-IN') + suffix;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(el);
          const t0 = performance.now();
          const dur = 1600;
          const step = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, suffix]);

  return (
    <span ref={ref} className={className}>
      {target.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
