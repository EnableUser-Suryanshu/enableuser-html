'use client';

import { useEffect, useRef, useState } from 'react';
import { PauseIcon, PlayIcon } from './icons';

/**
 * SEBI-mandated investor awareness messages (standard notices required to be
 * displayed by all stock brokers / depository participants).
 */
const NOTICES = [
  'Stock Brokers can accept securities as margin from clients only by way of pledge in the depository system w.e.f. September 1, 2020.',
  'Update your mobile number & email ID with your stock broker / depository participant and receive OTP directly from the depository on your email ID and/or mobile number to create pledge.',
  'Pay 20% upfront margin of the transaction value to trade in the cash market segment.',
  'Check your securities / MF / bonds in the consolidated account statement issued by NSDL / CDSL every month.',
  'Prevent unauthorised transactions in your account — update your mobile number and email ID with your stock broker. Receive information of your transactions directly from the Exchange on your mobile / email at the end of the day. Issued in the interest of investors.',
  'KYC is a one-time exercise while dealing in securities markets — once KYC is done through a SEBI registered intermediary (broker, DP, mutual fund etc.), you need not undergo the same process again when you approach another intermediary.',
  'No need to issue cheques by investors while subscribing to IPO. Just write the bank account number and sign in the application form to authorise your bank to make payment in case of allotment. No worries for refund as the money remains in the investor’s account.',
  // Options advisory prescribed by NSE circular NSE/INSP/52900. The full
  // five-point list is on the Advisory for Investors page; this is the
  // sitewide notice the circular asks to be displayed.
  'Refrain from sharing trading credentials, from trading in leveraged products like options without proper understanding, from dealing in unsolicited tips through WhatsApp, Telegram, YouTube, Facebook, SMS or calls, and from trading in options based on recommendations from unauthorised or unregistered advisors and influencers.',
];

const INTERVAL_MS = 7000;

export default function InvestorNotice() {
  const [idx, setIdx] = useState(0);
  // Auto-rotation stops permanently once the user takes control (or presses pause).
  const [autoOn, setAutoOn] = useState(true);
  const [hovered, setHovered] = useState(false);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceRef.current) setAutoOn(false);
  }, []);

  const rotating = autoOn && !hovered;

  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(() => {
      if (document.documentElement.classList.contains('motion-paused')) return;
      setIdx((i) => (i + 1) % NOTICES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [rotating]);

  const goTo = (i: number) => {
    setAutoOn(false); // user has taken control
    setIdx(((i % NOTICES.length) + NOTICES.length) % NOTICES.length);
  };

  return (
    <aside
      className="inv-notice"
      aria-label="Attention investors — regulatory notices"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="container inv-row">
        <div className="inv-badge">
          <span className="inv-beacon" aria-hidden="true"></span>
          ATTENTION INVESTORS
        </div>

        {/* Announce only when the user is navigating manually — silent while auto-rotating. */}
        <div className="inv-msg-wrap" aria-live={autoOn ? 'off' : 'polite'}>
          <p className="inv-msg" key={idx}>{NOTICES[idx]}</p>
          {rotating && <span className="inv-progress" key={`p-${idx}`} aria-hidden="true"></span>}
        </div>

        <div className="inv-ctl">
          <button
            aria-pressed={!autoOn}
            aria-label={autoOn ? 'Pause automatic rotation of notices' : 'Resume automatic rotation of notices'}
            onClick={() => setAutoOn((v) => !v)}
          >
            {autoOn ? <PauseIcon size={13} strokeW={2.2} /> : <PlayIcon size={13} strokeW={2.2} />}
          </button>
          <button aria-label="Previous notice" onClick={() => goTo(idx - 1)}>‹</button>
          <span className="inv-count">{idx + 1}/{NOTICES.length}</span>
          <button aria-label="Next notice" onClick={() => goTo(idx + 1)}>›</button>
        </div>
      </div>

      <div className="inv-dots">
        {NOTICES.map((_, i) => (
          <button
            key={i}
            aria-label={`Show notice ${i + 1} of ${NOTICES.length}`}
            aria-pressed={i === idx}
            className={i === idx ? 'on' : undefined}
            onClick={() => goTo(i)}
          ></button>
        ))}
      </div>
    </aside>
  );
}
