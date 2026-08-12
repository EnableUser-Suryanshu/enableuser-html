import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { CIRCULAR_GROUPS, ALL_CIRCULARS } from '@/lib/circulars';
import { ALL_POLICIES } from '@/lib/policy-index';
import { REGULATOR_LINKS, EXT } from '@/lib/links';
import { FilePdf, Download, ArrowRight } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Circulars & Downloads — Kalpataru Multiplier Ltd',
  description:
    'SEBI and depository circulars, our published policies and procedures, and investor complaint documents — all available to download.',
};

export default function CircularsPage() {
  return (
    <main id="main">
      <PageHero
        crumb="Circulars"
        words={[{ text: 'Circulars', accent: true }, { text: '&' }, { text: 'Downloads' }]}
        lead={`Every circular and policy document we publish, in one place — ${ALL_CIRCULARS.length} documents available to download.`}
      />

      <section className="section circ-section watch">
        <div className="container">
          {CIRCULAR_GROUPS.map((g) => (
            <div className="circ-group" key={g.key}>
              <div className="circ-group-head">
                <h2>{g.label}</h2>
                <p>{g.blurb}</p>
              </div>
              <div className="circ-grid stagger">
                {g.docs.map((d) => (
                  <a
                    className="circ-card"
                    href={d.file}
                    key={d.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="circ-icon"><FilePdf size={22} /></span>
                    <span className="circ-body">
                      <span className="circ-title">{d.title}</span>
                      <span className="circ-note">{d.note}</span>
                      <span className="circ-meta">
                        <span className="circ-src">{d.source}</span>
                        <span className="circ-size">PDF · {d.kb} KB</span>
                      </span>
                    </span>
                    <span className="circ-dl" aria-hidden="true"><Download size={18} /></span>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="circ-links">
            <h2>Policies published on this site</h2>
            <p>
              These documents are published as web pages rather than downloads — open any of them
              to read the full text.
            </p>
            <div className="circ-chips">
              {ALL_POLICIES.map((p) => (
                <Link href={`/policies/${p.slug}`} key={p.slug} className="circ-chip">
                  {p.title} <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>

          <div className="circ-links">
            <h2>Lodge a complaint with a regulator</h2>
            <p>
              If a grievance is not resolved to your satisfaction, you may escalate it through the
              official channels below.
            </p>
            <div className="circ-chips">
              <a href={REGULATOR_LINKS.smartOdr} {...EXT} className="circ-chip">
                SMART ODR Portal <ArrowRight size={13} />
              </a>
              <a href={REGULATOR_LINKS.sebiScores} {...EXT} className="circ-chip">
                SEBI SCORES <ArrowRight size={13} />
              </a>
              <a href={REGULATOR_LINKS.exchangeGrievance} {...EXT} className="circ-chip">
                NSE Investor Helpline <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
