import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import PageHero from '@/components/PageHero';
import CountUp from '@/components/CountUp';
import Disclosures from '@/components/Disclosures';
import { PORTALS, EXT } from '@/lib/links';
import { Shield, History, Users, Bank, CheckCircle, Handshake } from '@/components/icons';

export const metadata: Metadata = {
  title: 'About Us — Kalpataru Multiplier Ltd',
  description:
    'Since 1992, Kalpataru Multiplier Ltd has been a trusted, time-tested and transparent share broker, mutual fund distributor and CDSL depository participant.',
};

/* Stylised "divine tree" that draws itself when scrolled into view. */
function DivineTree() {
  const leaves = [
    [215, 96], [165, 118], [265, 118], [125, 152], [305, 152],
    [95, 196], [335, 196], [150, 84], [280, 84], [215, 60],
    [70, 240], [360, 240], [190, 140], [240, 140],
  ];
  return (
    <div className="tree-wrap">
      <div className="tree-halo"></div>
      <svg className="tree-svg" viewBox="0 0 430 430" fill="none" aria-hidden="true">
        {/* trunk + branches */}
        <path className="branch" d="M215 400 V 250 C 215 200 215 170 215 130" stroke="#7a4a21" strokeWidth="14" strokeLinecap="round" style={{ '--d': '0s' } as CSSProperties} />
        <path className="branch" d="M215 250 C 190 225 160 205 128 190" stroke="#7a4a21" strokeWidth="9" strokeLinecap="round" style={{ '--d': '.5s' } as CSSProperties} />
        <path className="branch" d="M215 250 C 240 225 270 205 302 190" stroke="#7a4a21" strokeWidth="9" strokeLinecap="round" style={{ '--d': '.6s' } as CSSProperties} />
        <path className="branch" d="M215 190 C 195 165 170 150 148 122" stroke="#7a4a21" strokeWidth="7" strokeLinecap="round" style={{ '--d': '.8s' } as CSSProperties} />
        <path className="branch" d="M215 190 C 235 165 260 150 282 122" stroke="#7a4a21" strokeWidth="7" strokeLinecap="round" style={{ '--d': '.9s' } as CSSProperties} />
        <path className="branch" d="M128 190 C 105 210 88 222 72 238" stroke="#7a4a21" strokeWidth="6" strokeLinecap="round" style={{ '--d': '1s' } as CSSProperties} />
        <path className="branch" d="M302 190 C 325 210 342 222 358 238" stroke="#7a4a21" strokeWidth="6" strokeLinecap="round" style={{ '--d': '1.1s' } as CSSProperties} />
        {/* canopy leaves */}
        {leaves.map(([cx, cy], i) => (
          <circle
            key={i}
            className="leaf"
            cx={cx}
            cy={cy}
            r={i % 3 === 0 ? 30 : 22}
            fill={i % 4 === 0 ? '#bb0009' : i % 2 === 0 ? '#1c7a4a' : '#2a9d61'}
            opacity="0.9"
            style={{ '--d': `${1.3 + i * 0.09}s` } as CSSProperties}
          />
        ))}
        {/* ground */}
        <path className="ground" d="M130 402 H 300" stroke="#c9cdd4" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const MILESTONES = [
  { year: '1992', title: 'The seed is planted', body: 'Kalpataru Multiplier Ltd is founded in Bhopal as a full-service share broking house, holding clearing membership from the very beginning.' },
  { year: '1990s', title: 'Roots across Madhya Pradesh', body: 'A growing branch and authorised-person network takes trusted investing to Sagar, Jabalpur, Vidisha, Harda, Lalitpur and beyond.' },
  { year: '2003', title: 'Depository participant', body: 'Registered as a CDSL Depository Participant (IN-DP-CDSL-221-2003), adding safe, paperless demat custody to the bouquet.' },
  { year: '2000s – 2010s', title: 'Every branch of investing', body: 'Commodity membership on MCX, mutual fund distribution, IPOs, bonds and insurance — one tree, many branches.' },
  { year: 'Today', title: 'Digital-first, values-forever', body: '35,000+ investors, 20+ locations, fully digital eKYC onboarding and modern trading platforms — with the same three Ts at the core.' },
];

const LEADERS = [
  { name: 'Aditya Manya Jain', role: 'Chairman & CEO', photo: '/assets/leaders/aditya.jpg' },
  { name: 'Amitabh Manya Jain', role: 'Managing Director', photo: '/assets/leaders/amitabh.jpg' },
  { name: 'Sharda Manya Jain', role: 'Director', photo: '/assets/leaders/sharda.jpg' },
  { name: 'Savita Manya Jain', role: 'Director', photo: '/assets/leaders/savita.jpg' },
  { name: 'Lalit Manya Jain', role: 'Director', photo: '/assets/leaders/lalit.jpg' },
];

const MEMBERSHIPS = [
  {
    logo: '/assets/exchanges/bse.gif',
    name: 'Bombay Stock Exchange Ltd. (BSE)',
    rows: [
      { k: 'SEBI Regn. No.', v: 'INZ000259437' },
      { k: 'Member ID', v: '3016' },
    ],
  },
  {
    logo: '/assets/exchanges/nse.gif',
    name: 'National Stock Exchange Ltd. (NSE)',
    rows: [
      { k: 'SEBI Regn. No.', v: 'INZ000259437' },
      { k: 'Member ID', v: '11152' },
    ],
  },
  {
    logo: '/assets/exchanges/mcx.gif',
    name: 'Multi Commodity Exchange (MCX)',
    rows: [
      { k: 'SEBI Regn. No.', v: 'INZ000259437' },
      { k: 'Member ID', v: '16020' },
    ],
  },
  {
    logo: '/assets/exchanges/cdsl.gif',
    name: 'Depository Participant (DP) of CDSL',
    rows: [
      { k: 'SEBI Regn. No.', v: 'IN-DP-CDSL-221-2003' },
      { k: 'DP ID', v: '12031600' },
    ],
  },
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        crumb="About Us"
        words={[
          { text: 'The' }, { text: 'Divine' }, { text: 'Tree', accent: true },
          { text: 'of' }, { text: 'Indian' }, { text: 'Investing' },
        ]}
        lead="Since 1992, Kalpataru Multiplier Ltd has helped generations of investors grow their wealth — the Trusted, Time-tested and Transparent way."
      />

      {/* Story + animated tree */}
      <section className="section story watch">
        <div className="container story-grid">
          <div className="reveal rv-left">
            <h2>Why &ldquo;Kalpataru&rdquo;?</h2>
            <p>
              In Indian tradition, the Kalpataru is the wish-fulfilling Divine Tree — plant it,
              nurture it, and it gives back for generations. We chose that name in 1992 as a
              promise: your financial goals are the wishes, and our job is to grow them.
            </p>
            <p>
              What began as a share broking desk in Bhopal has grown branch by branch — equities,
              derivatives, commodities, mutual funds, IPOs, bonds and depository
              services — into a full-spectrum investment house serving investors across India,
              with clearing membership held since inception.
            </p>
            <div className="accent-quote">
              &ldquo;A tree is known by its fruit. For three decades, ours has been the steady,
              compounding wealth of the families who trust us.&rdquo;
            </div>
          </div>
          <div className="reveal rv-right">
            <DivineTree />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats watch" aria-label="Company at a glance">
        <div className="container stats-grid stagger">
          <div className="stat">
            <div className="stat-icon"><History size={26} /></div>
            <div className="v">Since 1992</div>
            <div className="l">Three Decades of Trust</div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Users size={26} /></div>
            <div className="v"><CountUp target={35} suffix="K+" /></div>
            <div className="l">Investors Served</div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Bank size={26} /></div>
            <div className="v"><CountUp target={20} suffix="+" /></div>
            <div className="l">Locations</div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Shield size={26} /></div>
            <div className="v">4 Memberships</div>
            <div className="l">NSE / BSE / MCX / CDSL</div>
          </div>
        </div>
      </section>

      {/* Exchange memberships */}
      <section className="section memberships watch" aria-label="Exchange memberships and registrations">
        <div className="container">
          <h2>Clearing Member — Since Inception</h2>
          <p className="sub">
            From day one, Kalpataru has held clearing membership of India&apos;s leading
            market institutions. Every credential below is verifiable with SEBI and the
            respective exchange.
          </p>
          <div className="mem-grid stagger">
            {MEMBERSHIPS.map((m, i) => (
              <div
                className="mem-card"
                key={m.name}
                style={{ '--sd': `${i * 1.4}s` } as React.CSSProperties}
              >
                <span className="mem-verified">Verified</span>
                <div className="mem-logo">
                  <img src={m.logo} alt={`${m.name} logo`} loading="lazy" />
                </div>
                <div className="mem-name">{m.name}</div>
                <div className="mem-rows">
                  {m.rows.map((r) => (
                    <div className="mem-row" key={r.k}>
                      <span className="k">{r.k}</span>
                      <span className="v">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mem-note reveal">
            <Handshake size={30} strokeW={1.8} />
            <p>
              Every registration above is a layer of investor protection. Exchange memberships
              put our trades under NSE, BSE and MCX surveillance; the CDSL registration keeps
              your securities in your own demat account, not ours; and SEBI regulation gives
              you formal grievance channels — SCORES and SMART ODR — that we publish openly
              in our footer. Trust, verified.
            </p>
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-navy">
              Open an Account with Us
            </a>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section journey watch">
        <div className="container">
          <h2>Our Journey</h2>
          <p className="sub">From a single desk in Bhopal to a full-spectrum investment house.</p>
          <div className="timeline">
            <div className="tl-line" aria-hidden="true"></div>
            {MILESTONES.map((m) => (
              <div className="tl-item reveal" key={m.year}>
                <span className="tl-dot" aria-hidden="true"></span>
                <div className="tl-year">{m.year}</div>
                <div className="tl-card">
                  <div className="t">{m.title}</div>
                  <div className="d">{m.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section values watch">
        <div className="container">
          <h2>The Three Ts We Live By</h2>
          <p className="sub">Every account, every order, every interaction is measured against these.</p>
          <div className="values-grid stagger">
            <div className="value-card">
              <div className="vc-icon"><Shield size={30} /></div>
              <h3>Trusted</h3>
              <p>Clearing member since inception, SEBI registered, and answerable to four market institutions — your money moves through regulated, transparent rails.</p>
            </div>
            <div className="value-card">
              <div className="vc-icon"><History size={30} /></div>
              <h3>Time-tested</h3>
              <p>Three decades of bull runs, corrections and everything between. Processes that have survived every market cycle since 1992.</p>
            </div>
            <div className="value-card">
              <div className="vc-icon"><CheckCircle size={30} /></div>
              <h3>Transparent</h3>
              <p>Clear pricing, instant back-office reporting, published policies and grievance channels — nothing between you and your numbers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section leaders watch">
        <div className="container">
          <h2>Leadership</h2>
          <p className="sub">A promoter family that has steered the firm through every market era.</p>
          <div className="leaders-grid stagger">
            {LEADERS.map((l) => (
              <div className="leader-card" key={l.name}>
                <div className="avatar photo">
                  <img src={l.photo} alt={`${l.name}, ${l.role}`} loading="lazy" />
                </div>
                <div className="nm">{l.name}</div>
                <div className="rl">{l.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KMP + Authorised Persons */}
      <Disclosures />

      {/* CTA */}
      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Plant your own Kalpataru today</h2>
          <p>Open a free demat, trading and mutual fund account in under 5 minutes — completely digital.</p>
          <div className="row">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">OPEN FREE ACCOUNT</a>
            <a href={PORTALS.webTrading} {...EXT} className="btn btn-red">Start Trading</a>
          </div>
        </div>
      </section>
    </main>
  );
}
