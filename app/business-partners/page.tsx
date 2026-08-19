import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { PARTNER_PILLARS, PARTNER_VALUES } from '@/lib/pages-data';
import { PORTALS, EXT } from '@/lib/links';
import {
  Handshake, TrendUp, Users, Search, FileText, Devices, Shield,
  CalendarCheck, IdCard, Building, Phone, Mail, ArrowRight, CheckCircle, History,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'Business Partners — Franchise & Sub-Broker | Kalpataru Multiplier Ltd',
  description:
    'Partner with Kalpataru Multiplier Ltd as a sub-broker, authorised person or ARN holder. Training, business development, research, marketing, technology and compliance support.',
};

const PILLAR_ICONS = [Users, TrendUp, Search, FileText, Devices, Shield];

const MODELS = [
  { icon: Handshake, t: 'Sub Broker / Authorised Person', d: 'Registered with the exchange under our membership, servicing clients in your own territory.' },
  { icon: CalendarCheck, t: 'ARN Holder', d: 'Distribute mutual funds under our AMFI registration with full back-office support.' },
  { icon: IdCard, t: 'Partner Model', d: 'A revenue-sharing arrangement structured around the business you bring.' },
  { icon: Building, t: 'Branch Support', d: 'Set up a branded Kalpataru outlet with our systems, training and supervision.' },
];

const NUMBERS = [
  { icon: History, v: 'Since 1992', l: 'Three decades of broking' },
  { icon: Building, v: '22 branches', l: 'Across MP, UP & Chhattisgarh' },
  { icon: Shield, v: '4 memberships', l: 'NSE · BSE · MCX · CDSL' },
  { icon: Users, v: '35K+', l: 'Investors served' },
];

