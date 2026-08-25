'use client';

import { useEffect, useState } from 'react';
import { PORTALS, EXT, REGULATOR_LINKS } from '@/lib/links';
import { Rocket } from './icons';
import { getDataset } from '@/lib/markets';

export default function News() {
  const [ipos, setIpos] = useState<any[]>(
    getDataset('ipo-current-issues')?.rows?.slice(0, 2) || []
  );

  useEffect(() => {
    fetch('/api/markets/ipo-current-issues')
      .then((res) => res.json())
      .then((data) => {
        if (data?.dataset?.rows) {
          setIpos(data.dataset.rows.slice(0, 2));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section news watch" id="news">
      <div className="container news-grid">
        <div className="reveal">
          <h2 className="news-head"><Rocket size={22} /> IPO Insights</h2>
          {ipos.length > 0 ? (
            ipos.map((ipo: any, i: number) => (
              <article className="ncard" key={i}>
                <div className="ncard-top">
                  <span className="ncard-date">{ipo.open === '—' ? 'Upcoming' : 'Open'}</span>
                  <span className="pill pill-ipo">IPO</span>
                </div>
                <h3>
                  {ipo.company} {ipo.symbol && ipo.symbol !== '—' ? `(${ipo.symbol})` : ''}
                </h3>
                <p>
                  Price Band: {ipo.band} | Issue Size: {ipo.size} | Open: {ipo.open} | Close: {ipo.close}
                </p>
                <a href={REGULATOR_LINKS.nseVerifyIpoBids} {...EXT} className="btn btn-outline">
                  Check Subscription Status
                </a>
              </article>
            ))
          ) : (
            <p>No current IPOs.</p>
          )}
          {/* Never name a specific NFO here. This card previously advertised an
              invented "Infrastructure growth fund" with a made-up minimum
              investment whenever fewer than two live IPOs came back — fabricated
              product copy on a SEBI-registered broker's homepage. Keep it
              generic; live NFO data has no free feed. */}
          {ipos.length < 2 && (
            <article className="ncard">
              <div className="ncard-top">
                <span className="ncard-date">Mutual Funds</span>
                <span className="pill pill-nfo">NFO</span>
              </div>
              <h3>New Fund Offers</h3>
              <p>
                New Fund Offers open through the year across equity, debt and hybrid schemes. See
                the schemes currently open for subscription, and their scheme documents, on our
                mutual fund portal.
              </p>
              <a href={PORTALS.mutualFund} {...EXT} className="btn btn-navy">
                Browse Mutual Funds
              </a>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
