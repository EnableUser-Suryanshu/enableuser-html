import CountUp from './CountUp';

/**
 * Animated growth curve for the Mutual Funds card.
 *
 * The figures are a worked illustration of compounding, NOT a performance
 * record — the label and the disclaimer under the chart say so, and the
 * numbers are deliberately round. Do not restate them as achieved returns:
 * a SEBI-registered distributor showing an unqualified gain figure is a
 * marketing-compliance problem (see the risk line on /mf-online).
 *
 * The SVG is decorative and hidden from assistive tech; every number is real
 * HTML text beside it, so a screen reader gets the content without the
 * geometry. Motion is CSS-driven, so the global prefers-reduced-motion rule
 * settles it straight to the final frame.
 */
export default function MfGrowthChart() {
  const LINE = 'M0 152C34 149 58 131 92 127S139 133 164 105S214 87 240 62S288 33 320 13';
  const AREA = `${LINE}L320 180L0 180Z`;
  // x/y along the curve, for the markers that pop in as it draws
  const DOTS = [[92, 127], [164, 105], [240, 62], [320, 13]];

  return (
    <div className="mfg">
      <div className="mfg-plot">
      <svg className="mfg-svg" viewBox="0 0 320 180" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="mfgFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--red)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[36, 72, 108, 144].map((x) => (
          <line key={x} className="mfg-grid" x1={x * 2} y1="0" x2={x * 2} y2="180" />
        ))}

        <path className="mfg-area" d={AREA} fill="url(#mfgFill)" />
        <path className="mfg-line" d={LINE} fill="none" stroke="var(--red)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" />

        {DOTS.map(([cx, cy], i) => (
          <circle key={cx} className="mfg-dot" cx={cx} cy={cy} r={i === DOTS.length - 1 ? 6 : 4}
            style={{ '--d': `${1.15 + i * 0.16}s` } as React.CSSProperties} />
        ))}
      </svg>

      <div className="mfg-card">
        <span className="mfg-eyebrow">Illustrative growth</span>
        <strong className="mfg-value">
          ₹<CountUp target={252100} />
        </strong>
        <span className="mfg-bar" aria-hidden="true"><i /></span>
        <span className="mfg-invested">Invested ₹1,00,000</span>
      </div>
      </div>

      <p className="mfg-note">
        Illustrative example only — not an indication of returns. Mutual fund investments are
        subject to market risks; read all scheme-related documents carefully.
      </p>
    </div>
  );
}
