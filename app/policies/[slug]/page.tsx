import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import PolicyBody from '@/components/pages/PolicyBody';
import ComplaintsData from '@/components/pages/ComplaintsData';
import { getComplaintsReport } from '@/lib/complaints';
import { getCharterTimelines, asTableRows, type CharterKey } from '@/lib/charter-timelines';
import { DEPOSITORY_CHARTER } from '@/lib/investor-charter-depository';
import { ALL_POLICIES, POLICY_GROUPS as GROUPS, getPolicyPage, policyTabs } from '@/lib/policy-index';
import type { PolicyBlock } from '@/lib/policies';
import { ArrowRight, FilePdf, Shield } from '@/components/icons';

/**
 * The two charters publish the same investor-complaints tables, and SEBI
 * requires them monthly. Those tables now come from Sanity — see
 * lib/complaints — so the copies baked into the generated policy blocks are
 * dropped here rather than edited out of policies.ts, which is generated and
 * would lose the edit.
 */
const CHARTERS = new Set(['investor-charter', 'investor-charter-depository']);

/** Everything from the "Investor Complaints Data" heading to the end. */
function trimComplaints(blocks: PolicyBlock[]): PolicyBlock[] {
  const i = blocks.findIndex(
    (b) => b.t === 'h' && /investor complaints data/i.test(b.text),
  );
  return i < 0 ? blocks : blocks.slice(0, i);
}

/**
 * Swaps the activities-and-timelines table for the live one, in the position
 * it already holds. Replacing rather than appending matters: the table sits
 * under its own heading mid-document, and moving it would leave that heading
 * with nothing under it.
 *
 * Once the complaints section is trimmed, the timelines table is the only one
 * left on either charter — hence the first match.
 */
function withLiveTimelines(
  blocks: PolicyBlock[],
  rows: ReturnType<typeof asTableRows>,
): PolicyBlock[] {
  const i = blocks.findIndex((b) => b.t === 'table');
  if (i < 0) return blocks;
  const out = blocks.slice();
  out[i] = { t: 'table', rows } as PolicyBlock;
  return out;
}

/**
 * The depository charter as SEBI publishes it — all eleven sections, including
 * the Dos and Don'ts, Rights, Responsibilities and the two Codes of Conduct
 * that the generated version was missing entirely. Generated from the
 * published page rather than retyped; see lib/investor-charter-depository.
 */
const FULL_BODY: Record<string, PolicyBlock[]> = {
  'investor-charter-depository': DEPOSITORY_CHARTER,
};

/** Which charter a slug is, for the per-charter timelines document. */
const CHARTER_KEY: Record<string, CharterKey> = {
  'investor-charter': 'broker',
  'investor-charter-depository': 'depository',
};

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
            {/* On a charter the complaints data leads, as it does on the
                published page, and the charter itself follows. */}
            {CHARTERS.has(slug) && <ComplaintsData report={await getComplaintsReport()} />}
            <PolicyBody
              blocks={
                CHARTERS.has(slug)
                  ? withLiveTimelines(
                      trimComplaints(FULL_BODY[slug] ?? policy.blocks),
                      asTableRows(await getCharterTimelines(CHARTER_KEY[slug])),
                    )
                  : policy.blocks
              }
            />

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
