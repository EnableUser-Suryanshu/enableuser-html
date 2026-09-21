'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NOTICES } from '@/lib/notices';
import { EXT } from '@/lib/links';
import { ArrowRight, CheckCircle, PauseIcon, PlayIcon } from './icons';

/**
 * Investor-awareness notices — the four banners kalpatarumulti.com publishes.
 *
 * The banner itself is what a visitor sees, so the pop-ups look like the ones
 * clients already know. Each one is also carried as real text in lib/notices,
 * rendered visually hidden beside the image: these are pictures of paragraphs,
 * and a picture of a paragraph cannot be read aloud, enlarged by this site's
 * own accessibility toolkit, translated or selected. Image for the eye, text
 * for everything else, one source so the two cannot drift apart.
 *
 * Accessibility, because a modal that strands a keyboard user is worse than no
 * modal at all:
 *  - labelled by its own heading, aria-modal, focus moved in on open and
 *    returned to the trigger on close
 *  - Tab cycles inside the dialog; Escape closes; arrows move between notices
 *  - autoplay has a real pause button, not just pause-on-hover — hovering is
 *    not available to keyboard or touch users (WCAG 2.2.2)
 *  - autoplay never starts for anyone who has asked to reduce motion
 */

const AUTO_MS = 7000;

export default function RegulatoryPopup() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('reg-popup-seen')) return;
    // Respect a reduced-motion preference by not auto-advancing at all.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
    const t = setTimeout(() => setOpen(true), 1600);
    return () => clearTimeout(t);
  }, []);

  /**
   * Warm the other banners once the dialog is up. Slides change instantly, so
   * a banner that only starts downloading when its slide appears shows an
   * empty box first — briefly on a fast line, visibly on a slow one. Fetching
   * them after open costs nothing on the first paint and the four together
   * are about 600 KB, for a dialog shown once a session.
   */
  useEffect(() => {
    if (!open) return;
    NOTICES.slice(1).forEach((s) => { new Image().src = s.image.src; });
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    try { sessionStorage.setItem('reg-popup-seen', '1'); } catch { /* private mode */ }
  }, []);

  const go = useCallback((n: number) => {
    setIdx((i) => (n + NOTICES.length) % NOTICES.length);
    setPlaying(false); // any deliberate move stops the carousel
  }, []);

  /* autoplay */
  useEffect(() => {
    if (!open || !playing) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % NOTICES.length), AUTO_MS);
    return () => clearInterval(id);
  }, [open, playing]);

  /* focus management, key handling, scroll lock */
  useEffect(() => {
    if (!open) return;

    returnTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowRight') { go(idx + 1); return; }
      if (e.key === 'ArrowLeft') { go(idx - 1); return; }
      if (e.key !== 'Tab') return;

      const f = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!f?.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, go, idx]);

  /* hand focus back where it came from */
  useEffect(() => {
    if (!open && returnTo.current) {
      returnTo.current.focus?.();
      returnTo.current = null;
    }
  }, [open]);

  if (!open) return null;

  const n = NOTICES[idx];

  return (
    <div
      className="rpop-overlay"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className={`rpop rpop-${n.theme}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rpop-title"
        ref={dialogRef}
      >
        <button ref={closeRef} type="button" className="rpop-x" onClick={close} aria-label="Close notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* The live region announces each notice as it changes. */}
        <div className="rpop-body" aria-live="polite">
          {/*
            The banner as kalpatarumulti.com publishes it. alt is empty on
            purpose: the same content follows as real text below, and a screen
            reader should hear it once, not twice. Intrinsic width/height stop
            the dialog jumping as each image loads.
          */}
          <img
            className="rpop-img"
            src={n.image.src}
            alt=""
            width={n.image.w}
            height={n.image.h}
            /* All four are warmed when the dialog opens, so none of them
               needs to lazy-load into an empty box mid-carousel. */
            decoding="async"
          />

          {/*
            The picture's content, in text. Visually hidden because the image
            above already shows it, but it is what assistive technology reads,
            what the site's accessibility toolkit can enlarge, and what a
            translation tool can translate — none of which work on a JPEG.
          */}
          <div className="rpop-alt sr-only">
            <p className="rpop-source">{n.source}</p>
            <h2 className="rpop-title" id="rpop-title">
              {n.titleHi && <span className="rpop-title-hi" lang="hi">{n.titleHi}</span>}
              {n.title}
            </h2>
            <p className="rpop-lead">{n.lead}</p>

            {n.groups?.map((g) => (
              <div className="rpop-group" key={g.heading}>
                <p className="rpop-group-h">{g.heading}</p>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>
                      <CheckCircle size={15} strokeW={2.3} aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <a href={n.cta.href} {...EXT} className="rpop-cta" onClick={close}>
            {n.cta.label} <ArrowRight size={16} strokeW={2.3} />
          </a>

          {n.footnote && <p className="rpop-note">{n.footnote}</p>}
        </div>

        <div className="rpop-foot">
          <button
            type="button"
            className="rpop-play"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause automatic slides' : 'Play automatic slides'}
          >
            {playing ? <PauseIcon size={14} strokeW={2.2} /> : <PlayIcon size={14} strokeW={2.2} />}
          </button>

          <div className="rpop-dots" role="tablist" aria-label="Choose a notice">
            {NOTICES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={s.title}
                className={`rpop-dot${i === idx ? ' on' : ''}`}
                onClick={() => go(i)}
              />
            ))}
          </div>

          <span className="rpop-count">{idx + 1} / {NOTICES.length}</span>
        </div>

        {playing && <span className="rpop-progress" key={`p-${idx}`} aria-hidden="true" />}
      </div>
    </div>
  );
}
