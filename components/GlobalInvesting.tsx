import { PORTALS, EXT } from '@/lib/links';
import { ArrowRight } from './icons';

/**
 * US stocks through NSE IX (NSE International Exchange) at GIFT City.
 *
 * Claims are limited to what is structurally true of the NSE IX route: it is
 * an IFSCA-regulated exchange, resident Indians invest through it under the
 * RBI Liberalised Remittance Scheme, and US stocks trade there as unsponsored
 * depository receipts, which is what makes fractional quantities possible.
 *
 * Do NOT add scheme-style specifics (a stock count, a minimum ticket size,
 * "free withdrawals", charge claims) unless Kalpataru confirms them in
 * writing — those are the numbers a regulator reads as a promise.
 *
 * The artwork is deliberately abstract. No company logos or tickers: naming
 * specific US stocks implies both availability we have not verified and an
 * endorsement we do not have.
 */
export default function GlobalInvesting() {
  const FACTS = ['Regulated by IFSCA', 'Invest under RBI LRS', 'Fractional quantities'];
  // x, height — five rising bars
  const BARS = [[0, 58], [70, 92], [140, 128], [210, 170], [280, 214]];

  return (
    <section className="section gi watch" id="global-investing" aria-labelledby="gi-h">
      <div className="container gi-grid">
        <div className="gi-copy">
          <span className="gi-eyebrow">Global investing · NSE IX, GIFT City</span>
          <h2 id="gi-h" className="gi-title">
            Invest in <span className="gi-accent">US Stocks</span> from India
          </h2>
          <p className="gi-sub">
            Add global names to your portfolio without leaving the Indian banking system —
            alongside the equity, F&amp;O and mutual fund accounts you already hold with us.
          </p>

          <ul className="gi-facts">
            {FACTS.map((f) => <li key={f}>{f}</li>)}
          </ul>

          <a href={PORTALS.globalInvesting} {...EXT} className="btn btn-red gi-cta">
            Open Free Account <ArrowRight size={16} strokeW={2.2} />
          </a>

          <p className="gi-note">
            Overseas investments carry market risk and currency risk, and are subject to the limits
            and conditions of the RBI Liberalised Remittance Scheme.
          </p>
        </div>

        <div className="gi-art" aria-hidden="true">
          <svg viewBox="0 0 380 268" role="presentation" focusable="false">
            <line className="gi-base" x1="0" y1="250" x2="366" y2="250" />
            {BARS.map(([x, h], i) => (
              <rect
                key={x}
                className="gi-bar"
                x={x + 6}
                y={250 - h}
                width={54}
                height={h}
                rx="7"
                style={{ '--i': i } as React.CSSProperties}
              />
            ))}
            <path className="gi-trend" d="M14 196C84 178 150 140 214 96S320 30 356 14" />
            <path className="gi-head" d="M330 10L358 12L352 40" />
          </svg>
        </div>
      </div>
    </section>
  );
}
