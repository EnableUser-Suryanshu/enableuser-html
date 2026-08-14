import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import PolicyBody from '@/components/pages/PolicyBody';
import { ALL_POLICIES, POLICY_GROUPS as GROUPS, getPolicyPage, policyTabs } from '@/lib/policy-index';
import { ArrowRight, FilePdf, Shield } from '@/components/icons';

export function generateStaticParams() {
  return ALL_POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = getPolicyPage(slug);
  if (!p) return { title: 'Policies — Kalpataru Multiplier Ltd' };
  return {
    title: `${p.title} — Kalpataru Multiplier Ltd`,
    description: p.blurb,
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = getPolicyPage(slug);
  if (!policy) notFound();

  const group = GROUPS.find((g) => g.key === policy.group)!;
  const words = policy.title.split(' ').map((w, i) => ({ text: w, accent: i === 0 }));
  const tabs = policyTabs(policy.slug);

  return (
    <main id="main">
      <PageHero crumb={`Policies · ${group.label}`} words={words} lead={policy.blurb} />

      <section className="section policy-section watch">
        <div className="container policy-grid">
          {/* deliberately not .reveal — regulatory text must never be hidden
              behind a scroll animation if the observer or JS does not run */}
          <article className="policy-doc">
            {policy.draft && (
              <p className="policy-draft" role="note">
                <strong>Pending compliance review.</strong> This page was newly drafted for the
                relaunched site — it had no published counterpart previously. The content follows
                standard practice and this firm’s own registration details, but must be reviewed
                and approved by the Compliance Officer before it is treated as final.
              </p>
            )}
            {tabs && (
              <nav className="policy-tabs" aria-label={`${policy.title.split('—')[0].trim()} sections`}>
                {tabs.map((t) => (
                  <Link
                    href={`/policies/${t.slug}`}
                    key={t.slug}
                    className={t.slug === policy.slug ? 'is-current' : undefined}
                    aria-current={t.slug === policy.slug ? 'page' : undefined}
                  >
                    {t.label}
                  </Link>
                ))}
              </nav>
            )}
            <PolicyBody blocks={policy.blocks} />

            <p className="policy-foot">
              This document is published by Kalpataru Multiplier Ltd in accordance with SEBI and
              exchange requirements. For any clarification, write to{' '}
              <a href="mailto:kmlho@kalpatarumulti.com">kmlho@kalpatarumulti.com</a> or call
              {' '}<a href="tel:07554350141">0755-4350141-143</a>.
            </p>
          </article>

          <aside className="policy-side reveal rv-right" aria-label="Other policies">
            {GROUPS.map((g) => {
              const items = ALL_POLICIES.filter((p) => p.group === g.key);
              if (!items.length) return null;
              return (
                <div className="policy-side-block" key={g.key}>
                  <h2 className="policy-side-head">{g.label}</h2>
                  <nav>
                    {items.map((p) => (
                      <Link
                        href={`/policies/${p.slug}`}
                        key={p.slug}
                        className={p.slug === policy.slug ? 'is-current' : undefined}
                        aria-current={p.slug === policy.slug ? 'page' : undefined}
                      >
                        {p.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              );
            })}

            <div className="policy-side-block">
              <h2 className="policy-side-head">Documents</h2>
              <nav>
                <Link href="/circulars"><Shield size={14} strokeW={2} /> Circulars &amp; Downloads</Link>
                <a href="/files/pdf/policies-and-procedures.pdf" target="_blank" rel="noopener noreferrer">
                  <FilePdf size={14} strokeW={2} /> Policies &amp; Procedures (PDF)
                </a>
              </nav>
            </div>

            <Link href="/customer-care" className="btn btn-navy policy-side-cta">
              Raise a query <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
