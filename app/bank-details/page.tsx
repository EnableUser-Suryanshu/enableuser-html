import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { BANK_ACCOUNTS, DP_POOL, MARGIN_PLEDGE, type DpAccount } from '@/lib/bank-dp';
import { Bank, Shield } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Bank & DP Account Details | Kalpataru Multiplier Ltd',
  description:
    'Official client bank accounts and depository (CDSL / NSDL) pool and margin pledge account numbers of Kalpataru Multiplier Ltd. Verify before you transfer funds or securities.',
};

function DpTable({ id, caption, rows }: { id: string; caption: string; rows: DpAccount[] }) {
  return (
    <>
      <h3 id={id} className="sec-title" style={{ fontSize: 20, margin: '38px 0 14px' }}>
        {caption}
      </h3>
      <div className="disc-scroll">
        <table className="disc-table" style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th scope="col">Segment</th>
              <th scope="col">D.P.</th>
              <th scope="col">A/C No.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.segment}-${r.dp}`}>
                <th scope="row">{r.segment}</th>
                <td>{r.dp}</td>
                <td className="acc-no">{r.account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function BankDetailsPage() {
  return (
    <main id="main">
      <PageHero
        crumb="Bank & DP Details"
        words={[
          { text: 'Pay' }, { text: 'Only' }, { text: 'Into' },
          { text: 'These', accent: true }, { text: 'Accounts.' },
        ]}
        lead="The only bank and depository accounts operated by Kalpataru Multiplier Ltd. Check the account number and IFSC here before you transfer funds or securities."
      />

      {/* Bank accounts */}
      <section className="section watch" aria-labelledby="bank-h">
        <div className="container">
          <div className="mkt-sec-head">
            <div>
              <h2 id="bank-h" className="sec-title">Client Bank Accounts</h2>
              <p className="sec-sub">
                Registered with the exchanges for client fund settlement.
              </p>
            </div>
          </div>

          <div className="disc-scroll">
            <table className="disc-table">
              <thead>
                <tr>
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Bank Name</th>
                  <th scope="col">Account Number</th>
                  <th scope="col">IFSC Code</th>
                  <th scope="col">Account Type</th>
                  <th scope="col">Nature of A/C</th>
                </tr>
              </thead>
              <tbody>
                {BANK_ACCOUNTS.map((b, i) => (
                  <tr key={b.account}>
                    <td>{i + 1}</td>
                    <th scope="row" className="ap-name">{b.bank}</th>
                    <td className="acc-no">{b.account}</td>
                    <td className="acc-no">{b.ifsc}</td>
                    <td>{b.type}</td>
                    <td>{b.nature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="data-notice" role="note" style={{ marginTop: 26 }}>
            <Shield size={20} strokeW={1.9} />
            <p>
              <strong>Never transfer funds to any other account.</strong> Kalpataru Multiplier Ltd
              does not accept payments into the personal account of any employee, branch or
              authorised person, and does not accept cash. If someone asks you to pay elsewhere,
              call us on{' '}
              <a href="tel:07554350141" style={{ textDecoration: 'underline' }}>0755-4350141</a>{' '}
              before you pay.
            </p>
          </div>
        </div>
      </section>

      {/* Depository accounts */}
      <section className="section bank watch" aria-labelledby="dp-h">
        <div className="container">
          <div className="mkt-sec-head">
            <div>
              <h2 id="dp-h" className="sec-title">Depository Account Details</h2>
              <p className="sec-sub">
                Pool and margin pledge accounts held with CDSL and NSDL.
              </p>
            </div>
          </div>

          <DpTable id="pool-h" caption="DP Pool A/C Details" rows={DP_POOL} />
          <DpTable id="pledge-h" caption="Margin Pledge A/C Details" rows={MARGIN_PLEDGE} />

          <div className="data-notice" role="note" style={{ marginTop: 26 }}>
            <Bank size={20} strokeW={1.9} />
            <p>
              Kalpataru Multiplier Ltd is a Depository Participant of CDSL —
              SEBI Regn. No. <strong>IN-DP-CDSL-221-2003</strong>, DP ID <strong>12031600</strong>.
              Securities you deliver must go only to the pool account for the relevant segment.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Not sure which account to use?</h2>
          <p>Our customer-care desk will confirm the correct account before you transfer.</p>
          <div className="row">
            <a href="tel:07554350141" className="btn btn-white">CALL 0755-4350141</a>
            <a href="mailto:support@kalpatarumulti.com" className="btn btn-red">Email Support</a>
          </div>
        </div>
      </section>
    </main>
  );
}
