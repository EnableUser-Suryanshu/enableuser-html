'use client';

import { useEffect, useRef } from 'react';
import { Headset } from './icons';

/** Floating support button with a scroll-progress ring. */
export default function Fab() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      el.style.setProperty('--p', pct.toFixed(1));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToHelp = () => {
    const el = document.getElementById('help');
    if (el) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    } else {
      // Help section lives on the home page.
      window.location.assign('/#help');
    }
  };

  return (
    <button className="fab" aria-label="Support helpline" ref={ref} onClick={goToHelp}>
      <Headset size={24} strokeW={1.9} />
    </button>
  );
}
