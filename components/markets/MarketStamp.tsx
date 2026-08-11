'use client';

import { useMarketStatus } from './MarketStatusContext';

/**
 * The "Live exchange data · 07-Aug-2026 15:30 · Market Open" line shown in the
 * page hero. Reads live status from context so it stays current while the tab
 * is open instead of being frozen at deploy time.
 */
export default function MarketStamp() {
  const { marketStatus, marketTimestamp } = useMarketStatus();
  const open = /open/i.test(marketStatus);

  return (
    <p className="mkt-stamp">
      <span className={`mkt-live-dot ${open ? 'on' : ''}`} aria-hidden="true"></span>
      Live exchange data · {marketTimestamp} · Market {open ? 'Open' : 'Closed'}
    </p>
  );
}
