'use client';

import { useEffect, useRef } from 'react';
import { Headset, Bell } from './icons';
import { OPEN_NOTICES } from '@/lib/notices';

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
    <div className="fab-stack">
      {/*
        Re-opens the investor notices. They show once a session and are then
        dismissed for good, so without this there is no way back to them —
        and they carry the SCORES route and the CDSL and SEBI links, which is
        exactly what someone comes looking for later.
        A plain event keeps this button and the dialog from having to know
        about each other.
      */}
      <button
        type="button"
        className="fab fab-bell"
        aria-label="Show investor notices"
        onClick={() => window.dispatchEvent(new Event(OPEN_NOTICES))}
      >
        <Bell size={21} strokeW={1.9} />
      </button>

      <button className="fab" aria-label="Support helpline" ref={ref} onClick={goToHelp}>
        <Headset size={24} strokeW={1.9} />
      </button>
    </div>
  );
}
