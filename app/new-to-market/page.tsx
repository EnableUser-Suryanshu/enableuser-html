import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import LearnPath, { type Step } from '@/components/pages/LearnPath';
import {
  NTM_RESOURCES, GOLD_ROUTES, COMMODITY_LOGINS,
  ACCOUNT_OPENING_ROUTES, SARAL_AOF_SET, SARAL_AOF_NOTE,
} from '@/lib/pages-data';
import { PORTALS, EXT } from '@/lib/links';
import {
  FileText, FilePdf, ArrowRight, Shield, TrendUp, Rupee, Bank, Swap,
  CheckCircle, Rocket, IdCard, Globe,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'New to the Market — Kalpataru Multiplier Ltd',
  description:
    'A beginner’s guide to investing in India: demat and trading accounts, how orders work, margin pledge, SIPs, gold routes and the resources every new investor should read.',
};

const STEPS: Step[] = [
  {
    title: 'Understand what you are buying',
    summary: 'Shares, mutual funds, bonds and commodities — and how they differ.',
    points: [
      'A share makes you a part-owner of a company; its value moves with the company and the market.',
      'A mutual fund pools money from many investors and is managed by a professional fund manager — the simplest start for most people.',
      'Bonds and NCDs pay fixed interest and sit lower on the risk ladder than equities.',
      'Commodities (gold, silver, crude, agri) trade on MCX and NCDEX, usually as futures contracts.',
      'Derivatives (F&O) magnify both gains and losses — they are not a starting point for new investors.',
    ],
  },
  {
    title: 'Open a demat and trading account',
    summary: 'Two accounts working together, opened digitally in about five minutes.',
    points: [
      'The trading account places your buy and sell orders on the exchange.',
      'The demat account holds your shares electronically — with CDSL, in your own name, never in the broker’s.',
      'Kalpataru’s 3-in-1 account bundles trading, demat and mutual funds together — trading and demat account opening is free.',
      'Keep your PAN, Aadhaar (linked to your mobile), bank proof and a signature image ready for eKYC.',
    ],
  },
  {
    title: 'Complete KYC — just once',
    summary: 'One KYC through any SEBI-registered intermediary covers you everywhere.',
    points: [
      'KYC is a one-time exercise across the securities market — once done through a broker, DP or mutual fund, you need not repeat it elsewhere.',
      'Always update your mobile number and email ID with your broker and DP so you receive exchange alerts directly.',
      'You will receive contract notes and a consolidated account statement — read them, they are your audit trail.',
    ],
  },
  {
    title: 'Learn how orders work',
    summary: 'Market, limit, stop-loss and the difference between intraday and delivery.',
    points: [
      'A market order executes at the best available price; a limit order executes only at your chosen price or better.',
      'A stop-loss order protects you by exiting automatically if the price moves against you.',
      'Intraday positions must be squared off the same day; delivery means the shares settle into your demat account.',
      'Pay a 20% upfront margin of the transaction value to trade in the cash market segment.',
    ],
  },
  {
    title: 'Understand margin and pledge',
    summary: 'Since September 2020, margin against shares works through the depository pledge system.',
    points: [
      'Brokers can accept securities as margin only by way of pledge in the depository system.',
      'You will receive an OTP directly from the depository on your registered mobile or email to create a pledge — never share it with anyone.',
      'Read the Margin Pledge note and the ANMI–Secmark FAQ in the resource library below before pledging.',
    ],
  },
  {
    title: 'Start small, stay regular',
    summary: 'A ₹500 monthly SIP beats waiting for the perfect entry.',
    points: [
      'SIPs average your purchase price across market cycles and remove the pressure of timing.',
      'Diversify across asset classes rather than concentrating in a handful of stocks.',
      'Review your portfolio periodically with our desk — goals change, and so should allocation.',
      'Never trade on unsolicited tips; act only on research from a registered intermediary.',
    ],
  },
];

const ACCOUNTS = [
  { icon: TrendUp, t: 'Trading Account', d: 'Places your orders on NSE and BSE across equity, F&O and currency.' },
  { icon: Shield, t: 'Demat Account', d: 'Holds your securities electronically with CDSL — DP-ID 12031600.' },
  { icon: Rupee, t: 'Mutual Fund Account', d: 'Invest in SIPs and lumpsum across every major AMC.' },
];

const SEGMENTS = [
  { icon: TrendUp, t: 'Equity', d: 'Buy and sell shares on NSE & BSE, intraday or delivery.' },
  { icon: Swap, t: 'F&O', d: 'Index and stock futures and options — for experienced traders.' },
  { icon: Bank, t: 'Commodity', d: 'Bullion, energy, metals and agri on MCX and NCDEX.' },
  { icon: Globe, t: 'Currency', d: 'Exchange-traded USD, EUR, GBP and JPY pairs against the rupee.' },
  { icon: Rocket, t: 'IPO', d: 'Apply to public issues online with a UPI mandate.' },
  { icon: IdCard, t: 'Depository', d: 'Safe custody and settlement of everything you own.' },
];

