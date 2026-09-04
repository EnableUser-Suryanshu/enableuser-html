import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import MarginCalculator from '@/components/pages/MarginCalculator';
import MarketNews from '@/components/MarketNews';
import { PORTALS, EXT } from '@/lib/links';
import { Shield, TrendUp, Rupee, ArrowRight } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Margin Calculator — Kalpataru Multiplier Ltd',
  description:
    'Work out the margin required for an NSE cash-market trade using the exchange’s own published VaR and extreme-loss margin rates, for both intraday and delivery.',
};

const POINTS = [
  {
    icon: Shield,
    t: 'Exchange rates, not estimates',
    d: 'Every percentage comes from NSE Clearing’s daily VaR file — the same figures the clearing corporation applies.',
  },
  {
    icon: TrendUp,
    t: 'Intraday and delivery',
    d: 'See the upfront margin for an intraday position, or the full amount a delivery trade settles for.',
  },
  {
    icon: Rupee,
    t: 'Broken down in full',
    d: 'VaR, extreme loss and any adhoc margin are shown separately, so you can see exactly what makes up the number.',
  },
];

export default function MarginCalculatorPage() {
  return (
    <main id="main">
      <PageHero
        crumb="Tools · Margin Calculator"
        words={[
          { text: 'Know' }, { text: 'the' }, { text: 'Margin', accent: true },
          { text: 'Before' }, { text: 'You' }, { text: 'Trade.' },
        ]}
        lead="Enter a stock, quantity and price to see exactly what the exchange requires — calculated from NSE Clearing’s own published margin rates, refreshed through the session."
        cta={
          <a href={PORTALS.webTrading} {...EXT} className="btn btn-white">
            LAUNCH WEB TRADING
          </a>
        }
      />

      <section className="section mcalc-sec watch" aria-labelledby="calc-h">
        <div className="container">
          <h2 id="calc-h" className="sec-title" style={{ textAlign: 'center' }}>
            Cash Market Margin Calculator
          </h2>
          <p className="sec-sub" style={{ textAlign: 'center', margin: '10px auto 34px', maxWidth: 600 }}>
            NSE equity and BE series, priced off the latest published rates.
          </p>
          <MarginCalculator />
        </div>
      </section>

      <section className="section why-strip watch" aria-labelledby="why-h">
        <div className="container">
          <h2 id="why-h" style={{ textAlign: 'center', fontSize: 30, fontWeight: 600 }}>
            How This Is Calculated
          </h2>
          <p className="sub" style={{ textAlign: 'center', margin: '12px auto 40px', maxWidth: 620 }}>
            Since SEBI’s peak-margin rules took full effect, intraday leverage is set by the
            exchange, not the broker. This shows you that number.
          </p>
          <div className="why-strip-grid stagger">
            {POINTS.map((p) => (
              <div className="wsi" key={p.t}>
                <p.icon size={22} />
                <div>
                  <div className="t">{p.t}</div>
                  <div className="d">{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section news watch" aria-labelledby="news-h">
        <div className="container news-grid one">
          <div className="reveal">
            <h2 id="news-h" className="sr-only">Market news</h2>
            <MarketNews limit={8} heading="While You’re Here" />
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Ready to place the trade?</h2>
          <p>Open a 3-in-1 trading, demat and mutual fund account, or jump straight into the terminal.</p>
          <div className="row">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">OPEN FREE ACCOUNT</a>
            <Link href="/markets" className="btn btn-red">
              Explore the markets <ArrowRight size={15} strokeW={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
