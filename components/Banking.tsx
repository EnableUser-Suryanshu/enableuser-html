import Link from 'next/link';
import { PORTALS, EXT } from '@/lib/links';
import { BANK_ACCOUNTS } from '@/lib/bank-dp';
import { Bank, Download, FilePdf, ArrowRight } from './icons';

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
          {BANK_ACCOUNTS.map((b) => (
            <div key={b.account} className="bank-acc">
              <div className="bank-row"><span className="k">Bank Name</span><span className="v name">{b.bank}</span></div>
              <div className="bank-row"><span className="k">A/C Number</span><span className="v">{b.account}</span></div>
              <div className="bank-row"><span className="k">IFSC Code</span><span className="v red">{b.ifsc}</span></div>
            </div>
          ))}
          <Link href="/bank-details" className="btn btn-outline dl-all">
            All Bank &amp; DP Accounts <ArrowRight size={15} strokeW={2.2} />
          </Link>
        </div>
        <div className="bank-card reveal rv-right">
          <div className="head"><Download size={24} /> Downloads &amp; Forms</div>
          {FORMS.map((f) => (
            <a key={f.label} href={f.href} {...EXT} className="dl-row">
              {f.label}
              <FilePdf strokeW={1.8} />
            </a>
          ))}
          <Link href="/downloads" className="btn btn-outline dl-all">Download All PDF Bundle</Link>
        </div>
      </div>
    </section>
  );
}
