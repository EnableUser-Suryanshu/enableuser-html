'use client';

import { useMemo, useState } from 'react';
import type { DownloadItem } from '@/lib/pages-data';
import { Search, Download } from '../icons';

/** Category-filtered, searchable download library. */
export default function DownloadCentre({
  items, cats,
}: { items: DownloadItem[]; cats: string[] }) {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: items.length };
    cats.forEach((c) => { m[c] = items.filter((i) => i.cat === c).length; });
    return m;
  }, [items, cats]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (cat !== 'all' && i.cat !== cat) return false;
      return !q || i.label.toLowerCase().includes(q);
    });
  }, [items, cat, query]);

  return (
    <div className="dlc">
      <div className="dlc-bar">
        <div className="dlc-tabs" role="group" aria-label="Filter downloads by category">
          <button
            className={`dlc-tab${cat === 'all' ? ' on' : ''}`}
            aria-pressed={cat === 'all'}
            onClick={() => setCat('all')}
          >
            All <span className="dlc-n">{counts.all}</span>
          </button>
          {cats.map((c) => (
            <button
              key={c}
              className={`dlc-tab${cat === c ? ' on' : ''}`}
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
            >
              {c} <span className="dlc-n">{counts[c] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="dlc-search">
          <Search size={15} strokeW={2.2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms and files…"
            aria-label="Search downloads"
          />
        </div>
      </div>

      <p className="dlc-count" aria-live="polite">
        Showing <strong>{shown.length}</strong> of {items.length} files
      </p>

      <div className="dlc-grid">
        {shown.map((d, i) => (
          <a
            key={`${d.label}-${i}`}
            href={d.href}
            target="_blank"
            rel="noopener"
            className="dlc-item"
            download
          >
            <span className={`dlc-kind k-${d.kind.toLowerCase()}`}>{d.kind}</span>
            <span className="dlc-body">
              <span className="dlc-label">{d.label}</span>
              <span className="dlc-cat">{d.cat}</span>
            </span>
            <span className="dlc-go" aria-hidden="true"><Download size={17} strokeW={2} /></span>
          </a>
        ))}
        {shown.length === 0 && (
          <p className="dlc-empty">
            No file matches “{query}”.{' '}
            <button type="button" onClick={() => { setQuery(''); setCat('all'); }}>Reset</button>
          </p>
        )}
      </div>
    </div>
  );
}
