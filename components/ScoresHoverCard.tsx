'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SCORES_NOTICE } from '@/lib/notices';

/**
 * Shows the SCORES notice at the point it is useful: hovering or focusing any
 * link to scores.sebi.gov.in, anywhere on the site.
 *
 * Mounted once and delegated from the document, so it covers links in page
 * copy, the footer and the escalation matrix without any of them knowing
 * about it — and keeps working for links rendered after this mounts.
 *
 * WCAG 1.4.13, Content on Hover or Focus, is the whole design here. Content
 * that appears on hover must be:
 *  - dismissible — Escape closes it without moving the pointer
 *  - hoverable   — the pointer can travel onto the card and it stays, which is
 *                  why closing is delayed rather than immediate on mouseleave
 *  - persistent  — it stays until the pointer leaves both link and card, focus
 *                  moves away, or Escape
 * It is also shown on keyboard focus, not hover alone: hover is not available
 * to keyboard or touch users.
 */

const MATCH = 'a[href*="scores.sebi.gov.in"]';
/** Long enough to move the pointer from the link onto the card. */
const CLOSE_DELAY = 220;

interface Pos { top: number; left: number; }

export default function ScoresHoverCard() {
  const [pos, setPos] = useState<Pos | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  }, []);

  const close = useCallback(() => { cancelClose(); setPos(null); }, [cancelClose]);
  const closeSoon = useCallback(() => {
    cancelClose();
    timer.current = setTimeout(() => setPos(null), CLOSE_DELAY);
  }, [cancelClose]);

  /** Positions the card near the link, kept inside the viewport. */
  const openFor = useCallback((link: HTMLElement) => {
    cancelClose();
    const r = link.getBoundingClientRect();
    const w = 320;
    const left = Math.min(Math.max(12, r.left), window.innerWidth - w - 12);
    // Below the link normally; above it when there is no room below.
    const below = window.innerHeight - r.bottom;
    const top = below > 420 ? r.bottom + 10 : Math.max(12, r.top - 430);
    setPos({ top, left });
  }, [cancelClose]);

  useEffect(() => {
    const onOver = (e: Event) => {
      const link = (e.target as HTMLElement | null)?.closest?.(MATCH);
      if (link) openFor(link as HTMLElement);
    };
    const onOut = (e: Event) => {
      const link = (e.target as HTMLElement | null)?.closest?.(MATCH);
      if (link) closeSoon();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };

    // Capture phase: focus and blur do not bubble.
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('focusin', onOver);
    document.addEventListener('focusout', onOut);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('focusin', onOver);
      document.removeEventListener('focusout', onOut);
      document.removeEventListener('keydown', onKey);
      cancelClose();
    };
  }, [openFor, closeSoon, close, cancelClose]);

  if (!pos) return null;

  const n = SCORES_NOTICE;

  return (
    <div
      ref={cardRef}
      className="shc"
      style={{ top: pos.top, left: pos.left }}
      /* Hoverable: moving onto the card keeps it open. */
      onMouseEnter={cancelClose}
      onMouseLeave={closeSoon}
      /* Not a dialog — it takes no focus and traps nothing. It is
         supplementary content attached to the link that summoned it. */
      role="note"
      aria-label={n.title}
    >
      <img className="shc-img" src={n.image.src} alt="" width={n.image.w} height={n.image.h} />

      {/* The banner's content as text, for anyone the picture does not reach. */}
      <div className="sr-only">
        <p>{n.title}</p>
        <p>{n.lead}</p>
        {n.groups?.map((g) => (
          <div key={g.heading}>
            <p>{g.heading}</p>
            <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
        {n.footnote && <p>{n.footnote}</p>}
      </div>

      {n.footnote && <p className="shc-note">{n.footnote}</p>}
    </div>
  );
}
