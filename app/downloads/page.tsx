import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DownloadCentre from '@/components/pages/DownloadCentre';
import { DOWNLOAD_CATS } from '@/lib/pages-data';
import { getDownloads } from '@/lib/downloads';
import { PORTALS, EXT } from '@/lib/links';
import { FilePdf, Shield, IdCard, Download, ArrowRight } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Downloads — Forms & Software | Kalpataru Multiplier Ltd',
  description:
    'Download account opening and KYC forms, demat and DP forms, nomination and transmission forms, pledge forms, trading software and setup guides.',
};

const QUICK = [
  { label: 'Demat & Trading Account Opening Form', match: 'Demat and Trading Account Opening Form', icon: IdCard },
  { label: 'KYC Form for KRA', match: 'KYC Form for KRA', icon: Shield },
  { label: 'Account Modification Form', match: 'Account Modification Form', icon: FilePdf },
  { label: 'Nomination Form (SH-13)', match: 'Form No. SH-13-Nomination Form', icon: FilePdf },
];

export default async function DownloadsPage() {
  // Managed in Sanity Studio at /studio; falls back to the checked-in list
  // whenever Sanity is not configured or unreachable.
  const downloads = await getDownloads();

  const quick = QUICK.map((q) => ({
    ...q,
    href: downloads.find((d) => d.label === q.match)?.href,
  })).filter((q) => q.href);

  return (
    <main id="main">
      <PageHero
        crumb="Downloads"
        words={[
          { text: 'Every' }, { text: 'Form,' }, { text: 'One', accent: true },
          { text: 'Place.' },
        ]}
        lead={`${downloads.length} forms, declarations, guides and software downloads — filter by category or search by name.`}
        cta={
          <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">
            OPEN ACCOUNT ONLINE INSTEAD
          </a>
        }
      />

      {/* Most requested */}
      <section className="section why-strip watch" aria-labelledby="quick-h">
        <div className="container">
          <h2 id="quick-h" style={{ textAlign: 'center', fontSize: 28, fontWeight: 600 }}>
            Most Requested Forms
          </h2>
          <p className="sub" style={{ textAlign: 'center', margin: '12px auto 36px', maxWidth: 560 }}>
            The four documents clients ask for most — everything else is in the library below.
          </p>
          <div className="why-strip-grid stagger">
            {quick.map((q) => (
              <a key={q.label} href={q.href} target="_blank" rel="noopener" className="wsi" download>
                <q.icon size={22} />
                <div>
                  <div className="t">{q.label}</div>
                  <div className="d">PDF · opens in a new tab</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Full library */}
      <section className="section mkt-explore watch" aria-labelledby="lib-h">
        <div className="container">
          <div className="mkt-sec-head">
            <div>
              <h2 id="lib-h" className="sec-title">Download Library</h2>
              <p className="sec-sub">
                Account opening, KYC, demat, nomination, pledge, trading software and setup guides.
              </p>
            </div>
          </div>
          <DownloadCentre items={downloads} cats={DOWNLOAD_CATS} />

          <div className="data-notice" role="note" style={{ marginTop: 26 }}>
            <Download size={20} strokeW={1.9} />
            <p>
              <strong>Filling a form?</strong> Print, sign and submit it at any Kalpataru branch,
              or email a scanned copy to your branch. For most requests you can skip the paperwork
              entirely and use the online eKYC and back-office portals.
            </p>
          </div>
        </div>
      </section>

      {/* Do it online */}
      <section className="section bank watch" aria-labelledby="online-h">
        <div className="container">
          <h2 id="online-h" style={{ textAlign: 'center', fontSize: 28, fontWeight: 600, marginBottom: 30 }}>
            Skip the Paperwork
          </h2>
          <div className="bank-grid">
            <div className="bank-card reveal rv-left">
              <div className="head"><IdCard size={24} /> Open an Account Online</div>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>
                Complete Aadhaar-based eKYC in about five minutes — no printing, no courier.
                You will need your PAN, Aadhaar linked to your mobile, a bank proof and a
                signature image.
              </p>
              <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-navy" style={{ marginTop: 20 }}>
                Start eKYC <ArrowRight size={15} strokeW={2.2} />
              </a>
            </div>
            <div className="bank-card reveal rv-right">
              <div className="head"><Shield size={24} /> Modify an Existing Account</div>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>
                Update your details, add segments or refresh KYC from the back office
                instead of submitting a physical form — or download the form if you
                would rather post it in.
              </p>
              {/* .btn is inline-flex and .bank-card is a plain block, so the two
                  links need an explicit column to stack rather than sit side by side. */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginTop: 20 }}>
                <a href={PORTALS.reKyc} {...EXT} className="btn btn-navy">
                  Online Modification <ArrowRight size={15} strokeW={2.2} />
                </a>
                <a href={PORTALS.modificationForm} {...EXT} className="btn btn-outline">
                  Download the Form <FilePdf size={15} strokeW={2.2} />
                </a>
              </div>
              <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.7 }}>
                Sign in to the back office to raise it online, or email the signed form to{' '}
                <a href="mailto:kmlho@kalpatarumulti.com" className="link-red">
                  kmlho@kalpatarumulti.com
                </a>{' '}
                from your registered email ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Can&apos;t find a form?</h2>
          <p>Our customer-care desk will email it to you the same working day.</p>
          <div className="row">
            <a href="tel:07554350141" className="btn btn-white">CALL 0755-4350141</a>
            <a href="mailto:support@kalpatarumulti.com" className="btn btn-red">Email Support</a>
          </div>
        </div>
      </section>
    </main>
  );
}
