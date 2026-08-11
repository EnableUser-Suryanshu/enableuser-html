'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface MarketStatusState {
  marketStatus: string;
  marketTimestamp: string;
  live: boolean;
}

const MarketStatusCtx = createContext<MarketStatusState>({
  marketStatus: '',
  marketTimestamp: '',
  live: false,
});

export function useMarketStatus() {
  return useContext(MarketStatusCtx);
}

/**
 * Fetches live market status from the API and provides it to all children.
 *
 * The server-rendered snapshot values are passed in as `initial*` props so the
 * first paint is always correct for the build moment. Once the client hydrates,
 * the component polls `/api/markets/live-indices` (which piggybacks market
 * status alongside index data) and updates the status in real time.
 */
export default function MarketStatusProvider({
  initialStatus,
  initialTimestamp,
  children,
}: {
  initialStatus: string;
  initialTimestamp: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<MarketStatusState>({
    marketStatus: initialStatus,
    marketTimestamp: initialTimestamp,
    live: false,
  });

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function poll() {
      try {
        const r = await fetch('/api/markets/live-indices', { cache: 'no-store' });
        if (!r.ok) throw new Error(String(r.status));
        const j = (await r.json()) as {
          status?: { marketStatus?: string; marketTimestamp?: string } | null;
          ttl?: number;
        };
        if (cancelled) return;

        if (j.status) {
          setState({
            marketStatus: j.status.marketStatus ?? state.marketStatus,
            marketTimestamp: j.status.marketTimestamp ?? state.marketTimestamp,
            live: true,
          });
        }
        timer = setTimeout(poll, Math.max(20, (j.ttl ?? 30) + 5) * 1000);
      } catch {
        if (!cancelled) timer = setTimeout(poll, 60_000);
      }
    }

    poll();
    const onVis = () => { if (!document.hidden) poll(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <MarketStatusCtx.Provider value={state}>
      {children}
    </MarketStatusCtx.Provider>
  );
}
