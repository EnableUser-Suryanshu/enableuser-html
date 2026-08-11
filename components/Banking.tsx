import { PORTALS, EXT } from '@/lib/links';
import { Bank, Download, FilePdf } from './icons';

const FORMS = [
  { label: 'Account Opening Form', href: PORTALS.ekycAccountOpening },
  { label: 'KYC / Modification Form', href: PORTALS.reKyc },
  { label: 'Mutual Fund Direct Form', href: PORTALS.mutualFund },
];

export default function Banking() {
  return (
    <section className="section bank watch" id="downloads">
      <div className="container bank-grid">
        <div className="bank-card reveal rv-left">
          <div className="head"><Bank size={24} /> Secure Banking Details</div>
          <div className="bank-row"><span className="k">Bank Name</span><span className="v name">HDFC Bank Ltd.</span></div>
          <div className="bank-row"><span className="k">A/C Number</span><span className="v">50200021XXXXXXX</span></div>
          <div className="bank-row"><span className="k">UPI ID</span><span className="v red">kalpataru@hdfcbank</span></div>
          <div className="bank-row"><span className="k">CDSL DP ID</span><span className="v">12033200XXXXXXX</span></div>
        </div>
        <div className="bank-card reveal rv-right">
          <div className="head"><Download size={24} /> Downloads &amp; Forms</div>
          {FORMS.map((f) => (
            <a key={f.label} href={f.href} {...EXT} className="dl-row">
              {f.label}
              <FilePdf strokeW={1.8} />
            </a>
          ))}
          <a href="#" className="btn btn-outline dl-all">Download All PDF Bundle</a>
        </div>
      </div>
    </section>
  );
}
