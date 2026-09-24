import 'server-only';
import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, sanityConfigured } from '@/sanity/env';

/**
 * Investor-complaints data for the two Investor Charters.
 *
 * SEBI requires these figures to be republished every month. They used to sit
 * in lib/policies, which is generated from the previous site, so updating them
 * meant a code change and a deployment every month — and the same tables were
 * duplicated across both charters, which is two chances to leave a stale one
 * behind. They now come from a single Sanity document that compliance edits
 * directly.
 *
 * The constant below is what was published for July 2026. It is the fallback
 * if Sanity is unreachable: last month's figures are wrong by a month, but a
 * charter page that renders no complaints table at all is a missing
 * disclosure, which is worse.
 */

export interface SnapshotRow {
  source: string;
  carriedForward: string; received: string; totalPending: string; resolved: string;
  pendingUnder3: string; pendingOver3: string; avgResolutionDays: string;
}
export interface TrendRow {
  label: string;
  carriedForward: string; received: string; resolved: string; pending: string;
}
export interface ComplaintsReport {
  monthEnding: string;
  snapshot: SnapshotRow[];
  monthlyTrend: TrendRow[];
  annualTrend: TrendRow[];
  updatedAt: string | null;
  /** True when the figures came from Sanity rather than the bundled copy. */
  live: boolean;
}

import seed from './complaints-seed.json';

const FALLBACK: ComplaintsReport = {
  monthEnding: seed.monthEnding,
  snapshot: seed.snapshot,
  monthlyTrend: seed.monthlyTrend,
  annualTrend: seed.annualTrend,
  updatedAt: null,
  live: false,
};

/* Same reason as lib/site-documents: this project grants anonymous read per
   document type, and a type it has not been granted returns an empty result
   rather than an error — which would silently serve the fallback for ever.
   Server-only module, so the token never reaches the browser. */
const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN;

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  : null;

const QUERY = `*[_type == "complaintsReport"][0]{
  monthEnding, updatedAt,
  snapshot[]{source,carriedForward,received,totalPending,resolved,pendingUnder3,pendingOver3,avgResolutionDays},
  monthlyTrend[]{month,carriedForward,received,resolved,pending},
  annualTrend[]{year,carriedForward,received,resolved,pending}
}`;

const cell = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : '—');

export async function getComplaintsReport(): Promise<ComplaintsReport> {
  if (!client) return FALLBACK;
  try {
    const r = await client.fetch<{
      monthEnding?: string; updatedAt?: string;
      snapshot?: Record<string, string>[];
      monthlyTrend?: Record<string, string>[];
      annualTrend?: Record<string, string>[];
    } | null>(QUERY, {}, { next: { revalidate: 300 } });

    if (!r?.monthEnding || !r.snapshot?.length) return FALLBACK;

    return {
      monthEnding: r.monthEnding,
      updatedAt: r.updatedAt ?? null,
      live: true,
      snapshot: r.snapshot.map((x) => ({
        source: cell(x.source),
        carriedForward: cell(x.carriedForward), received: cell(x.received),
        totalPending: cell(x.totalPending), resolved: cell(x.resolved),
        pendingUnder3: cell(x.pendingUnder3), pendingOver3: cell(x.pendingOver3),
        avgResolutionDays: cell(x.avgResolutionDays),
      })),
      monthlyTrend: (r.monthlyTrend ?? []).map((x) => ({
        label: cell(x.month), carriedForward: cell(x.carriedForward),
        received: cell(x.received), resolved: cell(x.resolved), pending: cell(x.pending),
      })),
      annualTrend: (r.annualTrend ?? []).map((x) => ({
        label: cell(x.year), carriedForward: cell(x.carriedForward),
        received: cell(x.received), resolved: cell(x.resolved), pending: cell(x.pending),
      })),
    };
  } catch {
    return FALLBACK;
  }
}

/** The seed for the Sanity document — see scripts/seed-complaints.mjs. */
export const COMPLAINTS_SEED = FALLBACK;
