import { KEY_CONTACTS } from '@/lib/pages-data';

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
}: {
  headingId?: string;
  showIntro?: boolean;
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
    </>
  );
}
