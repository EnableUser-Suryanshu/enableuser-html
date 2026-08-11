import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import MarketTable from '@/components/markets/MarketTable';
import DataNotice, { PendingNotice } from '@/components/markets/DataNotice';
import { MARKET_DATASETS, getDataset, datasetsInGroup, groupOf } from '@/lib/markets';
import { PORTALS, EXT } from '@/lib/links';
import { ArrowRight } from '@/components/icons';

export function generateStaticParams() {
  return MARKET_DATASETS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const d = getDataset(slug);
  if (!d) return { title: 'Markets — Kalpataru Multiplier Ltd' };
  return {
    title: `${d.title} — Markets | Kalpataru Multiplier Ltd`,
    description: d.blurb,
  };
}

export default async function DatasetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dataset = getDataset(slug);
  if (!dataset) notFound();

  const group = groupOf(dataset.group);
  const siblings = datasetsInGroup(dataset.group);
  const words = dataset.title.split(' ').map((w, i) => ({ text: w, accent: i === 0 }));

  return (
    <main id="main">
      <PageHero crumb={`Markets · ${group.label}`} words={words} lead={dataset.blurb} />

      <section className="section mkt-detail watch">
        <div className="container">
          {/* Sibling switcher */}
          <nav className="mkt-switch" aria-label={`Other ${group.label} datasets`}>
            <Link href="/markets" className="mkt-switch-back">
              ← All markets
            </Link>
            <div className="mkt-switch-list">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/markets/${s.slug}`}
                  className={s.slug === dataset.slug ? 'on' : undefined}
                  aria-current={s.slug === dataset.slug ? 'page' : undefined}
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </nav>

          {dataset.pending ? (
            <PendingNotice title={dataset.title} />
          ) : (
            <>
              <MarketTable dataset={dataset} />
              <DataNotice vendor={dataset.vendor} />
            </>
          )}

          <div className="mkt-foot-cta">
            <div>
              <h3>See something worth acting on?</h3>
              <p>Place the order from our web platform, or open an account in under 5 minutes.</p>
            </div>
            <div className="row">
              <a href={PORTALS.webTrading} {...EXT} className="btn btn-navy">Start Trading</a>
              <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-outline">Open Account</a>
            </div>
          </div>

          <p className="mkt-more">
            Explore more:{' '}
            <Link href="/markets" className="link-red">
              the full market desk <ArrowRight size={14} strokeW={2.2} />
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
