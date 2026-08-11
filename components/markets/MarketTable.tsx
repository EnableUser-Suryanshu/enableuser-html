'use client';

import { useMemo, useState } from 'react';
import type { MarketColumn, MarketDataset } from '@/lib/markets/types';
import { Search, ArrowRight } from '../icons';
import useLiveDataset from './useLiveDataset';

type Dir = 'asc' | 'desc';

const isNumeric = (t: MarketColumn['type']) => t === 'num' || t === 'change' || t === 'pct';

function fmt(value: string | number, col: MarketColumn) {
  if (typeof value !== 'number') return String(value);
  if (col.type === 'pct') return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  if (col.type === 'change') return `${value > 0 ? '+' : ''}${value.toLocaleString('en-IN')}`;
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

const clock = (d: Date) =>
  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

/**
 * Sortable, filterable market data table with staggered row entrance.
 *
 * Renders the deploy-time snapshot server-side for an instant first paint, then
 * `useLiveDataset` replaces the rows with live ones and keeps them refreshing.
 */
export default function MarketTable({ dataset: snapshot }: { dataset: MarketDataset }) {
  const { dataset, live, at, failed } = useLiveDataset(snapshot);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(snapshot.defaultSort ?? null);
  const [dir, setDir] = useState<Dir>('desc');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = dataset.rows;
    if (q) {
      out = out.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    if (sortKey) {
      const col = dataset.columns.find((c) => c.key === sortKey);
      out = [...out].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        let cmp: number;
        if (col && isNumeric(col.type)) cmp = Number(av) - Number(bv);
        else cmp = String(av).localeCompare(String(bv));
        return dir === 'asc' ? cmp : -cmp;
      });
    }
    return out;
  }, [dataset, query, sortKey, dir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setDir('desc');
    }
  };

  const ariaSort = (key: string): 'ascending' | 'descending' | 'none' =>
    sortKey === key ? (dir === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <div className="mkt-table-wrap">
      {dataset.stale && dataset.note && (
        <p className="mkt-stale" role="note">
          <strong>Not refreshed this build.</strong> {dataset.note}
        </p>
      )}
      <div className="mkt-toolbar">
        <div className="mkt-search">
          <Search size={15} strokeW={2.2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${dataset.title.toLowerCase()}…`}
            aria-label={`Search within ${dataset.title}`}
          />
        </div>
        <p className="mkt-count" aria-live="polite">
          Showing <strong>{rows.length}</strong> of {dataset.rows.length} rows
        </p>
        <p className={`mkt-live${live ? ' on' : ''}`} aria-live="polite">
          <span className="mkt-live-dot" aria-hidden="true"></span>
          {live && at
            ? `Live · updated ${clock(at)}`
            : failed
              ? 'Showing last saved figures'
              : 'Fetching live data…'}
        </p>
      </div>

      <div className="mkt-scroll">
        <table className="mkt-table">
          <caption className="sr-only">
            {dataset.title} — {dataset.blurb} Sortable table of {dataset.rows.length} rows;
            use the column headers to reorder and the search box to filter.
          </caption>
          <thead>
            <tr>
              {dataset.columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={ariaSort(c.key)}
                  className={isNumeric(c.type) ? 'right' : undefined}
                >
                  <button
                    type="button"
                    className={`mkt-sort${sortKey === c.key ? ' on' : ''}`}
                    onClick={() => toggleSort(c.key)}
                  >
                    {c.label}
                    <span className="mkt-caret" aria-hidden="true">
                      {sortKey === c.key ? (dir === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ '--i': Math.min(i, 14) } as React.CSSProperties}>
                {dataset.columns.map((c, ci) => {
                  const v = r[c.key];
                  const numeric = isNumeric(c.type);
                  const signed = c.type === 'change' || c.type === 'pct';
                  const cls = [
                    numeric ? 'right' : '',
                    signed && typeof v === 'number' ? (v >= 0 ? 'up' : 'down') : '',
                    c.type === 'num' ? 'mono' : '',
                  ].filter(Boolean).join(' ');
                  const content =
                    c.type === 'tag' ? (
                      <span className={`mkt-tag t-${String(v).toLowerCase().replace(/[^a-z]/g, '')}`}>{v}</span>
                    ) : (
                      fmt(v, c)
                    );
                  return ci === 0 ? (
                    <th scope="row" key={c.key} className={cls || undefined}>{content}</th>
                  ) : (
                    <td key={c.key} className={cls || undefined}>{content}</td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={dataset.columns.length} className="mkt-empty">
                  {dataset.rows.length === 0 ? (
                    /* The source itself returned nothing — say so plainly rather
                       than implying the search hid something. */
                    dataset.note ?? 'The exchanges report no entries for this table right now.'
                  ) : (
                    <>
                      No rows match “{query}”.{' '}
                      <button type="button" className="link-red" onClick={() => setQuery('')}>
                        Clear search <ArrowRight size={14} strokeW={2.2} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
