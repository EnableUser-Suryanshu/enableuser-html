import { Handshake, CalendarCheck, IdCard, Building, TrendUp, Headset, FileText } from './icons';

const WHY = [
  { icon: TrendUp, title: 'Extra Income Opportunity', body: 'Competitive revenue sharing models designed for growth.' },
  { icon: Headset, title: 'Dedicated RM Support', body: '24/7 support for your business and clients.' },
  { icon: FileText, title: 'Full Compliance Handling', body: 'We manage the regulations while you focus on sales.' },
];

export default function Partner() {
  return (
    <section className="section partner watch" id="partner">
      <div className="container partner-grid">
        <div className="reveal rv-left">
          <h2>Grow with Us: Become a Partner</h2>
          <p className="desc">
            Looking to build a career in finance? Partner with Kalpataru Multiplier and tap
            into our institutional grade infrastructure and decades of experience.
          </p>
          <div className="partner-cards stagger">
            <div className="pcard"><Handshake strokeW={1.8} /> Sub Broker</div>
            <div className="pcard"><CalendarCheck strokeW={1.8} /> ARN Holder</div>
            <div className="pcard"><IdCard strokeW={1.8} /> Partner Model</div>
            <div className="pcard"><Building strokeW={1.8} /> Branch Support</div>
          </div>
          <a href="#" className="btn btn-red">Join Now (Register API/ARN)</a>
        </div>
        <aside className="why-card reveal rv-right">
          <h3>Why Partner with Us?</h3>
          {WHY.map((w) => (
            <div className="why-item" key={w.title}>
              <w.icon size={22} />
              <div>
                <div className="t">{w.title}</div>
                <div className="d">{w.body}</div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