export default function BusinessPartnersPage() {
  return (
    <main id="main">
      <PageHero
        crumb="Business Partners"
        words={[
          { text: 'Your' }, { text: 'Ambition.' }, { text: 'Our', accent: true },
          { text: 'Infrastructure.' },
        ]}
        lead="If you are well versed in the world of finance, there are ample opportunities here. Partner with a time-tested, tried and trusted share broker, mutual fund distributor and depository participant."
        cta={
          <a href="#partner-enquiry" className="btn btn-white">BECOME A PARTNER</a>
        }
      />

      {/* Who the partner would be signing up with */}
      <section className="section story watch" aria-labelledby="letter-h">
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 id="letter-h" className="sec-title">About the Firm</h2>
          <div className="reveal" style={{ marginTop: 22 }}>
            <p style={{ fontSize: 15.5, color: 'var(--ink-2)', lineHeight: 1.85 }}>
              Kalpataru is a time-tested, tried and trusted share broker, mutual fund distributor
              and depository participant. We cover the complete financial services spectrum —
              share broking, derivatives and F&amp;O in equities, commodity and index. We are also
              a DP providing depository services, and we distribute financial products such as
              mutual funds, portfolio management services and IPOs, in which we hold more than
              half the market share of the primary market in our region.
            </p>
            <div className="accent-quote" style={{ marginTop: 22 }}>
              Kalpataru is well equipped to handle all the wealth-creation and wealth-management
              needs of the investing public — and we would like you to be part of it.
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="section stats watch" aria-label="Why partner with Kalpataru">
        <div className="container stats-grid stagger">
          {NUMBERS.map((n) => (
            <div className="stat" key={n.l}>
              <div className="stat-icon"><n.icon size={26} /></div>
              <div className="v">{n.v}</div>
              <div className="l">{n.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership models */}
      <section className="section svc-section watch" aria-labelledby="models-h">
        <div className="container">
          <h2 id="models-h">Ways to Partner With Us</h2>
          <p className="sub">Choose the model that matches your licence, network and ambition.</p>
          <div className="svc-grid" style={{ marginTop: 42, gridTemplateColumns: 'repeat(4,1fr)' }}>
            {MODELS.map((m, i) => (
              <article className={`svc-card reveal${i === 0 ? ' rv-left' : i === 3 ? ' rv-right' : ''}`} key={m.t}>
                <div className="svc-icon"><m.icon size={26} /></div>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Franchisee intro */}
      <section className="section memberships watch" aria-labelledby="fr-h">
        <div className="container">
          <h2 id="fr-h">Franchisee for Share Broking Business</h2>
          <p className="sub">
            Our branch network is larger than, and comparable to, any share broker in Bhopal. We
            have a deep-rooted commitment to — and understanding of — the franchisee business. Many
            of our processes and systems are inspired by the sub-broker business itself: we believe
            in making life simple and profitable for our business partners, so they can focus only
            on business and enjoy it.
          </p>
          <div className="values-grid stagger" style={{ marginTop: 46, gridTemplateColumns: 'repeat(3,1fr)' }}>
            {PARTNER_PILLARS.map((p, i) => {
              const Icon = PILLAR_ICONS[i] ?? Shield;
              return (
                <div className="value-card" key={p.title}>
                  <div className="vc-icon"><Icon size={30} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section journey watch" aria-labelledby="phil-h">
        <div className="container">
          <h2 id="phil-h">What Our Partners Sell</h2>
          <p className="sub">Not a product list — a way of treating investors that has held for three decades.</p>
          <div className="res-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {PARTNER_VALUES.map((v) => (
              <div className="phil-card reveal" key={v.title}>
                <span className="phil-mark" aria-hidden="true">“</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
          <p className="phil-close reveal">
            Our in-depth research and unbiased advice help investors take informed decisions. Our
            experts identify significant market trends and bring opportunities to your clients —
            senior executives visit branches regularly to keep operations smooth and compliance
            tight.
          </p>
        </div>
      </section>

      {/* Enquiry */}
      <section className="section help watch" id="partner-enquiry" aria-labelledby="enq-h">
        <div className="container">
          <h2 id="enq-h">Get in Touch</h2>
          <p className="sub">
            With your ambition to succeed and ours to make it happen, together we can build a
            healthy relationship and a profitable — rather, enjoyable — business.
          </p>
          <div className="help-grid stagger">
            <div className="hcard">
              <div className="icon"><Phone strokeW={1.8} /></div>
              <h3>Talk to the Partner Desk</h3>
              <p className="note">Corporate office, Bhopal</p>
              <a className="tel" href="tel:07554350141">0755-4350141 / 142 / 143</a>
              <a className="tel" href="tel:9425008895">9425008895</a>
              <a className="mail" href="mailto:kmlho@kalpatarumulti.com">
                <Mail size={16} strokeW={1.8} /> kmlho@kalpatarumulti.com
              </a>
            </div>
            <div className="hcard">
              <div className="icon"><CheckCircle strokeW={1.8} /></div>
              <h3>What You&apos;ll Need</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.75 }}>
                A registered office space, the relevant NISM certification, KYC documents and
                a deposit as applicable to the model. Our team walks you through registration
                with the exchange or AMFI.
              </p>
            </div>
            <div className="hcard">
              <div className="icon"><Handshake strokeW={1.8} /></div>
              <h3>Already Registered?</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.75 }}>
                Existing partners can access the back office for ledgers, brokerage statements
                and client reports at any time.
              </p>
              <a href={PORTALS.backOfficeLogin} {...EXT} className="btn btn-navy" style={{ marginTop: 14, width: '100%' }}>
                Partner Login
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Come on, get in touch with us</h2>
          <p>Tell us about your market and we&apos;ll show you the model that fits.</p>
          <div className="row">
            <a href="tel:07554350141" className="btn btn-white">CALL THE PARTNER DESK</a>
            <a href="mailto:kmlho@kalpatarumulti.com?subject=Business%20Partner%20Enquiry" className="btn btn-red">
              Email Enquiry
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
