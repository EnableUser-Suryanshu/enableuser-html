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
                  Authorised persons: name and contact number, exchange-wise authorised person
                  code, constitution, status, registered address with city, state and PIN, and
                  the number of terminals allotted. A field shown as an em dash is not on record.
                </caption>
                <thead>
                  {/* The exchange format splits the address over four columns
                      and the terminal details over two. Kept that way the table
                      is wider than any container and has to scroll sideways, so
                      each group is one cell here with its parts stacked inside.
                      Every field the format asks for is still present. */}
                  <tr>
                    <th scope="col">Sr.</th>
                    <th scope="col">Authorised Person</th>
                    <th scope="col">AP Code (Exchange wise)</th>
                    <th scope="col">Constitution</th>
                    <th scope="col">Status</th>
                    <th scope="col">Registered Address</th>
                    <th scope="col">Terminals</th>
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
                      <td className="ap-addr" data-label="Registered Address">
                        {ap.address ? (
                          <>
                            {ap.address}
                            <span className="ap-place">
                              {ap.city}, {ap.state} &ndash; <span className="mono">{ap.pin}</span>
                            </span>
                          </>
                        ) : <Pending />}
                      </td>
                      <td className="ap-term" data-label="Terminals">
                        <span className="ap-term-n">{ap.terminals}</span>
                        <span className="ap-term-f">
                          {ap.terminalAllotted === 'Y' ? 'Allotted' : 'Not allotted'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredAps.length === 0 && (
                    <tr>
                      <td colSpan={7} className="ap-empty">
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
