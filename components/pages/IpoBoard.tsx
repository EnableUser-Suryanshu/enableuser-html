'use client';

import Link from 'next/link';
import { useLiveRows } from '@/components/markets/useLiveDataset';
import { PORTALS, EXT } from '@/lib/links';
import { ArrowRight, Rocket, CalendarCheck, CheckCircle } from '@/components/icons';

/**
 * The IPO board on the services page.
 *
 * Three questions, in the order someone asks them: what can I apply to today,
 * what is coming, and what just listed. The server-rendered snapshot paints
 * first and useLiveRows swaps in fresh rows — subscription in particular moves
 * through the day while an issue is open, so a figure baked in at deploy time
 * would be wrong by the time anyone read it.
 */

export interface OpenIpo {
  company: string; symbol: string; band: string;
  open: string; close: string; subscribed: number; offered: number;
}
export interface UpcomingIpo {
  company: string; symbol: string; series: string;
  band: string; open: string; close: string; size: number;
}
export interface ListedIpo {
  company: string; symbol: string; type: string;
  band: string; issuePrice: number; listed: string;
}

/** "24-Sep-2026" → "24 Sep" — the year is noise on a board about this week. */
const short = (d: string) => {
  const m = /^(\d{1,2})-([A-Za-z]{3})/.exec(d ?? '');
  return m ? `${m[1]} ${m[2]}` : (d || '—');
};

/**
 * Subscription is the number people look for, so it gets the emphasis — and a
 * colour, but never colour alone: the multiple is always written out.
 */
function Subscription({ times }: { times: number }) {
  if (!Number.isFinite(times) || times <= 0) {
    return <span className="ipo-sub ipo-sub--none">Not yet</span>;
  }
  const tone = times >= 2 ? 'hot' : times >= 1 ? 'full' : 'part';
  return (
    <span className={`ipo-sub ipo-sub--${tone}`}>
      {times.toFixed(2)}<span className="ipo-x">×</span>
    </span>
  );
}

export default function IpoBoard({
  open, upcoming, listed,
}: { open: OpenIpo[]; upcoming: UpcomingIpo[]; listed: ListedIpo[] }) {
  const { rows: openRows, live } = useLiveRows<OpenIpo>('ipo-current-issues', open);
  const { rows: upRows } = useLiveRows<UpcomingIpo>('ipo-upcoming', upcoming);
  const { rows: listedRows } = useLiveRows<ListedIpo>('ipo-recently-listed', listed);

  const openNow = openRows.slice(0, 6);
  const soon = upRows.slice(0, 6);
  const recent = listedRows.slice(0, 5);

  return (
    <section className="section ipo-board watch" aria-labelledby="ipo-h">
      <div className="container">
        <h2 id="ipo-h" className="sec-title">IPOs</h2>
        <p className="sec-sub">
          Open issues, what is coming, and what has just listed — straight from NSE.
          {live && <span className="ipo-live"> Updating live</span>}
        </p>

        <div className="ipo-grid">
          {/* ---- open now ---- */}
          <div className="ipo-col">
            <h3 className="ipo-col-h"><Rocket size={17} strokeW={2} aria-hidden="true" /> Open now</h3>
            {openNow.length === 0 ? (
              <p className="ipo-empty">No issue is open for bidding today.</p>
            ) : (
              <ul className="ipo-list">
                {openNow.map((r) => (
                  <li key={r.symbol}>
                    <div className="ipo-row-top">
                      <span className="ipo-name">{r.company}</span>
                      <Subscription times={r.subscribed} />
                    </div>
                    <div className="ipo-meta">
                      <span className="ipo-band">{r.band}</span>
                      <span className="ipo-dates">Closes {short(r.close)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="ipo-cta">
              Apply with UPI <ArrowRight size={15} strokeW={2.3} aria-hidden="true" />
            </a>
          </div>

          {/* ---- upcoming ---- */}
          <div className="ipo-col">
            <h3 className="ipo-col-h"><CalendarCheck size={17} strokeW={2} aria-hidden="true" /> Opening soon</h3>
            {soon.length === 0 ? (
              <p className="ipo-empty">Nothing announced yet.</p>
            ) : (
              <ul className="ipo-list">
                {soon.map((r) => (
                  <li key={r.symbol}>
                    <div className="ipo-row-top">
                      <span className="ipo-name">{r.company}</span>
                      <span className="ipo-when">{short(r.open)}</span>
                    </div>
                    <div className="ipo-meta">
                      <span className="ipo-band">{r.band}</span>
                      <span className="ipo-dates">{r.series}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/markets/ipo-upcoming" className="ipo-cta ipo-cta--quiet">
              Full calendar <ArrowRight size={15} strokeW={2.3} aria-hidden="true" />
            </Link>
          </div>

          {/* ---- listed ---- */}
          <div className="ipo-col">
            <h3 className="ipo-col-h"><CheckCircle size={17} strokeW={2} aria-hidden="true" /> Just listed</h3>
            {recent.length === 0 ? (
              <p className="ipo-empty">No recent listings.</p>
            ) : (
              <ul className="ipo-list">
                {recent.map((r) => (
                  <li key={`${r.symbol}-${r.listed}`}>
                    <div className="ipo-row-top">
                      <span className="ipo-name">{r.company}</span>
                      <span className="ipo-when">{short(r.listed)}</span>
                    </div>
                    <div className="ipo-meta">
                      <span className="ipo-band">{r.type}</span>
                      {r.issuePrice > 0 && <span className="ipo-dates">Issue ₹{r.issuePrice}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/markets/ipo-recently-listed" className="ipo-cta ipo-cta--quiet">
              All listings <ArrowRight size={15} strokeW={2.3} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <p className="ipo-note">
          Subscription figures are NSE&rsquo;s own and move while an issue is open. Applying does
          not guarantee an allotment, and a listing gain is never assured.
        </p>
      </div>
    </section>
  );
}
