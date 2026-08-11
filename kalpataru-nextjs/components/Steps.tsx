import { PORTALS, EXT } from '@/lib/links';

const STEPS = [
  { num: '01', delay: '0s', title: 'Form Fill', body: 'Enter your basic details and select your segments.' },
  { num: '02', delay: '.8s', title: 'e-KYC', body: 'Seamless Aadhaar based verification in seconds.' },
  { num: '03', delay: '1.6s', title: 'Start Trading', body: 'Get your login credentials and start investing.' },
];

export default function Steps() {
  return (
    <section className="section steps watch" id="open-account">
      <div className="glow1"></div>
      <div className="glow2"></div>
      <div className="grid-lines"></div>
      <div className="container">
        <h2>Free Demat &amp; Trading + MF Account Opening</h2>
        <p className="sub">
          Start your journey in less than 5 minutes with our completely digital onboarding process.
        </p>
        <div className="steps-grid stagger">
          <div className="connector" aria-hidden="true"></div>
          {STEPS.map((s) => (
            <div className="step" key={s.num}>
              <div className="step-num" style={{ '--d': s.delay } as React.CSSProperties}>
                {s.num}
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="steps-cta">
          <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">
            OPEN ACCOUNT NOW
          </a>
        </div>
      </div>
    </section>
  );
}
