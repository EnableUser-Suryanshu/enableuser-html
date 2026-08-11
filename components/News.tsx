import { PORTALS, EXT } from '@/lib/links';
import { FileText, Rocket, ArrowRight } from './icons';

export default function News() {
  return (
    <section className="section news watch" id="news">
      <div className="container news-grid">
        <div className="reveal rv-left">
          <h2 className="news-head"><FileText size={22} /> Market Updates</h2>
          <article className="ncard">
            <div className="ncard-top">
              <span className="ncard-date">May 28, 2027</span>
              <span className="pill pill-bullish">BULLISH</span>
            </div>
            <h3>Nifty 50 hits record high as FII inflows increase</h3>
            <p>Benchmark indices touched new peaks today led by banking and IT stocks amidst strong global cues...</p>
            <a href="#" className="link-red">Read Full Report <ArrowRight size={15} strokeW={2.2} /></a>
          </article>
          <article className="ncard">
            <div className="ncard-top">
              <span className="ncard-date">May 29, 2026</span>
            </div>
            <h3>Sensex rises 400 points following positive GDP outlook</h3>
            <p>The Indian stock market witnessed a strong recovery in the final hour of trading as investors cheered domestic data...</p>
            <a href="#" className="link-red">Read Full Report <ArrowRight size={15} strokeW={2.2} /></a>
          </article>
        </div>
        <div className="reveal rv-right">
          <h2 className="news-head"><Rocket size={22} /> IPO &amp; NFO Insights</h2>
          <article className="ncard">
            <div className="ncard-top">
              <span className="ncard-date">New Listing</span>
              <span className="pill pill-ipo">IPO</span>
            </div>
            <h3>Upcoming IPO: New tech company to list next week</h3>
            <p>The highly anticipated tech startup is set to launch its ₹1,200 Cr initial public offering on Tuesday. Price band fixed at ₹450-475...</p>
            <a href="#" className="btn btn-outline">Check Subscription Status</a>
          </article>
          <article className="ncard">
            <div className="ncard-top">
              <span className="ncard-date">Open Now</span>
              <span className="pill pill-nfo">NFO</span>
            </div>
            <h3>Latest NFO: Infrastructure growth fund now open for subscription</h3>
            <p>Invest in the backbone of India&apos;s economy with the new thematic infrastructure fund. Min investment ₹5,000...</p>
            <a href={PORTALS.mutualFund} {...EXT} className="btn btn-navy">Invest via Direct Plan</a>
          </article>
        </div>
      </div>
    </section>
  );
}
