import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import BranchFinder from '@/components/pages/BranchFinder';
import {
  BRANCHES, KEY_CONTACTS, HEAD_OFFICES, ESCALATION,
} from '@/lib/pages-data';
import { MEMBER_DETAILS } from '@/lib/data';
import { PORTALS, MAPS, EXT } from '@/lib/links';
import {
  Phone, Mail, MapPin, Person, Map, OfficeBuilding, Shield, WhatsApp, Headset,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'Contact Us — Kalpataru Multiplier Ltd',
  description:
    'Reach Kalpataru Multiplier Ltd: corporate and head office, our Bhopal branches, key contacts, working hours and the investor grievance escalation matrix.',
};

export default function ContactPage() {
  const cityNames = [...new Set(BRANCHES.map((b) => b.city))];
  // Reads naturally whether the network is one city or many.
  const where = cityNames.length === 1 ? `in ${cityNames[0]}` : `across ${cityNames.length} cities`;

  return (
    <main id="main">
      <PageHero
        crumb="Contact Us"
        words={[
          { text: 'Always' }, { text: 'a' }, { text: 'Branch', accent: true },
          { text: 'Away' }, { text: 'From' }, { text: 'You.' },
        ]}
        lead={`${BRANCHES.length} branches ${where}, a dedicated customer-care desk, and a published escalation path — talk to a person, not a queue.`}
        cta={
          <a href="tel:07554350141" className="btn btn-white">CALL 0755-4350141</a>
        }
      />

      {/* Quick contact strip */}
      <section className="section help watch" aria-labelledby="quick-h">
        <div className="container">
          <h2 id="quick-h">Talk to Us</h2>
          <p className="sub">Pick the desk that fits your question — each one is staffed during market hours.</p>
          <div className="help-grid stagger">
            <div className="hcard">
              <div className="icon"><Phone strokeW={1.8} /></div>
              <h3>General Support</h3>
              <p className="note">Trading, demat and account queries</p>
              <a className="tel" href="tel:07554350141">0755-4350141, 4350142</a>
              <a className="tel" href="tel:07554350143">0755-4350143, 9425008895</a>
              <a className="mail" href="mailto:support@kalpatarumulti.com">
                <Mail size={16} strokeW={1.8} /> support@kalpatarumulti.com
              </a>
            </div>
            <div className="hcard">
              <div className="icon"><Headset strokeW={1.8} /></div>
              <h3>Mutual Funds Desk</h3>
              <p className="note">SIPs, NFOs and portfolio reviews</p>
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
            </div>
            <div className="hcard">
              <div className="icon"><MapPin strokeW={1.8} /></div>
              <h3>Corporate Office</h3>
              <address>
                Hall No. 2, 1st Floor Western Block, Above Central Bank, GTB Complex,
                T. T. Nagar, Bhopal - 462003
              </address>
              <a className="mail" href={MAPS.corporateBhopal} {...EXT}>
                <Map size={16} strokeW={1.8} /> View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Head offices */}
      <section className="section memberships watch" aria-labelledby="ho-h">
        <div className="container">
          <h2 id="ho-h">Our Offices</h2>
          <p className="sub">The two addresses on every contract note and regulatory filing.</p>
          <div className="branches stagger" style={{ marginTop: 40 }}>
            {HEAD_OFFICES.map((o) => (
              <div className="bcard" key={o.label}>
                <div className="bh"><OfficeBuilding size={19} strokeW={1.9} /> {o.label}</div>
                <address>{o.address}</address>
                <div className="meta">
                  {o.phones.map((p) => (
                    <span key={p}>
                      <Phone size={15} strokeW={1.8} />
                      <a href={`tel:${p.replace(/[^\d]/g, '')}`}>{p}</a>
                    </span>
                  ))}
                  <span><Mail size={15} strokeW={1.8} /> <a href={`mailto:${o.email}`}>{o.email}</a></span>
                  <span><Person size={15} strokeW={1.8} /> {o.person}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key personnel table */}
      <section className="section disclosures watch" aria-labelledby="kp-h">
        <div className="container">
          <h2 id="kp-h" style={{ textAlign: 'center', fontSize: 30, fontWeight: 600 }}>
            Key Contact Persons
          </h2>
          <p className="sub" style={{ textAlign: 'center', margin: '12px auto 30px', maxWidth: 620 }}>
            Names, direct numbers and working hours — published as required by SEBI.
          </p>
          <div className="disc-scroll">
            <table className="disc-table">
              <thead>
                <tr>
                  <th scope="col">Details Of</th>
                  <th scope="col">Contact Person</th>
                  <th scope="col">Contact No.</th>
                  <th scope="col">Email ID</th>
                  <th scope="col">Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {KEY_CONTACTS.map((c) => (
                  <tr key={c.role}>
                    <th scope="row" className="ap-name">{c.role}</th>
                    <td>{c.person}</td>
                    <td>
                      {c.phones.map((p) => (
                        <a key={p} href={`tel:${p.replace(/[^\d]/g, '')}`} className="kc-tel">{p}</a>
                      ))}
                    </td>
                    <td>
                      {c.emails.map((e) => (
                        <a key={e} href={`mailto:${e}`} className="kc-mail">{e}</a>
                      ))}
                    </td>
                    <td>{c.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Branch finder */}
      <section className="section mkt-explore watch" aria-labelledby="bf-h">
        <div className="container">
          <div className="mkt-sec-head">
            <div>
              <h2 id="bf-h" className="sec-title">Find Your Branch</h2>
              <p className="sec-sub">
                {BRANCHES.length} branches {where} — search for a branch or a manager.
              </p>
            </div>
          </div>
          <BranchFinder branches={BRANCHES} />
        </div>
      </section>

      {/* Escalation matrix */}
      <section className="section values watch" aria-labelledby="esc-h">
        <div className="container">
          <h2 id="esc-h">Investor Grievance Escalation</h2>
          <p className="sub">
            If something isn&apos;t resolved, here is exactly who to approach next — and the
            exchange portals available to you at any stage.
          </p>
          <ol className="esc-list stagger">
            {ESCALATION.map((e) => (
              <li className="esc-item" key={e.level}>
                <span className="esc-num">{e.level}</span>
                <div>
                  <div className="esc-title">{e.title}</div>
                  <div className="esc-detail">{e.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Registrations */}
      <section className="section bank watch" aria-labelledby="reg-h">
        <div className="container">
          <h2 id="reg-h" style={{ textAlign: 'center', fontSize: 28, fontWeight: 600, marginBottom: 30 }}>
            Registration &amp; Membership
          </h2>
          <div className="bank-grid">
            <div className="bank-card reveal rv-left">
              <div className="head"><Shield size={24} /> Member Details</div>
              {MEMBER_DETAILS.map((m) => (
                <div className="bank-row" key={m.label}>
                  <span className="k">{m.label}</span>
                  <span className="v">{m.value}</span>
                </div>
              ))}
            </div>
            <div className="bank-card reveal rv-right">
              <div className="head"><MapPin size={24} /> Registered Address</div>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>
                Kalpataru House, 18 Itwara, Bhopal (MP) – 462001
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.7, marginTop: 14 }}>
                Bombay Stock Exchange Ltd. (BSE) · National Stock Exchange Ltd. (NSE) ·
                Multi Commodity Exchange (MCX) · Depository Participant of CDSL.
              </p>
              <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-navy" style={{ marginTop: 20 }}>
                Open an Account
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Prefer to start online?</h2>
          <p>Open your demat, trading and mutual fund account in under 5 minutes — fully digital.</p>
          <div className="row">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">OPEN FREE ACCOUNT</a>
            <a href={PORTALS.backOfficeLogin} {...EXT} className="btn btn-red">Back Office Login</a>
          </div>
        </div>
      </section>
    </main>
  );
}
