import { PORTALS, EXT } from '@/lib/links';
import { TrendUp, DocLines, Swap, ArrowRight, Devices, BarChart } from './icons';

export default function Ecosystem() {
  return (
    <section className="section eco watch" id="ecosystem">
      <div className="container">
        <h2 className="sec-title">Investment Ecosystem</h2>
        <p className="sec-sub">Tailored financial solutions for every trader.</p>

        <div className="eco-grid">
          <article className="card card-trade reveal rv-left">
            <div>
              <h3>Trade &amp; Invest</h3>
              <p>
                Experience multi-asset trading across Equity, Derivatives and Commodities.
              </p>
              <ul className="feature-list">
                <li><TrendUp size={17} /> Intraday Trading</li>
                <li><DocLines size={17} /> Delivery Trading</li>
                <li><Swap size={17} /> F&amp;O Segment</li>
              </ul>
              <div className="card-trade-bottom">
                <a
                  href={PORTALS.webTrading}
                  {...EXT}
                  className="link-red"
                  style={{ textDecoration: 'underline', textUnderlineOffset: 5 }}
                >
                  Start Trading <ArrowRight size={16} strokeW={2.2} />
                </a>
              </div>
            </div>
            <div className="photo">
              <img src="/assets/photo_trade.jpg" alt="Trader analysing live charts on phone and laptop" loading="lazy" />
            </div>
          </article>

          <article className="card card-mf reveal rv-right">
            {/* Stacked display heading — the card leads with the action and
                lands on the product, in brand red rather than a foreign blue. */}
            <h3 className="mf-head">
              <span>Invest in</span>
              <span className="mf-accent">Mutual Funds</span>
            </h3>
            <p>Your goals deserve better growth — start investing today.</p>
            <div className="photo">
              <img src="/assets/photo_mf.jpg" alt="Hands holding coins with a growing sapling" loading="lazy" />
            </div>
            <a href={PORTALS.mutualFund} {...EXT} className="btn btn-navy">Invest Now</a>
          </article>
        </div>

        <div className="eco-grid-2">
          <article className="card card-platform reveal rv-left">
            <span className="card-icon"><Devices size={40} strokeW={1.6} stroke="#1f2430" /></span>
            <h3>Our Platform</h3>
            <p className="lead">Lightning fast execution for active traders.</p>
            <p className="body">
              Native mobile apps and web platforms designed for speed, security, and
              stability during peak hours.
            </p>
            <div className="actions">
              <a href={PORTALS.webTrading} {...EXT} className="btn btn-navy">Explore</a>
              <a href={PORTALS.webTrading} {...EXT} className="btn btn-outline">Login</a>
            </div>
            <div className="devices photo">
              <img src="/assets/photo_devices.jpg" alt="Kalpataru platform on desktop, laptop, tablet and phones" loading="lazy" />
            </div>
          </article>

          <article className="card card-bo reveal rv-right">
            <span className="card-icon"><BarChart size={34} strokeW={1.8} /></span>
            <h3>Back Office</h3>
            <p>Complete transparency of your finances.</p>
            <div className="bo-boxes">
              <div className="bo-box">
                <div className="k">Portfolio View</div>
                <div className="v">Real-time Tracking</div>
              </div>
              <div className="bo-box">
                <div className="k">Ledger P&amp;L</div>
                <div className="v">Instant Reports</div>
              </div>
            </div>
            <div className="photo">
              <img src="/assets/photo_backoffice.jpg" alt="Financial reports and charts reviewed at a desk" loading="lazy" />
            </div>
            <a href={PORTALS.backOfficeLogin} {...EXT} className="link-red">
              Login Now <ArrowRight size={16} strokeW={2.2} />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
