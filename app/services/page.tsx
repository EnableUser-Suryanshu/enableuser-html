import type { Metadata } from 'next';
import type { CSSProperties, ReactElement } from 'react';
import PageHero from '@/components/PageHero';
import BrandMarquee from '@/components/BrandMarquee';
import { FUNDS } from '@/lib/data';
import { PORTALS, APP_LINKS, EXT } from '@/lib/links';
import {
  TrendUp, Swap, Bank, Globe, Rupee, Rocket, Shield, FileText, History,
  Users, IdCard, DocLines, ArrowRight, CheckCircle, Handshake, Smartphone,
  Devices, BarChart, Search,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'Our Services — Kalpataru Multiplier Ltd',
  description:
    'Equity, F&O and currency broking on NSE & BSE, commodities on MCX & NCDEX, mutual funds, free trading & demat account opening, IPOs, bonds, NPS, insurance and more.',
};

/* ---------- panel visuals ---------- */

function TradingPanel() {
  const closes = [46, 58, 52, 68, 76, 70, 84, 96, 90, 104, 114, 108, 122, 132];
  const W = 420, H = 170, step = W / closes.length, bw = 14;
  let prev = closes[0] - 8;
  const pts: string[] = [];
  const candles = closes.map((c, i) => {
    const o = prev, up = c >= o, x = i * step + step / 2;
    const top = H - Math.max(o, c), bh = Math.max(Math.abs(c - o), 3);
    const hi = H - (Math.max(o, c) + 6), lo = H - (Math.min(o, c) - 6);
    const col = up ? '#16a34a' : '#dc2626';
    pts.push(`${x},${H - c - 12}`);
    prev = c;
    return (
      <g className="candle" style={{ '--i': i } as CSSProperties} key={i}>
        <line x1={x} y1={hi} x2={x} y2={lo} stroke={col} strokeWidth={2} />
        <rect x={x - bw / 2} y={top} width={bw} height={bh} rx={2} fill={col} />
      </g>
    );
  });
  return (
    <div className="pillar-panel">
      <div className="panel-title"><TrendUp size={18} /> NIFTY 50 — live on our platforms</div>
      <svg className="panel-chart" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {candles}
        <polyline className="trend" points={pts.join(' ')} fill="none" stroke="#bb0009" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="panel-foot">
        <span>Cash · F&amp;O · Currency</span>
        <span className="up">▲ Institutional-grade execution</span>
      </div>
    </div>
  );
}

function CommodityPanel() {
  const bullionEnergy = ['Gold', 'Silver', 'Crude Oil', 'Natural Gas'];
  const metals = ['Copper', 'Zinc', 'Lead', 'Nickel'];
  const agri = ['Soybean', 'Refined Soya', 'Guar', 'Chana', 'Sugar', 'Jeera', 'Cardamom', 'Black Pepper', 'Mentha Oil'];
  return (
    <div className="pillar-panel">
      <div className="panel-title"><Bank size={18} /> Traded on MCX &amp; NCDEX</div>
      <div className="prod-cloud">
        {bullionEnergy.map((p) => <span className="prod-chip gold" key={p}>{p}</span>)}
        {metals.map((p) => <span className="prod-chip" key={p}>{p}</span>)}
        {agri.map((p) => <span className="prod-chip" key={p}>{p}</span>)}
        <span className="prod-chip red">+ more contracts</span>
      </div>
    </div>
  );
}

function MutualFundPanel() {
  return (
    <div className="pillar-panel">
      <div className="panel-title"><Rupee size={18} /> Top silver ETF FoFs — 3Y returns</div>
      <div className="mini-funds">
        {FUNDS.slice(0, 3).map((f, i) => (
          <div className="fund" key={i}>
            <span className="flogo" style={{ background: f.color }}>{f.initials}</span>
            <span className="fmeta">
              <span className="fname">{f.name}</span><br />
              <span className="fsub">{f.sub}</span>
            </span>
            <span className="fret">{f.ret}</span>
          </div>
        ))}
      </div>
      <div className="mini-sip">
        <span className="a">₹500</span>
        <span className="b">SIP Start se — sab AMCs, ek jagah</span>
      </div>
    </div>
  );
}

function DematPanel() {
  return (
    <div className="pillar-panel">
      <div className="panel-title"><Shield size={18} /> One account, three engines</div>
      <div className="rings-wrap">
        <div className="rings">
          <div className="ring3 r1">TRADING</div>
          <div className="ring3 r2">DEMAT</div>
          <div className="ring3 r3">MUTUAL FUNDS</div>
        </div>
      </div>
      <div className="amc-stat">
        <div className="big">Free Trading &amp; Demat</div>
        <div className="small">3-in-1 account · opened digitally with eKYC</div>
      </div>
    </div>
  );
}

