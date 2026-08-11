import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { MF_TOOLS } from '@/lib/pages-data';
import { PORTALS, MAPS, EXT } from '@/lib/links';
import {
  Rupee, TrendUp, Shield, CheckCircle, ArrowRight, IdCard, Phone, Headset, FileText, WhatsApp,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'MF Online — Invest in Mutual Funds | Kalpataru Multiplier Ltd',
  description:
    'Invest in mutual funds online with Kalpataru Multiplier Ltd (ARN-124674) — start a SIP from ₹500 and track your consolidated portfolio.',
};

const WHY = [
  { icon: Rupee, t: 'SIP from ₹500', d: 'Start small and stay consistent — the simplest way to build long-term wealth.' },
  { icon: TrendUp, t: 'Every major AMC', d: 'Equity, debt, hybrid, ELSS and solution-oriented schemes in one place.' },
  { icon: Shield, t: 'ARN-registered distributor', d: 'AMFI-registered (ARN-124674) with a dedicated mutual fund desk since the 1990s.' },
  { icon: Headset, t: 'Advice, not just access', d: 'Portfolio reviews and goal-based guidance from our MF team in Bhopal.' },
];

const STEPS = [
  { n: '01', t: 'Complete your KYC', d: 'One-time KYC through any SEBI-registered intermediary — do it once, invest anywhere.' },
  { n: '02', t: 'Open an MF account', d: 'Link your folios to Kalpataru under ARN-124674 so every scheme is serviced from one desk.' },
  { n: '03', t: 'Start a SIP or lumpsum', d: 'Set up a mandate from ₹500 a month, or invest a one-time amount.' },
  { n: '04', t: 'Track in one place', d: 'Use the MF portfolio login for a consolidated view across every fund house.' },
];

export default function MfOnlinePage() {
  return (
    <main id="main">
      <PageHero
        crumb="MF Online"
        words={[
          { text: 'Invest' }, { text: 'in' }, { text: 'Mutual', accent: true },
          { text: 'Funds,' }, { text: 'Online.' },
        ]}
        lead="Our own MF platform and a consolidated portfolio view — all linked to Kalpataru's AMFI registration (ARN-124674)."
        cta={
          <a href={PORTALS.mutualFund} {...EXT} className="btn btn-white">
            OPEN MF PORTAL
          </a>
        }
      />

      {/* Why */}
      <section className="section why-strip watch" aria-labelledby="why-h">
        <div className="container">
          <h2 id="why-h" style={{ textAlign: 'center', fontSize: 30, fontWeight: 600 }}>
            Why Invest Through Kalpataru
          </h2>
          <p className="sub" style={{ textAlign: 'center', margin: '12px auto 40px', maxWidth: 580 }}>
            Distribution backed by three decades of advice, not just a transaction screen.
          </p>
          <div className="why-strip-grid stagger">
            {WHY.map((w) => (
              <div className="wsi" key={w.t}>
                <w.icon size={22} />
                <div>
                  <div className="t">{w.t}</div>
                  <div className="d">{w.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section steps watch" aria-labelledby="how-h">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="grid-lines"></div>
        <div className="container">
          <h2 id="how-h">How to Start Investing</h2>
          <p className="sub">Four steps from first-timer to first SIP.</p>
          <div className="steps-grid stagger" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <div className="connector" aria-hidden="true"></div>
            {STEPS.map((s, i) => (
              <div className="step" key={s.n}>
                <div className="step-num" style={{ '--d': `${i * 0.7}s` } as React.CSSProperties}>{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
          <div className="steps-cta">
            <a href={PORTALS.mutualFund} {...EXT} className="btn btn-white">START A SIP</a>
          </div>
        </div>
      </section>

      {/* Invest online */}
      <section className="section mkt-explore watch" aria-labelledby="amc-h">
        <div className="container">
          <div className="mkt-sec-head">
            <div>
              <h2 id="amc-h" className="sec-title">Invest Online</h2>
              <p className="sec-sub">
                Transact and track your mutual fund portfolio through our platforms — every folio
                stays mapped to Kalpataru for servicing.
              </p>
            </div>
          </div>

          <div className="mf-tools stagger">
            {MF_TOOLS.map((t) => (
              <a key={t.label} href={t.href} {...EXT} className="mf-tool">
                <span className="mf-tool-ico"><IdCard size={20} strokeW={1.9} /></span>
                <span>
                  <span className="mf-tool-t">{t.label}</span>
                  <span className="mf-tool-d">{t.desc}</span>
                </span>
                <ArrowRight size={16} strokeW={2.2} />
              </a>
            ))}
          </div>

          <div className="data-notice" role="note" style={{ marginTop: 26 }}>
            <FileText size={20} strokeW={1.9} />
            <p>
              <strong>ARN-124674 · AMFI registered distributor.</strong> Mutual fund investments
              are subject to market risks; read all scheme-related documents carefully. Past
              performance is not indicative of future returns.
            </p>
          </div>
        </div>
      </section>

      {/* MF desk */}
      <section className="section help watch" aria-labelledby="desk-h">
        <div className="container">
          <h2 id="desk-h">Need Help Choosing?</h2>
          <p className="sub">
            Our mutual fund desk reviews portfolios, maps goals and sets up SIPs — at no extra cost.
          </p>
          <div className="help-grid stagger">
            <div className="hcard">
              <div className="icon"><Phone strokeW={1.8} /></div>
              <h3>Mutual Funds Desk</h3>
              <p className="note">Dedicated support for MF &amp; SIPs</p>
              <a className="tel" href="tel:07554350141">0755-4350141</a>
              <a className="tel" href="tel:07554262655">0755-4262655</a>
              <div className="wa-row">
                <a href={MAPS.whatsapp} {...EXT} className="btn btn-wa">
                  <WhatsApp /> 76489 83065
                </a>
                <a href={MAPS.whatsappAlt} {...EXT} className="btn btn-wa">
                  <WhatsApp /> 95897 54231
                </a>
              </div>
              <a className="mail" href="mailto:kmlho@kalpatarumulti.com">
                <CheckCircle size={16} strokeW={1.8} /> kmlho@kalpatarumulti.com
              </a>
            </div>
            <div className="hcard">
              <div className="icon"><Rupee strokeW={1.8} /></div>
              <h3>Start a ₹500 SIP</h3>
              <p className="note">The easiest first step</p>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7 }}>
                A monthly SIP averages your purchase price across market cycles and builds
                discipline — begin with as little as ₹500.
              </p>
              <a href={PORTALS.mutualFund} {...EXT} className="btn btn-navy" style={{ marginTop: 14, width: '100%' }}>
                Invest Now
              </a>
            </div>
            <div className="hcard">
              <div className="icon"><Shield strokeW={1.8} /></div>
              <h3>Open an MF Account</h3>
              <p className="note">Fully digital, in about five minutes</p>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7 }}>
                Complete Aadhaar-based eKYC and start investing across every major fund house,
                with our desk on hand for portfolio reviews.
              </p>
              <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-outline" style={{ marginTop: 14, width: '100%' }}>
                Open MF Account
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>₹500 a month is where it starts</h2>
          <p>Open a free mutual fund account and set up your first SIP today.</p>
          <div className="row">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">OPEN FREE ACCOUNT</a>
            <a href={PORTALS.mutualFund} {...EXT} className="btn btn-red">Go to MF Portal</a>
          </div>
        </div>
      </section>
    </main>
  );
}
