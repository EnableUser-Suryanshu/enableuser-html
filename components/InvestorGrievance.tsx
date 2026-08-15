// Homepage disclosure on filing complaints through SEBI SCORES.
//
// Audit point 3 (VRDK & Co, 14-Aug-2026): the SCORES guidance existed only as
// a PDF on the Circulars page, and the auditor asked for the disclosure itself
// — registration, the mandatory details and the benefits — to sit on the home
// page alongside the SCORES link. Keep this section on the homepage.

import Link from 'next/link';
import { REGULATOR_LINKS, POLICY_LINKS, EXT } from '@/lib/links';
import { ListCheck, IdCard, CheckCircle, Pencil, ArrowRight, FilePdf } from './icons';

const POINTS = [
  {
    icon: IdCard,
    title: 'Register on SCORES',
    body:
      'Create a one-time registration on SEBI’s SCORES portal at scores.sebi.gov.in. Once registered you can lodge a complaint against any SEBI-registered intermediary and track it end to end.',
  },
  {
    icon: ListCheck,
    title: 'Details you must provide',
    body:
      'Your Name, PAN, Address, Mobile Number and Email ID are mandatory when filing a complaint. Keep your client code handy — quoting it helps us trace the matter faster.',
  },
  {
    icon: CheckCircle,
    title: 'What you get',
    body:
      'Effective communication with the intermediary and the regulator, and speedy redressal of your grievance, with the status of the complaint visible to you throughout.',
  },
];

export default function InvestorGrievance() {
  return (
    <section className="section watch" id="grievance" aria-labelledby="griev-h">
      <div className="container">
        <h2 id="griev-h" className="sec-title">Filing Complaints on SCORES — Easy &amp; Quick</h2>
        <p className="sec-sub" style={{ maxWidth: 720 }}>
          If we have not resolved your complaint to your satisfaction, SEBI’s SCORES portal and the
          SMART ODR platform are open to you. Here is exactly what filing a complaint involves.
        </p>

        <div className="values-grid stagger" style={{ marginTop: 36 }}>
          {POINTS.map((p) => (
            <div className="value-card" key={p.title}>
              <div className="vc-icon"><p.icon size={30} /></div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>

        <div
          className="row"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 34, justifyContent: 'center' }}
        >
          <a href={REGULATOR_LINKS.sebiScores} {...EXT} className="btn btn-red">
            <ListCheck size={17} strokeW={2} /> Lodge a Complaint on SCORES
          </a>
          <a href={REGULATOR_LINKS.smartOdr} {...EXT} className="btn btn-outline">
            <Pencil size={17} strokeW={2} /> SMART ODR Portal
          </a>
          <a href={POLICY_LINKS.sebiComplaint} {...EXT} className="btn btn-outline">
            <FilePdf size={17} strokeW={2} /> Step-by-step SCORES Guide
          </a>
        </div>

        <p className="sec-sub" style={{ textAlign: 'center', marginTop: 26 }}>
          Please raise the matter with us first —{' '}
          <Link href="/customer-care" className="link-red">
            our five-level escalation matrix <ArrowRight size={14} strokeW={2.2} />
          </Link>
        </p>
      </div>
    </section>
  );
}