/* ---------- data ---------- */

type Pillar = {
  kicker: string;
  title: string;
  desc: string;
  points: string[];
  chips: string[];
  ctas: { label: string; href: string; cls: string }[];
  /* optional fine print rendered under the CTAs */
  note?: string;
  panel: () => ReactElement;
  alt: boolean;
};

const PILLARS: Pillar[] = [
  {
    kicker: '01 — Trading & Broking',
    title: 'Equity, F&O and Currency on NSE & BSE',
    desc: 'Trade the cash market, index and stock derivatives, and exchange-traded currency pairs through one account. As a clearing member on both exchanges since inception, we route your orders on institutional-grade rails — with perfect transparency in accounting, so every trade, charge and credit is visible in your back office the same day.',
    points: [
      'Intraday & delivery on NSE (11152) and BSE (3016)',
      'Index & stock futures and options with live option chain',
      'Currency derivatives for traders and import-export hedgers',
      'Dealer desk on 0755-4350141-143 through market hours',
      'Same-day contract notes and ledger in the back office',
      'Securities Lending & Borrowing (SLB) for extra yield',
    ],
    chips: ['NSE', 'BSE', 'INTRADAY', 'DELIVERY', 'F&O', 'CURRENCY'],
    ctas: [
      { label: 'Start Trading', href: PORTALS.webTrading, cls: 'btn btn-navy' },
      { label: 'Back Office', href: PORTALS.backOfficeLogin, cls: 'btn btn-outline' },
    ],
    panel: TradingPanel,
    alt: false,
  },
  {
    kicker: '02 — Commodities',
    title: 'Bullion to agri — MCX & NCDEX under one roof',
    desc: 'From gold, silver, crude oil and natural gas to copper, zinc, nickel and a full basket of agri contracts — soybean, guar, chana, sugar and spices — trade and hedge them all as clients of an MCX member (16020) with NCDEX access. The same disciplined margining and risk management we apply to equities protects your commodity book too.',
    points: [
      'MCX membership 16020 · NCDEX access for agri',
      'Bullion, energy, base metals and agri contracts',
      'Hedging desks for traders, jewellers and agri businesses',
      'Unified margin and ledger with your equity account',
    ],
    chips: ['MCX', 'NCDEX', 'BULLION', 'ENERGY', 'METALS', 'AGRI'],
    ctas: [{ label: 'Open Commodity Account', href: PORTALS.ekycAccountOpening, cls: 'btn btn-navy' }],
    panel: CommodityPanel,
    alt: true,
  },
  {
    kicker: '03 — Mutual Funds & Wealth',
    title: 'Every AMC, every scheme, one portfolio view',
    desc: 'As distributors of India’s leading fund houses, we bring the entire mutual fund universe to one login — equity, debt, hybrid and solution-oriented schemes, in direct and regular plans. Start a SIP from ₹500, get portfolio-level investment advice from our dedicated MF desk, and track everything consolidated in one place.',
    points: [
      'All major AMCs — equity, debt, hybrid, ELSS',
      'SIPs from ₹500 with instant online mandates',
      'Direct plans that save distributor commission',
      'Dedicated MF desk: 0755-4350141 · WhatsApp 76489 83065',
      'Portfolio review and goal-based advice',
      'NFO access the day subscriptions open',
    ],
    chips: ['SIP ₹500', 'ALL AMCS', 'DIRECT PLANS', 'ELSS'],
    ctas: [{ label: 'Invest Now', href: PORTALS.mutualFund, cls: 'btn btn-navy' }],
    panel: MutualFundPanel,
    alt: false,
  },
  {
    kicker: '04 — Demat & 3-in-1 Account',
    title: 'CDSL depository custody since 2003',
    desc: 'Your securities live in your own CDSL demat account (DP-ID 12031600, registered IN-DP-CDSL-221-2003) — never in ours. Open a free trading and demat account — the 3-in-1 account ties trading, demat and mutual funds together, so you can see your holdings and DP account in real time and move funds instantly from the app.',
    points: [
      'CDSL Depository Participant since 2003',
      '3-in-1 account: trading + demat + mutual funds',
      'Free trading & demat account opening',
      'Fully digital eKYC opening and closure',
      'Live holdings & DP view on app and web',
      'Instant fund transfer from the mobile app',
    ],
    chips: ['CDSL DP', '3-IN-1', 'FREE ACCOUNT OPENING', 'eKYC'],
    ctas: [{ label: 'Open Demat Account', href: PORTALS.ekycAccountOpening, cls: 'btn btn-red' }],
    note: 'T&C: Trading and demat account opening is free. A one-time ₹3,125 lifetime AMC applies to the 3-in-1 account, of which ₹2,600 is refunded when the account is closed. Other statutory charges, taxes and levies apply as per the tariff sheet.',
    panel: DematPanel,
    alt: true,
  },
];

