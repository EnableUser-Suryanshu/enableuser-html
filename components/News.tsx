'use client';

import { useEffect, useState } from 'react';
import { PORTALS, EXT } from '@/lib/links';
import { FileText, Rocket, ArrowRight } from './icons';
import Link from 'next/link';
import { getDataset } from '@/lib/markets';

export default function News() {
  const [announcements, setAnnouncements] = useState<any[]>(
    getDataset('exchange-announcements')?.rows?.slice(0, 2) || []
  );
  const [ipos, setIpos] = useState<any[]>(
    getDataset('ipo-current-issues')?.rows?.slice(0, 2) || []
  );

  useEffect(() => {
    fetch('/api/markets/exchange-announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data?.dataset?.rows) {
          setAnnouncements(data.dataset.rows.slice(0, 2));
        }
      })
      .catch(() => {});

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
        <div className="reveal rv-left">
          <h2 className="news-head"><FileText size={22} /> Market Updates</h2>
          {announcements.length > 0 ? (
            announcements.map((a: any, i: number) => (
              <article className="ncard" key={i}>
                <div className="ncard-top">
                  <span className="ncard-date">{a.date}</span>
                  <span className={`pill ${a.exchange === 'NSE' ? 'pill-bullish' : 'pill-ipo'}`}>
                    {a.exchange}
                  </span>
                </div>
                <h3 title={a.subject}>{a.company}</h3>
                <p>
                  {(a.subject || '').length > 120
                    ? (a.subject || '').substring(0, 120) + '...'
                    : a.subject}
                </p>
                <Link href="/markets" className="link-red">
                  Read Full Report <ArrowRight size={15} strokeW={2.2} />
                </Link>
              </article>
            ))
          ) : (
            <p>No recent market updates.</p>
          )}
        </div>
        <div className="reveal rv-right">
          <h2 className="news-head"><Rocket size={22} /> IPO &amp; NFO Insights</h2>
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
                <Link href="/markets" className="btn btn-outline">
                  Check Subscription Status
                </Link>
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