export default function NewToMarketPage() {
  return (
    <main id="main">
      <PageHero
        crumb="New to Market"
        words={[
          { text: 'Your' }, { text: 'First' }, { text: 'Step', accent: true },
          { text: 'Into' }, { text: 'the' }, { text: 'Market.' },
        ]}
        lead="No jargon, no assumptions. What the accounts do, how orders and margin work, and the documents every new investor should read — from a broker that has guided first-timers since 1992."
        cta={
          <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">
            OPEN FREE ACCOUNT
          </a>
        }
      />

      {/* Three accounts */}
      <section className="section why-strip watch" aria-labelledby="acc-h">
        <div className="container">
          <h2 id="acc-h" style={{ textAlign: 'center', fontSize: 30, fontWeight: 600 }}>
            The Three Accounts You Need
          </h2>
          <p className="sub" style={{ textAlign: 'center', margin: '12px auto 40px', maxWidth: 600 }}>
            Kalpataru bundles all three into one 3-in-1 account — with free trading and demat account opening.
          </p>
          <div className="values-grid stagger">
            {ACCOUNTS.map((a) => (
              <div className="value-card" key={a.t}>
                <div className="vc-icon"><a.icon size={30} /></div>
                <h3>{a.t}</h3>
                <p>{a.d}</p>
              </div>
            ))}
          </div>
          <p className="pillar-note" style={{ margin: '28px auto 0' }}>
            T&amp;C: Trading and demat account opening is free. A one-time ₹3,125 lifetime AMC applies to the
            3-in-1 account, of which ₹2,600 is refunded when the account is closed. Other statutory charges,
            taxes and levies apply as per the tariff sheet.
          </p>
        </div>
      </section>

      {/* Account opening — both routes (audit point 12) */}
      <section className="section watch" aria-labelledby="open-h" id="how-to-open">
        <div className="container">
          <h2 id="open-h" className="sec-title">How to Open Your Account</h2>
          <p className="sec-sub" style={{ maxWidth: 760 }}>
            Two routes, the same account at the end of it. Open it online with Aadhaar-based eKYC,
            or fill a physical form at any branch if you would rather do it in person.
          </p>

          <div className="bank-grid" style={{ marginTop: 34 }}>
            {ACCOUNT_OPENING_ROUTES.map((r, i) => (
              <div className={`bank-card reveal ${i === 0 ? 'rv-left' : 'rv-right'}`} key={r.key}>
                <div className="head">
                  {r.key === 'online' ? <Rocket size={24} /> : <FileText size={24} />} {r.title}
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600, marginBottom: 16 }}>
                  {r.strap}
                </p>
                <ol className="esc-list">
                  {r.steps.map((s, n) => (
                    <li className="esc-item" key={s}>
                      <span className="esc-num">{n + 1}</span>
                      <div><div className="esc-detail">{s}</div></div>
                    </li>
                  ))}
                </ol>
                {r.key === 'online' ? (
                  <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-red" style={{ marginTop: 18 }}>
                    Start eKYC <ArrowRight size={16} strokeW={2.2} />
                  </a>
                ) : (
                  <Link href="/downloads" className="btn btn-outline" style={{ marginTop: 18 }}>
                    Download the forms <ArrowRight size={16} strokeW={2.2} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="data-notice" role="note" style={{ marginTop: 30 }}>
            <IdCard size={20} strokeW={1.9} />
            <p>{SARAL_AOF_NOTE}</p>
          </div>

          <div className="res-grid stagger" style={{ marginTop: 22 }}>
            {SARAL_AOF_SET.map((r) =>
              r.href ? (
                <a key={r.label} href={r.href} {...EXT} className="res-card">
                  <span className="res-kind pdf">PDF</span>
                  <span className="res-body">
                    <span className="res-title">{r.label}</span>
                    <span className="res-desc">{r.desc}</span>
                  </span>
                  <span className="res-go" aria-hidden="true"><FilePdf size={20} strokeW={1.8} /></span>
                </a>
              ) : (
                <div key={r.label} className="res-card">
                  <span className="res-kind">SOON</span>
                  <span className="res-body">
                    <span className="res-title">{r.label}</span>
                    <span className="res-desc">
                      {r.desc} Ask the DP desk on 0755-4350143 for a copy until it is published here.
                    </span>
                  </span>
                </div>
              ),
            )}
          </div>

          <p className="pillar-note" style={{ margin: '26px auto 0' }}>
            Already a client? Nomination, Re-KYC and account closure can all be completed online —
            see <Link href="/account-services" className="link-red">Account Services</Link>.
          </p>
        </div>
      </section>

      {/* Learning path */}
      <section className="section journey watch" aria-labelledby="path-h">
        <div className="container">
          <h2 id="path-h">Start Here — Six Steps</h2>
          <p className="sub">Tap any step to open it. Read in order, or jump to what you need.</p>
          <div style={{ maxWidth: 820, margin: '40px auto 0' }}>
            <LearnPath steps={STEPS} />
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="section svc-section watch" aria-labelledby="seg-h">
        <div className="container">
          <h2 id="seg-h">Where You Can Invest</h2>
          <p className="sub">Every segment available through a single Kalpataru account.</p>
          <div className="svc-grid" style={{ marginTop: 40 }}>
            {SEGMENTS.map((s, i) => (
              <article className={`svc-card reveal${i % 3 === 0 ? ' rv-left' : i % 3 === 2 ? ' rv-right' : ''}`} key={s.t}>
                <div className="svc-icon"><s.icon size={26} /></div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <Link href="/services" className="link-red">
                  Learn more <ArrowRight size={15} strokeW={2.2} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Resource library */}
      <section className="section memberships watch" aria-labelledby="res-h">
        <div className="container">
          <h2 id="res-h">Resource Library</h2>
          <p className="sub">
            The margin, pledge and budget documents published by Kalpataru — download and keep.
          </p>
          <div className="res-grid stagger">
            {NTM_RESOURCES.map((r) => (
              <a key={r.label} href={r.href} {...EXT} className="res-card">
                <span className={`res-kind ${r.kind.toLowerCase()}`}>{r.kind}</span>
                <span className="res-body">
                  <span className="res-title">{r.label}</span>
                  <span className="res-desc">{r.desc}</span>
                </span>
                <span className="res-go" aria-hidden="true"><FilePdf size={20} strokeW={1.8} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Gold + commodity logins */}
      <section className="section bank watch" aria-labelledby="gold-h">
        <div className="container">
          <h2 id="gold-h" style={{ textAlign: 'center', fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
            Smart Ways to Own Gold
          </h2>
          <p className="sub" style={{ textAlign: 'center', margin: '0 auto 34px', maxWidth: 560 }}>
            Skip the locker — hold gold in your demat account instead.
          </p>
          <div className="bank-grid">
            <div className="bank-card reveal rv-left">
              <div className="head"><Rupee size={24} /> Gold Investment Routes</div>
              {GOLD_ROUTES.map((g) => (
                <a key={g.label} href={g.href} {...EXT} className="dl-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                  <strong style={{ fontSize: 14 }}>{g.label}</strong>
                  <span style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 500 }}>{g.desc}</span>
                </a>
              ))}
            </div>
            <div className="bank-card reveal rv-right">
              <div className="head"><Bank size={24} /> Commodity Trading Logins</div>
              {COMMODITY_LOGINS.map((c) => (
                <a key={c.label} href={c.href} {...EXT} className="dl-row">
                  {c.label}
                  <ArrowRight size={17} strokeW={2} />
                </a>
              ))}
              <p style={{ fontSize: 12.8, color: 'var(--ink-3)', marginTop: 14, lineHeight: 1.65 }}>
                Commodity futures carry leverage and can move sharply. Trade only with money you
                can afford to put at risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section values watch" aria-labelledby="safe-h">
        <div className="container">
          <h2 id="safe-h">Stay Safe as an Investor</h2>
          <p className="sub">Five habits that protect every beginner.</p>
          <div className="values-grid stagger" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="value-card">
              <div className="vc-icon"><Shield size={30} /></div>
              <h3>Never share OTPs</h3>
              <p>Depository OTPs for pledges, and any trading password, are yours alone — no employee will ever ask for them.</p>
            </div>
            <div className="value-card">
              <div className="vc-icon"><CheckCircle size={30} /></div>
              <h3>Check your statements</h3>
              <p>Review the consolidated account statement from NSDL/CDSL every month and your contract notes daily.</p>
            </div>
            <div className="value-card">
              <div className="vc-icon"><FileText size={30} /></div>
              <h3>Ignore unsolicited tips</h3>
              <p>Trading on recommendations from unregistered advisers or social media groups is the fastest route to losses.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Ready when you are</h2>
          <p>Open a free demat, trading and mutual fund account — or call our desk and we&apos;ll walk you through it.</p>
          <div className="row">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">OPEN FREE ACCOUNT</a>
            <a href="tel:07554350141" className="btn btn-red">Call 0755-4350141</a>
          </div>
        </div>
      </section>
    </main>
  );
}
