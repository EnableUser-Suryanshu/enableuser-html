/**
 * Live data for one market table.
 *
 * The pages ship a deploy-time snapshot so first paint is instant, then swap in
 * whatever this route returns. Only the group that owns the requested slug is
 * fetched, so asking for "gainers-and-losers" never drags in six bhavcopy CSVs
 * or AMFI's 1.6 MB scheme file.
 *
 * Each group carries its own TTL, set by how fast the upstream genuinely moves
 * — index levels tick through the session, delivery figures publish once a day.
 * The CDN serves the cached copy and revalidates behind the request, so a burst
 * of visitors produces one upstream call, not hundreds.
 */
import { NextResponse } from 'next/server';
// Plain ESM, shared verbatim with scripts/fetch-market-data.mjs so the live
// feed and the deploy-time snapshot can never diverge.
import { buildOneGroup, groupFor, marketStatus, createNse } from '@/scripts/market-sources.mjs';
// Licensed NSE/BSE/MCX feed. Serves mcx-commodities, bse-indices and
// currency-quotes when credentials are present; silently absent otherwise.
import * as truedata from '@/scripts/vendors/truedata.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
/** The delivery group pulls six ~370 KB CSVs; give it room. */
export const maxDuration = 60;

interface Dataset {
  slug: string;
  rows: Array<Record<string, string | number>>;
  columns: Array<{ key: string; label: string; type: string }>;
  [k: string]: unknown;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const group = groupFor(slug);

  if (!group) {
    return NextResponse.json(
      { error: 'unknown dataset', slug },
      { status: 404, headers: { 'Cache-Control': 'public, s-maxage=3600' } },
    );
  }

  try {
    const nse = group.needsNse ? createNse() : undefined;
    // Market status rides along so the page's Open/Closed pill and timestamp
    // stay in step with the rows themselves.
    const [sets, status] = await Promise.all([
      buildOneGroup(group.id, { nse, fast: true }),
      group.needsNse ? marketStatus(nse) : Promise.resolve(null),
    ]);

    let dataset = (sets as Dataset[]).find((d) => d.slug === slug) ?? null;

    // The licensed feed wins where it serves the slug — it is the only source
    // that can give MCX in rupees. A vendor failure leaves the public-source
    // dataset untouched rather than breaking the response.
    if (truedata.isConfigured() && truedata.SERVES.includes(slug)) {
      try {
        const vendorSet = await truedata.buildDataset(slug);
        if (vendorSet) dataset = vendorSet as Dataset;
      } catch {
        /* fall through to whatever the public sources produced */
      }
    }

    if (!dataset) {
      // Source reachable but this table had nothing — say so rather than 500,
      // and cache it briefly so a quiet table is not re-fetched every hit.
      return NextResponse.json(
        { slug, dataset: null, status, fetchedAt: new Date().toISOString() },
        { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } },
      );
    }

    return NextResponse.json(
      { slug, dataset, status, ttl: group.ttl, fetchedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${group.ttl}, stale-while-revalidate=${group.ttl * 4}`,
        },
      },
    );
  } catch (e) {
    // The client keeps showing the snapshot when this fails, so a short cache
    // here just prevents a hammering retry loop.
    return NextResponse.json(
      { slug, dataset: null, error: (e as Error).message },
      { status: 502, headers: { 'Cache-Control': 'public, s-maxage=30' } },
    );
  }
}
