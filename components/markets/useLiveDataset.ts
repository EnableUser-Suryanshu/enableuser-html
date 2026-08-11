'use client';

import { useEffect, useRef, useState } from 'react';
import type { MarketDataset } from '@/lib/markets/types';

export interface LiveState {
  /** The freshest dataset available — live rows once they arrive, snapshot until then. */
  dataset: MarketDataset;
  /** True once live rows have replaced the deploy-time snapshot. */
  live: boolean;
  /** When the live rows were fetched. */
  at: Date | null;
  /** Set when the live fetch failed and the snapshot is still on screen. */
  failed: boolean;
}

/**
 * Keeps one market table current.
 *
 * The server-rendered snapshot paints immediately, then this fetches live rows
 * and swaps them in, repeating on an interval the API itself dictates (each
 * group knows how fast its upstream moves). Polling backs off while the tab is
 * hidden or the user has paused motion, and a failed fetch leaves the last good
 * rows on screen rather than blanking the table.
 */
/**
 * Rows-only variant for components that render a shaped view of one dataset
 * (the hub dashboard) rather than a generic table. Falls back to the passed-in
 * server-rendered rows until live ones arrive.
 */
export function useLiveRows<T>(slug: string, fallback: T[]): { rows: T[]; live: boolean } {
  const [rows, setRows] = useState<T[]>(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let loadedOnce = false;

    async function pull() {
      const idle =
        document.hidden || document.documentElement.classList.contains('motion-paused');
      if (loadedOnce && idle) {
        timer = setTimeout(pull, 60_000);
        return;
      }
      try {
        const r = await fetch(`/api/markets/${slug}`, { cache: 'no-store' });
        if (!r.ok) throw new Error(String(r.status));
        const j = (await r.json()) as { dataset: { rows: T[] } | null; ttl?: number };
        if (cancelled) return;
        loadedOnce = true;
        if (j.dataset?.rows?.length) {
          setRows(j.dataset.rows);
          setLive(true);
        }
        timer = setTimeout(pull, Math.max(20, (j.ttl ?? 60) + 5) * 1000);
      } catch {
        if (!cancelled) timer = setTimeout(pull, 120_000);
      }
    }

    pull();
    const onVis = () => { if (!document.hidden) pull(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [slug]);

  return { rows, live };
}

export default function useLiveDataset(snapshot: MarketDataset): LiveState {
  const [dataset, setDataset] = useState<MarketDataset>(snapshot);
  const [live, setLive] = useState(false);
  const [at, setAt] = useState<Date | null>(null);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loadedOnce = false;

    const schedule = (seconds: number) => {
      if (cancelled) return;
      if (timer.current) clearTimeout(timer.current);
      // Poll a little after the CDN copy expires so most hits are cache reads.
      timer.current = setTimeout(pull, Math.max(20, seconds + 5) * 1000);
    };

    async function pull() {
      // The first load always runs — a page opened in a background tab should
      // still show live numbers when the reader gets to it.
      const idle =
        document.hidden ||
        document.documentElement.classList.contains('motion-paused');
      if (loadedOnce && idle) {
        schedule(60);
        return;
      }

      try {
        const r = await fetch(`/api/markets/${snapshot.slug}`, { cache: 'no-store' });
        if (!r.ok) throw new Error(String(r.status));
        const j = (await r.json()) as {
          dataset: MarketDataset | null;
          ttl?: number;
          fetchedAt?: string;
        };
        if (cancelled) return;

        loadedOnce = true;
        if (j.dataset) {
          // Keep the snapshot's copy (title, blurb, note) and take the numbers.
          setDataset((prev) => ({ ...prev, ...j.dataset, stale: false }));
          setLive(true);
          setAt(j.fetchedAt ? new Date(j.fetchedAt) : new Date());
          setFailed(false);
        }
        schedule(j.ttl ?? 120);
      } catch {
        if (cancelled) return;
        // Leave the existing rows up; only flag it if we never got live data.
        setFailed(!loadedOnce);
        schedule(120);
      }
    }

    pull();
    const onVis = () => { if (!document.hidden) pull(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [snapshot.slug]);

  return { dataset, live, at, failed };
}
