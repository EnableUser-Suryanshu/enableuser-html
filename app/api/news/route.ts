/**
 * Live market news — headlines only, each linking back to its publisher.
 *
 * Cached for five minutes at the edge: the financial press does not publish
 * faster than that, and it keeps a busy page from hammering four RSS endpoints.
 */
import { NextResponse } from 'next/server';
import { fetchNews } from '@/scripts/vendors/news.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

export async function GET(req: Request) {
  const limit = Math.min(
    40,
    Math.max(4, Number(new URL(req.url).searchParams.get('limit')) || 12),
  );

  try {
    const news = await fetchNews({ limit });
    if (!news.items.length) {
      return NextResponse.json(
        { items: [], publishers: [], error: 'no feeds reachable' },
        { status: 200, headers: { 'Cache-Control': 'public, s-maxage=60' } },
      );
    }
    return NextResponse.json(news, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' },
    });
  } catch (e) {
    return NextResponse.json(
      { items: [], publishers: [], error: (e as Error).message },
      { status: 502, headers: { 'Cache-Control': 'public, s-maxage=60' } },
    );
  }
}
