'use client';

import { useMemo, useState } from 'react';
import type { Branch } from '@/lib/pages-data';
// `Map` is aliased so it does not shadow the global Map constructor.
import { Search, Phone, Mail, MapPin, Person, Map as MapIcon } from '../icons';

const mapUrl = (b: Branch) =>
  `https://maps.google.com/?q=${encodeURIComponent(`Kalpataru Multiplier ${b.address}`)}`;

/** City-filtered, searchable branch directory. */
export default function BranchFinder({ branches }: { branches: Branch[] }) {
  const [city, setCity] = useState('all');
  const [query, setQuery] = useState('');

  const cities = useMemo(() => {
    const counts = new Map<string, number>();
    branches.forEach((b) => counts.set(b.city, (counts.get(b.city) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [branches]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter((b) => {
      if (city !== 'all' && b.city !== city) return false;
      if (!q) return true;
      return (
        b.address.toLowerCase().includes(q) ||
        b.person.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.mobile.includes(q) ||
        b.phone.includes(q)
      );
    });
  }, [branches, city, query]);

  return (
    <div className="bfind">
      <div className="bfind-bar">
        {/* A city filter only helps when there is more than one city to pick
            from; with a single-city network it would just be "All" and that
            one city side by side. */}
        {cities.length > 1 && (
          <div className="bfind-cities" role="group" aria-label="Filter branches by city">
            <button
              className={`bfind-city${city === 'all' ? ' on' : ''}`}
              aria-pressed={city === 'all'}
              onClick={() => setCity('all')}
            >
              All cities <span className="bfind-n">{branches.length}</span>
            </button>
            {cities.map(([c, n]) => (
              <button
                key={c}
                className={`bfind-city${city === c ? ' on' : ''}`}
                aria-pressed={city === c}
                onClick={() => setCity(c)}
              >
                {c} <span className="bfind-n">{n}</span>
              </button>
            ))}
          </div>
        )}
        <div className="bfind-search">
          <Search size={15} strokeW={2.2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search branch, area or manager…"
            aria-label="Search branches"
          />
        </div>
      </div>

      <p className="bfind-count" aria-live="polite">
        Showing <strong>{shown.length}</strong> of {branches.length} branches
      </p>

      <div className="bfind-grid">
        {shown.map((b, i) => (
          <article className="bcard bfind-card" key={`${b.address}-${i}`}>
            <div className="bfind-top">
              <span className="bfind-pin"><MapPin size={16} strokeW={2} /></span>
              <span className="bfind-cityname">{b.city}</span>
            </div>
            <address>{b.address}</address>
            <div className="meta">
              {b.person && (
                <span><Person size={14} strokeW={1.9} /> {b.person}</span>
              )}
              {b.mobile && (
                <span>
                  <Phone size={14} strokeW={1.9} />
                  {b.mobile.split(/[,/]/).map((m, j) => {
                    const t = m.trim();
                    return t ? (
                      <a key={j} href={`tel:${t.replace(/\s/g, '')}`} className="bfind-tel">{t}</a>
                    ) : null;
                  })}
                </span>
              )}
              {b.phone && (
                <span><Phone size={14} strokeW={1.9} /> {b.phone}</span>
              )}
              {b.email && (
                <span className="bfind-mail">
                  <Mail size={14} strokeW={1.9} />
                  <a href={`mailto:${b.email.split(',')[0].trim()}`}>{b.email}</a>
                </span>
              )}
            </div>
            <a href={mapUrl(b)} target="_blank" rel="noopener" className="link-red loc">
              <MapIcon size={14} strokeW={1.9} /> View on map
            </a>
          </article>
        ))}
        {shown.length === 0 && (
          <p className="bfind-empty">
            No branch matches “{query}”.{' '}
            <button type="button" onClick={() => { setQuery(''); setCity('all'); }}>Reset filters</button>
          </p>
        )}
      </div>
    </div>
  );
}