const PLATFORMS = [
  {
    icon: Smartphone,
    title: 'Kalpataru Share Trade App',
    body: 'Full trading, holdings, mutual funds and instant fund transfer in your pocket — on Android and iOS.',
    cta: { label: 'Get the App', href: APP_LINKS.android },
  },
  {
    icon: Globe,
    title: 'Web Trading',
    body: 'Trade from any browser with live charts, option chain and one-click orders. No installation needed.',
    cta: { label: 'Launch Web Trading', href: PORTALS.webTrading },
  },
  {
    icon: Devices,
    title: 'Desktop Terminal',
    body: 'A dealer-grade desktop platform for heavy traders — full market depth with holdings and DP visibility.',
  },
  {
    icon: BarChart,
    title: 'Back Office',
    body: 'Ledgers, P&L, contract notes and portfolio reports — complete transparency of your finances, updated daily.',
    cta: { label: 'Login', href: PORTALS.backOfficeLogin },
  },
];

const RESEARCH = [
  { icon: Search, title: 'Technical Research', body: 'Daily technical advice, chart analysis and share ideas from a desk that has read the tape since 1992.' },
  { icon: FileText, title: 'Fundamental Research', body: 'Company and sector research reports to back long-term conviction with numbers, not noise.' },
  { icon: Users, title: 'Personalised Advice', body: 'Portfolio-level suggestions from your branch — intelligent, personalised and accountable.' },
  { icon: Rocket, title: 'Investor Education', body: 'Videos, webinars and market explainers that turn first-time savers into confident investors.' },
];

const MORE: Array<{
  icon: React.ComponentType<{ size?: number; strokeW?: number }>;
  title: string;
  body: string;
  tags: string[];
  cta?: { label: string; href: string };
}> = [
  {
    icon: Rocket,
    title: 'IPO & NFO',
    body: 'Apply to initial public offerings and new fund offers online in minutes with UPI mandates, and track allotments without paperwork.',
    tags: ['UPI Apply', 'Allotment Tracking'],
  },
  {
    icon: FileText,
    title: 'Bonds, NCDs & SGB',
    body: 'Save capital-gains tax with 54EC bonds, earn fixed income with corporate NCDs, and own gold smartly through Sovereign Gold Bonds.',
    tags: ['54EC', 'NCDs', 'Gold Bonds'],
  },
  {
    icon: History,
    title: 'NPS — Retirement',
    body: 'Build a disciplined, tax-efficient retirement corpus with the National Pension System, opened and managed through our desk.',
    tags: ['Tier I & II', 'Tax Benefit'],
  },
  {
    icon: Users,
    title: 'Insurance',
    body: 'Protect what you are building — life and general insurance solutions distributed with honest, needs-first advice.',
    tags: ['Life', 'General'],
  },
  {
    icon: IdCard,
    title: 'PAN Card Services',
    body: 'New PAN applications and corrections handled end-to-end at our branches — the first step of every investing journey.',
    tags: ['New PAN', 'Corrections'],
  },
  {
    icon: DocLines,
    title: 'SLB — Lend & Earn',
    body: 'Put idle holdings to work: lend securities through the exchange SLB mechanism and earn extra yield on your long-term portfolio.',
    tags: ['Extra Yield', 'Exchange Settled'],
  },
];

const WHY = [
  { icon: Shield, t: 'SEBI Registered', d: 'INZ000259437 — regulated end to end.' },
  { icon: Bank, t: '5 Market Institutions', d: 'NSE, BSE, MCX, NCDEX & CDSL access.' },
  { icon: Handshake, t: '200+ Locations', d: 'Branches & partners across India.' },
  { icon: CheckCircle, t: '5-Minute eKYC', d: 'Fully digital Aadhaar-based onboarding.' },
];

