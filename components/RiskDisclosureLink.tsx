'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RISK_DISCLOSURE as R } from '@/lib/risk-disclosure';
import { EXT } from '@/lib/links';
import { ArrowRight, Shield } from './icons';

/**
 * The footer's "Risk Disclosures on Derivatives" entry, which opens SEBI's
 * Annexure-I rather than navigating to the study itself.
 *
 * It is a button, not a link, because it goes nowhere — announcing it as a
 * link and then not moving the page is the kind of small lie that makes a
 * screen reader hard to trust. aria-haspopup="dialog" says what it does.
 *
 * The same modal discipline as the notices dialog: focus moves in on open and
 * returns to the button on close, Tab cycles inside, Escape closes, the page
 * behind does not scroll. The findings are real text — they are a mandated
 * disclosure and have to be readable, selectable and translatable, which a
 * screenshot of the annexure would not be.
 */
export default function RiskDisclosureLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
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
  }, [open, close]);

  /* Focus goes back to the button that opened it, not to the top of the page. */
  useEffect(() => { if (!open) btnRef.current?.focus({ preventScroll: true }); }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={className}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Risk Disclosures on Derivatives
      </button>

      {open && (
        <div
          className="rdx-overlay"
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div
            className="rdx"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rdx-title"
            ref={dialogRef}
          >
            <button ref={closeRef} type="button" className="rdx-x" onClick={close} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="rdx-head">
              <Shield size={20} strokeW={2} aria-hidden="true" />
              <span>{R.annexure}</span>
            </div>

            <div className="rdx-body">
              <h2 className="rdx-title" id="rdx-title">{R.heading}</h2>

              <ul className="rdx-list">
                {R.findings.map((f) => <li key={f}>{f}</li>)}
              </ul>

              <p className="rdx-src-h">{R.source.lead}</p>
              <p className="rdx-src">{R.source.text}</p>

              <a href={R.source.href} {...EXT} className="rdx-cta" onClick={close}>
                {R.source.label} <ArrowRight size={15} strokeW={2.3} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
