import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { ACCOUNT_SERVICES, type AccountService } from '@/lib/pages-data';
import { PORTALS, SERVICE_PORTALS, EXT } from '@/lib/links';
import {
  IdCard, Pencil, Shield, FilePdf, ArrowRight, Mail, Phone, CheckCircle,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'Online Account Services — Nomination, Re-KYC & Closure | Kalpataru Multiplier Ltd',
  description:
    'Register or change a nomination, refresh your KYC and close your trading and demat account online. Forms, timelines and the DP desk to contact at Kalpataru Multiplier Ltd, CDSL DP-ID 12031600.',
};

const ICONS = {
  nomination: IdCard,
  reKyc: Pencil,
  closure: Shield,
} as const;

function ServiceBlock({ svc }: { svc: AccountService }) {
  const Icon = ICONS[svc.key];
  const portal = SERVICE_PORTALS[svc.key];

  return (
    <section className="section watch" aria-labelledby={`${svc.key}-h`} id={svc.key}>
      <div className="container">
        <div className="mkt-sec-head">
          <div>
            <h2 id={`${svc.key}-h`} className="sec-title">{svc.title}</h2>
            <p className="sec-sub">{svc.summary}</p>
          </div>
        </div>

        <p className="pillar-note" style={{ margin: '22px 0 0', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <CheckCircle size={18} strokeW={2} />
          <span><strong>Depository timeline:</strong> {svc.timeline}</span>
        </p>

        <ol className="esc-list stagger" style={{ marginTop: 30, marginLeft: 0 }}>
          {svc.steps.map((step, i) => (
            <li className="esc-item" key={step}>
              <span className="esc-num">{i + 1}</span>
              <div>
                <div className="esc-detail">{step}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="bank-grid" style={{ marginTop: 34 }}>
          <div className="bank-card reveal rv-left">
            <div className="head"><Icon size={24} /> Start online</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 14 }}>
              Sign in with your client ID and complete the request in one sitting. You can also
              email the signed form below to the desk from the email ID registered against your
              account — both routes are processed within the timeline above.
            </p>
            {portal && (
              <a href={portal} {...EXT} className="btn btn-red">
                {svc.portalLabel} <ArrowRight size={16} strokeW={2.2} />
              </a>
            )}
            {svc.altLabel && (
              <a
                href={PORTALS.backOfficeLogin}
                {...EXT}
                className="btn btn-outline"
                style={{ marginTop: 10 }}
              >
                {svc.altLabel} <ArrowRight size={16} strokeW={2.2} />
              </a>
            )}
            <div style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.8 }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{svc.desk.person}</div>
              <div>{svc.desk.role}</div>
              <a
                href={`mailto:${svc.desk.email}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 6 }}
              >
                <Mail size={15} strokeW={1.8} /> {svc.desk.email}
              </a>
              <br />
              <a
                href={`tel:${svc.desk.phone.replace(/[^0-9+]/g, '')}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
              >
                <Phone size={15} strokeW={1.8} /> {svc.desk.phone}
              </a>
            </div>
          </div>

          <div className="bank-card reveal rv-right">
            <div className="head"><FilePdf size={24} /> Forms</div>
            {svc.forms.map((f) => (
              <a key={f.href} href={f.href} {...EXT} className="dl-row">
                {f.label}
                <ArrowRight size={17} strokeW={2} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AccountServicesPage() {
  return (
    <main id="main">
      <PageHero
        crumb="Account Services"
        words={[
          { text: 'Nomination,' }, { text: 'Re-KYC' }, { text: 'and' },
          { text: 'Closure', accent: true }, { text: 'Online.' },
        ]}
        lead="The three account services you can complete without visiting a branch — register or change a nominee, refresh your KYC, or close your account. Each one lists the steps, the depository timeline and the desk that handles it."
      />

      <section className="section watch" aria-labelledby="as-intro-h">
        <div className="container">
          <h2 id="as-intro-h" className="sec-title">What you can do here</h2>
          <p className="sec-sub" style={{ maxWidth: 760 }}>
            Kalpataru Multiplier Ltd is a Depository Participant of CDSL — SEBI Regn. No.
            IN-DP-CDSL-221-2003, DP-ID 12031600. Nomination, Re-KYC and account closure are
            provided free of charge, and none of them requires you to visit an office.
          </p>
          <div className="values-grid stagger" style={{ marginTop: 34 }}>
            {ACCOUNT_SERVICES.map((s) => (
              <a className="value-card" key={s.key} href={`#${s.key}`}>
                <div className="vc-icon">{(() => { const I = ICONS[s.key]; return <I size={30} />; })()}</div>
                <h3>{s.title}</h3>
                <p>{s.timeline}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {ACCOUNT_SERVICES.map((svc) => <ServiceBlock key={svc.key} svc={svc} />)}

      <section className="section bank watch" aria-labelledby="as-note-h">
        <div className="container">
          <h2 id="as-note-h" className="sec-title">Before you submit a request</h2>
          <div className="data-notice" role="note" style={{ marginTop: 22 }}>
            <Shield size={20} strokeW={1.9} />
            <p>
              We will never ask you for your password, OTP, TPIN or PIN — not by phone, email or
              WhatsApp. Send requests only from the email ID registered against your account, and
              check the acknowledgement you receive. If anything looks wrong, call the DP desk on{' '}
              <a href="tel:07554350143" style={{ textDecoration: 'underline' }}>0755-4350143</a>{' '}
              before you act on it.
            </p>
          </div>
          <p className="sec-sub" style={{ marginTop: 22 }}>
            Your rights and our obligations as a Depository Participant are set out in full in the{' '}
            <Link href="/policies/investor-charter-depository" className="link-red">
              Investor Charter for Depository Participants
            </Link>
            . Every form we publish is listed on the{' '}
            <Link href="/downloads" className="link-red">Downloads</Link> page.
          </p>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Need a hand with any of these?</h2>
          <p>Our DP desk will walk you through the request and confirm what it needs.</p>
          <div className="row">
            <a href="tel:07554350143" className="btn btn-white">CALL 0755-4350143</a>
            <a href="mailto:dp@kalpatarumulti.com" className="btn btn-red">Email the DP Desk</a>
          </div>
        </div>
      </section>
    </main>
  );
}
