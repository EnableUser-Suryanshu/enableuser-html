'use client';

import { useMemo, useState } from 'react';
import { KMP, AUTHORISED_PERSONS } from '@/lib/disclosures';
import { Shield, Users, Phone, Mail, Search, MapPin } from './icons';

type Tab = 'kmp' | 'ap';

/**
 * A field the exchange record does not carry. Shown as an em dash, which a
 * screen reader would otherwise read as a dash or skip entirely — so the real
 * meaning goes in text only assistive tech sees.
 */
const Pending = () => (
  <span className="ap-na">
    <span aria-hidden="true">—</span>
    <span className="sr-only">Not on record</span>
  </span>
);

export default function Disclosures() {
  const [tab, setTab] = useState<Tab>('kmp');
  const [query, setQuery] = useState('');

  const filteredAps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AUTHORISED_PERSONS;
    return AUTHORISED_PERSONS.filter((ap) =>
      [ap.name, ap.city ?? '', ...ap.codes.map((c) => c.code)]
        .some((f) => f.toLowerCase().includes(q)),
    );
  }, [query]);

  // Rows whose city is still pending are not counted as a location.
  const cities = new Set(AUTHORISED_PERSONS.map((ap) => ap.city).filter(Boolean)).size;

  return (
    <section className="section disclosures watch" aria-label="Regulatory disclosures">
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 600 }}>
          Regulatory Disclosures
        </h2>
        <p className="sub" style={{ textAlign: 'center', margin: '12px auto 0', maxWidth: 600 }}>
          Who runs the firm and who represents it — published openly, exactly as filed.
        </p>

        <div className="disc-tabs">
          <button
            aria-pressed={tab === 'kmp'}
            className={`disc-tab${tab === 'kmp' ? ' on' : ''}`}
            onClick={() => setTab('kmp')}
          >
            <Shield size={16} /> Key Managerial Personnel
            <span className="disc-count">{KMP.length}</span>
          </button>
          <button
            aria-pressed={tab === 'ap'}
            className={`disc-tab${tab === 'ap' ? ' on' : ''}`}
            onClick={() => setTab('ap')}
          >
            <Users size={16} /> Authorised Persons
            <span className="disc-count">{AUTHORISED_PERSONS.length}</span>
          </button>
        </div>

        {tab === 'kmp' ? (
          <div className="kmp-grid">
            {KMP.map((k, i) => (
              <div className="kmp-card" key={i}>
                <div className="kmp-role">{k.designation}</div>
                <div className="kmp-name">{k.name}</div>
                <div className="kmp-meta">
                  <a href={`tel:${k.mobile}`}><Phone size={14} strokeW={1.8} /> {k.mobile}</a>
                  <a href={`mailto:${k.email}`}><Mail size={14} strokeW={1.8} /> {k.email}</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="ap-bar">
              <div className="ap-search">
                <Search size={15} strokeW={2.2} />
                <input
                  type="search"
                  placeholder="Search by name, city or registration no…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search authorised persons"
                />
              </div>
              {/* Filtering happens without a page change, so the new result
                  count has to be announced — WCAG 4.1.3 Status Messages. */}
              <div className="ap-note" role="status" aria-live="polite">
                <MapPin size={14} strokeW={2} />{' '}
                {query
                  ? `${filteredAps.length} of ${AUTHORISED_PERSONS.length} authorised persons match “${query}”`
                  : `${AUTHORISED_PERSONS.length} authorised persons across ${cities} cities`}
              </div>
            </div>
            <div className="disc-scroll">
              <table className="disc-table ap-table">
                <caption className="sr-only">
                  Authorised persons: serial number, name and contact number, exchange-wise
                  authorised person code, constitution, status, registered address split into
                  address, city, state and pin code, and terminal details giving whether a
                  terminal is allotted and how many. A field shown as an em dash is not on record.
                </caption>
                {/* Explicit column widths. Under table-layout: fixed the
                    browser takes widths from the first row, and that row is all
                    colSpan groups here — so without a colgroup the four address
                    columns split their group's share arbitrarily and the address
                    itself ends up the narrowest of them. */}
                <colgroup>
                  {['3%', '12.5%', '12.5%', '9%', '9.5%', '19.5%', '7.5%', '8.5%', '6%', '6.5%', '6.5%']
                    .map((w, i) => <col key={i} style={{ width: w }} />)}
                </colgroup>
                <thead>
                  {/* The exchange's own column layout, kept exactly: the address
                      split over four columns and the terminal details over two,
                      under grouped headings. colSpan/rowSpan plus scope keeps
                      that grouping readable to a screen reader, not just to the
                      eye. It fits without a sideways scroll because the type and
                      the column widths are tuned for it — see .ap-table in the
                      stylesheet — not because any column was merged away.

                      The contact number is the one addition to the format. It
                      sits under the name rather than in a twelfth column, which
                      is what the verification sheet asks for without widening
                      the table. */}
                  <tr>
                    <th scope="col" rowSpan={2}>Sr.<br />No.</th>
                    <th scope="col" rowSpan={2}>Authorised Person&rsquo;s Name</th>
                    <th scope="col" rowSpan={2}>Authorised Person Code (Exchange wise)</th>
                    <th scope="col" rowSpan={2}>Constitution</th>
                    <th scope="col" rowSpan={2}>Status (Approved/ Cancelled)</th>
                    <th scope="colgroup" colSpan={4} className="ap-grp">Registered Address</th>
                    <th scope="colgroup" colSpan={2} className="ap-grp">Terminal Details</th>
                  </tr>
                  <tr>
                    <th scope="col">Address</th>
                    <th scope="col">City</th>
                    <th scope="col">State</th>
                    <th scope="col">Pin code</th>
                    <th scope="col">Terminal Allotted (Y/N)</th>
                    <th scope="col">No. of Terminals</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAps.map((ap, i) => (
                    <tr key={ap.codes[0].code}>
                      <td className="ap-sr">{i + 1}</td>
                      <th scope="row" className="ap-name">
                        {ap.name}
                        {ap.mobile && (
                          <a href={`tel:${ap.mobile}`} className="ap-tel">{ap.mobile}</a>
                        )}
                      </th>
                      <td className="ap-codes" data-label="AP Code (Exchange wise)">
                        {/* One column, codes separated by a slash, per the
                            exchange's own note on the source sheet. */}
                        {ap.codes.map((c, j) => (
                          <span key={c.code}>
                            {j > 0 && <span className="ap-slash" aria-hidden="true"> / </span>}
                            <span className="mono">{c.code}</span>
                            <span className="ap-exch">{c.exchange}</span>
                          </span>
                        ))}
                      </td>
                      <td data-label="Constitution">{ap.constitution ?? <Pending />}</td>
                      <td data-label="Status"><span className="status-pill">{ap.status}</span></td>
                      <td className="ap-addr" data-label="Address">{ap.address ?? <Pending />}</td>
                      <td data-label="City">{ap.city ?? <Pending />}</td>
                      <td data-label="State">{ap.state ?? <Pending />}</td>
                      <td className="ap-pin" data-label="Pin code">{ap.pin ?? <Pending />}</td>
                      <td className="ap-mid" data-label="Terminal Allotted">{ap.terminalAllotted}</td>
                      <td className="ap-mid" data-label="No. of Terminals">{ap.terminals}</td>
                    </tr>
                  ))}
                  {filteredAps.length === 0 && (
                    <tr>
                      <td colSpan={11} className="ap-empty">
                        No authorised person matches &ldquo;{query}&rdquo;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="ap-foot">
              Authorised person codes are as issued by the exchange. Where a field is shown as
              &ldquo;—&rdquo;, that detail is not on our record; it is left blank rather than
              estimated. Call <a href="tel:07554266669" className="ap-tel">0755 426 6669</a> and we
              will confirm it from the exchange filing.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
