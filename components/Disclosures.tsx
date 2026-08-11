'use client';

import { useMemo, useState } from 'react';
import { KMP, AUTHORISED_PERSONS } from '@/lib/disclosures';
import { Shield, Users, Phone, Mail, Search, MapPin } from './icons';

type Tab = 'kmp' | 'ap';

export default function Disclosures() {
  const [tab, setTab] = useState<Tab>('kmp');
  const [query, setQuery] = useState('');

  const filteredAps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AUTHORISED_PERSONS;
    return AUTHORISED_PERSONS.filter(
      (ap) =>
        ap.name.toLowerCase().includes(q) ||
        ap.city.toLowerCase().includes(q) ||
        ap.regNo.toLowerCase().includes(q),
    );
  }, [query]);

  const cities = new Set(AUTHORISED_PERSONS.map((ap) => ap.city)).size;

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
              <div className="ap-note">
                <MapPin size={14} strokeW={2} /> {AUTHORISED_PERSONS.length} authorised persons
                across {cities} cities
              </div>
            </div>
            <div className="disc-scroll">
              <table className="disc-table">
                <thead>
                  <tr>
                    <th scope="col">Applicant Name</th>
                    <th scope="col">City</th>
                    <th scope="col">Segments</th>
                    <th scope="col">Registration No</th>
                    <th scope="col">Registered On</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAps.map((ap) => (
                    <tr key={ap.regNo}>
                      <td className="ap-name">{ap.name}</td>
                      <td>{ap.city}</td>
                      <td>
                        <span className="seg-chips">
                          {ap.segments.map((s) => (
                            <span className={`seg-chip${s === 'F&O' ? ' fo' : ''}`} key={s}>{s}</span>
                          ))}
                        </span>
                      </td>
                      <td className="mono">{ap.regNo}</td>
                      <td>{ap.regDate}</td>
                      <td><span className="status-pill">{ap.status}</span></td>
                    </tr>
                  ))}
                  {filteredAps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="ap-empty">
                        No authorised person matches &ldquo;{query}&rdquo;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
