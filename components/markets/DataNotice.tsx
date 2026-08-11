import { marketMeta } from '@/lib/markets';
import { Shield, History } from '../icons';

/**
 * Provenance strip: names the actual source for this table and the timestamp.
 *
 * Only a licensed feed (TrueData) may be described as an authorised vendor —
 * the public sources behind the global, mutual-fund and FX tables are credited
 * by name instead.
 */
export default function DataNotice({ vendor }: { vendor?: string }) {
  const open = /open/i.test(marketMeta.marketStatus);
  const licensed = marketMeta.vendor;
  return (
    <div className="data-notice" role="note">
      <Shield size={20} strokeW={1.9} />
      <p>
        <strong>Live market data.</strong>{' '}
        {vendor ? (
          <>Sourced from <strong>{vendor}</strong>.</>
        ) : licensed ? (
          <>Sourced from <strong>{licensed}</strong>, a SEBI-recognised authorised data vendor.</>
        ) : (
          <>
            Sourced from{' '}
            <a href="https://www.nseindia.com" target="_blank" rel="noopener">NSE India</a> and{' '}
            <a href="https://www.bseindia.com" target="_blank" rel="noopener">BSE India</a>.
          </>
        )}{' '}
        This table refreshes itself in your browser while the page is open — the
        timestamp above the table shows when these figures were last pulled.
        Figures are indicative for research and may lag the exchange; they are not a
        substitute for your trading terminal.
      </p>
      <span className={`mkt-status ${open ? 'open' : 'closed'}`}>
        <History size={13} strokeW={2.2} />
        Market {open ? 'Open' : 'Closed'}
      </span>
    </div>
  );
}

/** Empty state for datasets that still need the licensed vendor feed. */
export function PendingNotice({ title }: { title: string }) {
  return (
    <div className="pending-state">
      <div className="pending-ico"><Shield size={30} strokeW={1.7} /></div>
      <h2>{title} — could not be refreshed</h2>
      <p>
        Every table in this section has a live source wired up, but this one returned
        nothing on the most recent build. Rather than show stale or invented figures,
        the page is left empty.
      </p>
      <p className="pending-hint">
        It should repopulate on the next deployment. If it does not, the source for this
        table needs checking in <code>scripts/fetch-market-data.mjs</code>.
      </p>
    </div>
  );
}
