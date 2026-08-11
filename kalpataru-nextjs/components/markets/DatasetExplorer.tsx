'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { MarketDataset, MarketGroup } from '@/lib/markets/types';
import { Search, ArrowRight } from '../icons';

/**
 * Compact directory: category tabs + live search, rendering only the active
 * slice. Keeps the hub short instead of stacking every group down the page.
 */
export default function DatasetExplorer({
  datasets, groups,
}: { datasets: MarketDataset[]; groups: MarketGroup[] }) {
  const [tab, setTab] = useState<string>('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: datasets.length };
    groups.forEach((g) => { m[g.id] = datasets.filter((d) => d.group === g.id).length; });
    return m;
  }, [datasets, groups]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return datasets.filter((d) => {
      if (tab !== 'all' && d.group !== tab) return false;
      if (!q) return true;
      return d.title.toLowerCase().includes(q) || d.blurb.toLowerCase().includes(q);
    });
  }, [datasets, tab, query]);

  const activeGroup = groups.find((g) => g.id === tab);

  return (
    <div className="dsx">
      <div className="dsx-bar">
        <div className="dsx-tabs" role="group" aria-label="Filter datasets by category">
          <button
            className={`dsx-tab${tab === 'all' ? ' on' : ''}`}
            aria-pressed={tab === 'all'}
            onClick={() => setTab('all')}
          >
            All <span className="dsx-n">{counts.all}</span>
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              className={`dsx-tab${tab === g.id ? ' on' : ''}`}
              aria-pressed={tab === g.id}
              onClick={() => setTab(g.id)}
            >
              {g.label} <span className="dsx-n">{counts[g.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="dsx-search">
          <Search size={15} strokeW={2.2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets…"
            aria-label="Search market datasets"
          />
        </div>
      </div>

      {activeGroup && <p className="dsx-blurb">{activeGroup.blurb}</p>}

      <div className="dsx-grid" aria-live="polite">
        {shown.map((d) => (
          <Link
            key={d.slug}
            href={`/markets/${d.slug}`}
            className={`dsx-item${d.pending ? ' pending' : ''}`}
          >
            <span className="dsx-title">{d.title}</span>
            <span className="dsx-meta">
              {d.pending
                ? <span className="dsx-soon">feed pending</span>
                : <span className="dsx-rows">{d.rows.length} rows</span>}
              <ArrowRight size={13} strokeW={2.4} />
            </span>
          </Link>
        ))}
        {shown.length === 0 && (
          <p className="dsx-empty">
            No dataset matches “{query}”.{' '}
            <button type="button" onClick={() => { setQuery(''); setTab('all'); }}>Reset</button>
          </p>
        )}
      </div>
    </div>
  );
}