/* ---------- page ---------- */

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        crumb="Our Services"
        words={[
          { text: 'Every' }, { text: 'Branch', accent: true }, { text: 'of' },
          { text: 'Investing.' }, { text: 'One' }, { text: 'Tree.' },
        ]}
        lead="Equity to insurance, SIPs to sovereign gold — a full-spectrum investment house built branch by branch since 1992, under one SEBI-regulated roof."
        cta={
          <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">
            OPEN FREE ACCOUNT
          </a>
        }
      />

      {/* Deep-dive pillars */}
      {PILLARS.map((p) => (
        <section className={`section pillar watch${p.alt ? ' alt' : ''}`} key={p.kicker}>
          <div className={`container pillar-grid${p.alt ? ' rev' : ''}`}>
            <div className={`pillar-copy reveal ${p.alt ? 'rv-right' : 'rv-left'}`}>
              <span className="pillar-kicker">{p.kicker}</span>
              <h2>{p.title}</h2>
              <p className="desc">{p.desc}</p>
              <ul className="pillar-points">
                {p.points.map((pt) => (
                  <li key={pt}><CheckCircle size={16} strokeW={2.2} /> {pt}</li>
                ))}
              </ul>
              <div className="chips-row">
                {p.chips.map((c, i) => (
                  <span className={`svc-tag${i === 0 ? ' hot' : ''}`} key={c}>{c}</span>
                ))}
              </div>
              <div className="cta-row">
                {p.ctas.map((c) => (
                  <a href={c.href} {...EXT} className={c.cls} key={c.label}>{c.label}</a>
                ))}
              </div>
              {p.note && <p className="pillar-note">{p.note}</p>}
            </div>
            <div className={`pillar-visual reveal ${p.alt ? 'rv-left' : 'rv-right'}`}>
              <p.panel />
            </div>
          </div>
        </section>
      ))}

      {/* Platforms */}
      <section className="section plat watch">
        <div className="glow1"></div>
        <div className="grid-lines"></div>
        <div className="container">
          <h2>Trade Your Way — Four Platforms</h2>
          <p className="sub">The same account, wherever you are: pocket, browser, desk or back office.</p>
          <div className="plat-grid stagger">
            {PLATFORMS.map((p) => (
              <div className="plat-card" key={p.title}>
                <div className="plat-icon"><p.icon size={24} /></div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                {p.cta && (
                  <a href={p.cta.href} {...EXT} className="link-red">
                    {p.cta.label} <ArrowRight size={14} strokeW={2.2} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & advisory */}
      <section className="section svc-section watch">
        <div className="container">
          <h2>Research That Works as Hard as You Do</h2>
          <p className="sub">
            Markets reward preparation. Our research desk keeps you prepared — daily.
          </p>
          <div className="why-strip-grid stagger" style={{ marginTop: 44 }}>
            {RESEARCH.map((r) => (
              <div className="wsi" key={r.title}>
                <r.icon size={22} />
                <div>
                  <div className="t">{r.title}</div>
                  <div className="d">{r.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BrandMarquee />

      {/* More services grid */}
      <section className="section svc-section watch" style={{ background: '#fff' }}>
        <div className="container">
          <h2>More Ways to Grow</h2>
          <p className="sub">Beyond the markets — the services that complete a financial life.</p>
          <div className="svc-grid">
            {MORE.map((s, i) => (
              <article className={`svc-card reveal${i % 3 === 0 ? ' rv-left' : i % 3 === 2 ? ' rv-right' : ''}`} key={s.title}>
                <div className="svc-icon"><s.icon size={26} /></div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="svc-tags">
                  {s.tags.map((t) => <span className="svc-tag" key={t}>{t}</span>)}
                </div>
                <a href={s.cta?.href ?? PORTALS.ekycAccountOpening} {...EXT} className="link-red">
                  {s.cta?.label ?? 'Get Started'} <ArrowRight size={15} strokeW={2.2} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section why-strip watch" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 600 }}>
            Why Investors Choose Kalpataru
          </h2>
          <p className="sub" style={{ textAlign: 'center', margin: '12px auto 40px', maxWidth: 560 }}>
            The trust signals that matter, before a single rupee moves.
          </p>
          <div className="why-strip-grid stagger">
            {WHY.map((w) => (
              <div className="wsi" key={w.t} style={{ background: '#fff' }}>
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

      {/* CTA */}
      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>One account. Every branch of investing.</h2>
          <p>Open your 3-in-1 account and unlock every service on this page — in under 5 minutes.</p>
          <div className="row">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">OPEN FREE ACCOUNT</a>
            <a href={PORTALS.mutualFund} {...EXT} className="btn btn-red">Start a ₹500 SIP</a>
          </div>
        </div>
      </section>
    </main>
  );
}
