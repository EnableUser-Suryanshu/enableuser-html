import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import FeedbackForm from '@/components/pages/FeedbackForm';
import EscalationMatrix from '@/components/pages/EscalationMatrix';
import {
  SUPPORT_TEAMS, TRADING_DESKS, CARE_ESCALATION, EXCHANGE_GRIEVANCE,
} from '@/lib/pages-data';
import { PORTALS, EXT } from '@/lib/links';
import {
  Headset, Phone, Mail, Person, Shield, TrendUp, Bank, Swap, IdCard,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'Customer Care & Feedback — Kalpataru Multiplier Ltd',
  description:
    'Reach the right Kalpataru support desk: technical, back office, DP, and segment-wise trading desks for BSE, NSE F&O and commodities — plus the escalation path and a feedback form.',
};

const DESK_ICON = [TrendUp, Swap, Bank];

export default function CustomerCarePage() {
  return (
    <main id="main">
      <PageHero
        crumb="Customer Care"
        words={[
          { text: 'Reach' }, { text: 'the' }, { text: 'Right', accent: true },
          { text: 'Desk,' }, { text: 'First' }, { text: 'Time.' },
        ]}
        lead="Every support team, every trading desk and every escalation number — published openly so you never have to guess who to call."
        cta={<a href="#feedback" className="btn btn-white">SHARE FEEDBACK</a>}
      />

      {/* Support teams */}
      <section className="section help watch" aria-labelledby="teams-h">
        <div className="container">
          <h2 id="teams-h">Support Teams</h2>
          <p className="sub">Named managers with direct lines — pick the desk that matches your issue.</p>
          <div className="help-grid stagger">
            {SUPPORT_TEAMS.map((t) => (
              <div className="hcard" key={t.team}>
                <div className="icon"><Headset strokeW={1.8} /></div>
                <h3>{t.team}</h3>
                <p className="note">
                  <Person size={13} strokeW={2} /> {t.person} · {t.designation}
                </p>
                {t.mobiles.map((m) => (
                  <a key={m} className="tel" href={`tel:${m.replace(/\s/g, '')}`}>{m}</a>
                ))}
                {t.phones.map((p) => (
                  <a key={p} className="tel" href={`tel:${p.replace(/[^\d]/g, '')}`}>{p}</a>
                ))}
                {t.emails.map((e) => (
                  <a key={e} className="mail" href={`mailto:${e}`}>
                    <Mail size={15} strokeW={1.8} /> {e}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading desks */}
      <section className="section memberships watch" aria-labelledby="desks-h">
        <div className="container">
          <h2 id="desks-h">Operational &amp; Trading Support</h2>
          <p className="sub">
            Segment-wise dealing desks. General operational support: <a href="tel:07554350142" className="link-red">0755-4350142</a>
          </p>
          <div className="desk-grid stagger">
            {TRADING_DESKS.map((d, i) => {
              const Icon = DESK_ICON[i] ?? TrendUp;
              return (
                <article className="desk-card" key={d.label}>
                  <div className="desk-head">
                    <span className="desk-ico"><Icon size={20} /></span>
                    <h3>{d.label}</h3>
                  </div>
                  {d.groups.map((g) => (
                    <div className="desk-group" key={g.where}>
                      <span className="desk-where">{g.where}</span>
                      <div className="desk-nums">
                        {g.numbers.map((n) => (
                          <a key={n} href={`tel:${n.replace(/[^\d+]/g, '')}`} className="desk-num">{n}</a>
                        ))}
                      </div>
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Escalation */}
      <section className="section values watch" aria-labelledby="esc-h">
        <div className="container">
          <h2 id="esc-h">Not Satisfied? Escalate.</h2>
          <p className="sub">
            If your issue isn&apos;t resolved by the desks above, take it straight to senior management.
          </p>
          <div className="values-grid stagger" style={{ gridTemplateColumns: 'repeat(2,1fr)', maxWidth: 780, margin: '46px auto 0' }}>
            {CARE_ESCALATION.map((c) => (
              <div className="value-card" key={c.person}>
                <div className="vc-icon"><Shield size={28} /></div>
                <h3>{c.person}</h3>
                <p style={{ color: 'var(--red)', fontWeight: 700, fontSize: 12.5, letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 10 }}>
                  {c.role}
                </p>
                <p>
                  <a href={`tel:${c.mobile.replace(/\s/g, '')}`} className="link-red">{c.mobile}</a>
                  {c.phone && <> · <a href={`tel:${c.phone.replace(/[^\d]/g, '')}`} className="link-red">{c.phone}</a></>}
                  <br />
                  <a href={`mailto:${c.email}`} className="link-red">{c.email}</a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback form */}
      {/* Escalation matrix — the same regulated table as /contact */}
      <section className="section disclosures watch" aria-labelledby="esc-matrix-h">
        <div className="container">
          <EscalationMatrix showRegulators />

          {/* Complaint links — regulatory note below the escalation matrix */}
          <div className="complaint-note">
            <p>
              In absence of response / complaint not addressed to your satisfaction, you may lodge a
              complaint with CDSL at{' '}
              <a href="https://www.cdslindia.com/eservices/footer/grievances" {...EXT} className="link-red">
                https://www.cdslindia.com/eservices/footer/grievances
              </a>{' '}
              or SEBI at{' '}
              <a href="https://scores.sebi.gov.in/" {...EXT} className="link-red">
                https://scores.sebi.gov.in/
              </a>
              . Please quote your Complaint Ref No. while raising your complaint at SEBI SCORES /
              Depository portal.
            </p>
            <div className="complaint-links">
              {EXCHANGE_GRIEVANCE.filter(
                (g) => !g.href.includes('scores.sebi') && !g.href.includes('cdslindia') && !g.href.includes('smartodr'),
              ).map((g) => (
                <a key={g.name} href={g.href} {...EXT} className="complaint-pill">
                  {g.name.replace(' Investor Services', '').replace(' Investor Complaints', '').replace(' Investor Helpline', '')}{' '}
                  at{' '}
                  <span className="complaint-url">{g.href.replace('https://', '').replace('http://', '')}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section mkt-explore watch" id="feedback" aria-labelledby="fb-h">
        <div className="container">
          <div className="fb-wrap">
            <div className="fb-intro">
              <h2 id="fb-h" className="sec-title">Raise a Ticket</h2>
              <p className="sec-sub" style={{ marginTop: 16 }}>
                Compliment, complaint or suggestion — tell us and it reaches the customer-care
                desk directly. We treat every response as a chance to improve.
              </p>
              <ul className="fb-list">
                <li><IdCard size={16} strokeW={2} /> Include your client code so we can trace the account faster.</li>
                <li><Phone size={16} strokeW={2} /> Urgent trading issue? Call the dealing desk instead — it&apos;s quicker.</li>
                <li><Shield size={16} strokeW={2} /> Never share passwords, OTPs or PINs with anyone, including us.</li>
              </ul>
              <div className="fb-alt">
                <a href={PORTALS.backOfficeLogin} {...EXT} className="btn btn-outline">
                  Raise a Back-Office Ticket
                </a>
                <Link href="/contact" className="btn btn-outline">Find Your Branch</Link>
              </div>
            </div>
            <div className="fb-card">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>We answer the phone</h2>
          <p>Real people at named desks, Monday to Saturday through market hours.</p>
          <div className="row">
            <a href="tel:07554350141" className="btn btn-white">CALL 0755-4350141</a>
            <a href="mailto:complaint@kalpatarumulti.com" className="btn btn-red">Email a Complaint</a>
          </div>
        </div>
      </section>
    </main>
  );
}
