import { KEY_CONTACTS, EXCHANGE_GRIEVANCE } from '@/lib/pages-data';
import { EXT } from '@/lib/links';
import { ArrowRight, Shield } from '../icons';

/**
 * The escalation matrix SEBI requires brokers to publish — who to contact at
 * each level, with direct numbers and working hours.
 *
 * Shared between /contact and /customer-care rather than duplicated: these are
 * regulated disclosures, and two copies of the same table is two things to keep
 * in step when a name or number changes.
 */
export default function EscalationMatrix({
  headingId = 'esc-matrix-h',
  showIntro = true,
  /**
   * Shows the regulator and depository escalation routes beneath the table —
   * where a client who has exhausted the matrix goes next. Carried over from
   * the live site, which publishes them in exactly this position.
   */
  showRegulators = false,
}: {
  headingId?: string;
  showIntro?: boolean;
  showRegulators?: boolean;
}) {
  return (
    <>
      <h2 id={headingId} style={{ textAlign: 'center', fontSize: 30, fontWeight: 600 }}>
        Escalation Matrix
      </h2>
      {showIntro && (
        <p className="sub" style={{ textAlign: 'center', margin: '12px auto 30px', maxWidth: 620 }}>
          Names, direct numbers and working hours — published as required by SEBI. Start at
          customer care and move down the list if your complaint is not resolved.
        </p>
      )}
      <div className="disc-scroll">
        <table className="disc-table">
          <caption className="sr-only">
            Escalation matrix: contact person, telephone number, email address and working hours
            for each level, from customer care through to the Chief Executive Officer.
          </caption>
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

      {showRegulators && (
        <div className="esc-reg">
          <p className="esc-reg-lead">
            <Shield size={18} strokeW={2} aria-hidden="true" />
            <span>
              If we have not responded, or the outcome does not satisfy you, you may take the
              complaint to the depository or the regulator directly. <strong>Quote your
              Complaint Reference Number</strong> when you do — it lets them trace what we have
              already done.
            </span>
          </p>

          <ul className="esc-reg-grid">
            {EXCHANGE_GRIEVANCE.map((g) => (
              <li key={g.name}>
                <a href={g.href} {...EXT}>
                  <span>{g.name}</span>
                  <ArrowRight size={15} strokeW={2.2} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
