'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ------------------------------------------------------------------ *
 * Regulatory popup carousel — SEBI / CDSL / SCORES awareness.
 *
 * Mirrors the popup set from https://www.kalpatarumulti.com but with a
 * premium glassmorphism design. Shows once per session (sessionStorage).
 * ------------------------------------------------------------------ */

const SLIDES = [
  {
    id: 'cdsl-myeasi',
    href: 'https://edis.cdslindia.com/home/login',
    image: '/assets/popups/cdsl-banner.png',
    alt: 'CDSL Investor Mobile Application — MyEasi',
  },
  {
    id: 'sebi-investor',
    href: 'https://investor.sebi.gov.in',
    image: '/assets/popups/sebi-banner.png',
    alt: 'SEBI Har Investor Ki Taaqat',
  },
  {
    id: 'scores',
    href: 'https://scores.sebi.gov.in/',
    image: '/assets/popups/scores-banner.png',
    alt: 'Filing Complaints on SCORES',
  },
];

const AUTO_MS = 6000;

export default function RegulatoryPopup() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [autoPlay, setAutoPlay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Show popup 2 s after first render, but only once per session.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('reg-popup-seen')) return;
    const id = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(id);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem('reg-popup-seen', '1');
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!open || !autoPlay || hovered) return;
    const id = setInterval(() => {
      setDir('next');
      setIdx((i) => (i + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [open, autoPlay, hovered]);

  // Keyboard handling
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') {
        setDir('next');
        setIdx((i) => (i + 1) % SLIDES.length);
        setAutoPlay(false);
      }
      if (e.key === 'ArrowLeft') {
        setDir('prev');
        setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
        setAutoPlay(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const goTo = (i: number) => {
    setDir(i > idx ? 'next' : 'prev');
    setIdx(i);
    setAutoPlay(false);
  };

  const prev = () => {
    setDir('prev');
    setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
    setAutoPlay(false);
  };

  const next = () => {
    setDir('next');
    setIdx((i) => (i + 1) % SLIDES.length);
    setAutoPlay(false);
  };

  if (!open) return null;

  const s = SLIDES[idx];

  return (
    <div
      className="rpop-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Regulatory information"
    >
      <div
        className="rpop-card"
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Close */}
        <button className="rpop-close" onClick={close} aria-label="Close popup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        {/* Slide counter */}
        <span className="rpop-counter">{idx + 1} / {SLIDES.length}</span>

        {/* Content area */}
        <div className={`rpop-slide rpop-${dir}`} key={s.id}>
          {s.href ? (
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="rpop-img-link">
              <img src={s.image} alt={s.alt} className="rpop-img" />
            </a>
          ) : (
            <img src={s.image} alt={s.alt} className="rpop-img" />
          )}
        </div>

        {/* Navigation */}
        <div className="rpop-nav">
          <button className="rpop-arrow" onClick={prev} aria-label="Previous slide">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="rpop-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`rpop-dot${i === idx ? ' on' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-pressed={i === idx}
              />
            ))}
          </div>
          <button className="rpop-arrow" onClick={next} aria-label="Next slide">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* Auto-play progress bar */}
        {autoPlay && !hovered && (
          <div className="rpop-progress" key={`prog-${idx}`} />
        )}
      </div>
    </div>
  );
}
