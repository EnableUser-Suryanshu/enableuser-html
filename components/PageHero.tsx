import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

interface Props {
  crumb: string;
  /** Words rendered with staggered entrance; mark one with `accent`. */
  words: Array<{ text: string; accent?: boolean }>;
  lead: string;
  cta?: ReactNode;
}

/** Dark animated banner shared by inner pages, matching the home design. */
export default function PageHero({ crumb, words, lead, cta }: Props) {
  return (
    <section className="page-hero">
      <div className="glow1"></div>
      <div className="glow2"></div>
      <div className="grid-lines"></div>
      <div className="shape sh1"></div>
      <div className="shape sh2"></div>
      <div className="container">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">▸</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <h1>
          {words.map((w, i) => (
            <span key={i}>
              <span
                className={w.accent ? 'word accent' : 'word'}
                style={{ '--i': i } as CSSProperties}
              >
                {w.text}
              </span>{' '}
            </span>
          ))}
        </h1>
        <p className="lead">{lead}</p>
        {cta && <div className="hero-cta">{cta}</div>}
      </div>
    </section>
  );
}
