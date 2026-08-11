import CountUp from './CountUp';
import { Shield, Bank, History, Users } from './icons';

export default function Stats() {
  return (
    <section className="section stats watch" aria-label="Trust and membership">
      <div className="container stats-grid stagger">
        <div className="stat">
          <div className="stat-icon"><Shield size={26} /></div>
          <div className="v">SEBI</div>
          <div className="l">Registered Broker</div>
        </div>
        <div className="stat">
          <div className="stat-icon"><Bank size={26} /></div>
          <div className="v">Member Of</div>
          <div className="l">NSE / BSE / MCX / CDSL</div>
        </div>
        <div className="stat">
          <div className="stat-icon"><History size={26} /></div>
          <div className="v"><CountUp target={34} suffix="+" /></div>
          <div className="l">Years of Experience</div>
        </div>
        <div className="stat">
          <div className="stat-icon"><Users size={26} /></div>
          <div className="v"><CountUp target={35} suffix="K+" /></div>
          <div className="l">Happy Clients</div>
        </div>
      </div>
    </section>
  );
}
