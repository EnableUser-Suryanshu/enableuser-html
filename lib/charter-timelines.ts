import 'server-only';
import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, sanityConfigured } from '@/sanity/env';
import seed from './charter-timelines-seed.json';

/**
 * The activities-and-timelines table on each Investor Charter.
 *
 * Like the complaints data, this came out of lib/policies so it can be edited
 * without a deployment. Unlike the complaints data it is per charter — the
 * broker's thirteen activities and the DP's eight are different lists with
 * different column headings.
 *
 * Returned as PolicyBlock table rows so the page can swap it straight into the
 * position it already occupies in the document, rather than appending it
 * somewhere else and leaving a hole where it used to be.
 */

export type CharterKey = 'broker' | 'depository';

export interface TimelineTable {
  headings: [string, string, string];
  rows: { sr: string; activity: string; timeline: string }[];
  live: boolean;
}

/* Same authenticated read as lib/complaints — this project grants anonymous
   read per document type, and an ungranted type returns empty rather than
   erroring. Server-only, so the token never reaches the browser. */
const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN;

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  : null;

const QUERY = `*[_type == "charterTimelines" && charter == $charter][0]{
  activityHeading, timelineHeading, rows[]{activity, timeline}
}`;

function fallback(charter: CharterKey): TimelineTable {
  const s = seed[charter];
  return { headings: s.headings as [string, string, string], rows: s.rows, live: false };
}

export async function getCharterTimelines(charter: CharterKey): Promise<TimelineTable> {
  if (!client) return fallback(charter);
  try {
    const r = await client.fetch<{
      activityHeading?: string; timelineHeading?: string;
      rows?: { activity?: string; timeline?: string }[];
    } | null>(QUERY, { charter }, { next: { revalidate: 300 } });

    if (!r?.rows?.length || !r.activityHeading || !r.timelineHeading) return fallback(charter);

    return {
      headings: [seed[charter].headings[0], r.activityHeading, r.timelineHeading],
      rows: r.rows
        .filter((x) => x.activity && x.timeline)
        .map((x, i) => ({ sr: String(i + 1), activity: x.activity!, timeline: x.timeline! })),
      live: true,
    };
  } catch {
    return fallback(charter);
  }
}

/** The table as PolicyBody expects it, so it can replace the block in place. */
export function asTableRows(t: TimelineTable) {
  return [
    t.headings.map((text) => ({ head: true, text })),
    ...t.rows.map((r) => [
      { head: false, text: r.sr },
      { head: false, text: r.activity },
      { head: false, text: r.timeline },
    ]),
  ];
}
