import { PORTALS, EXT } from '@/lib/links';
import { FileText, Rocket, ArrowRight } from './icons';
import Link from 'next/link';
import { getDataset } from '@/lib/markets';

export default function News() {
  const announcements = getDataset('exchange-announcements')?.rows?.slice(0, 2) || [];
  const ipos = getDataset('ipo-current-issues')?.rows?.slice(0, 2) || [];

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
          {ipos.length < 2 && (
            <article className="ncard">
              <div className="ncard-top">
                <span className="ncard-date">Open Now</span>
                <span className="pill pill-nfo">NFO</span>
              </div>
              <h3>Latest NFO: Infrastructure growth fund now open for subscription</h3>
              <p>
                Invest in the backbone of India&apos;s economy with the new thematic infrastructure fund. Min
                investment ₹5,000...
              </p>
              <a href={PORTALS.mutualFund} {...EXT} className="btn btn-navy">
                Invest via Direct Plan
              </a>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
