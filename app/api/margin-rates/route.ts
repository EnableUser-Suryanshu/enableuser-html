/**
 * Cash-market margin rates for the margin calculator.
 *
 * Sourced from NSE Clearing's daily VaR file — see scripts/vendors/nse-margin.mjs.
 * Keys are shortened because this is a ~4,800-row payload: `s`ymbol, `a`pplicable
 * margin rate, `v`ar, `e`lm, a`d`hoc, `c`lose.
 *
 * NSE posts numbered revisions of the file through the session, so this is
 * cached for fifteen minutes rather than the full day.
 */
import { NextResponse } from 'next/server';
import { fetchMarginRatesWithPrices } from '@/scripts/vendors/nse-margin.mjs';
import { sessions } from '@/scripts/vendors/nse-delivery.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

interface Rate {
  symbol: string;
  series: string;
  varMargin: number;
  elm: number;
  adhoc: number;
  applicable: number;
  close?: number;
}

export async function GET() {
  try {
    const data = (await fetchMarginRatesWithPrices(sessions)) as {
      asOf: string;
      revision: number;
      priceStamp: string | null;
      rates: Rate[];
    } | null;

    if (!data) {
      return NextResponse.json(
        { error: 'NSE margin file unavailable', rates: [] },
        { status: 502, headers: { 'Cache-Control': 'public, s-maxage=60' } },
      );
    }

    return NextResponse.json(
      {
        asOf: data.asOf,
        revision: data.revision,
        priceStamp: data.priceStamp,
        count: data.rates.length,
        rates: data.rates.map((r) => ({
          s: r.symbol,
          x: r.series,
          a: r.applicable,
          v: r.varMargin,
          e: r.elm,
          d: r.adhoc,
          ...(r.close ? { c: r.close } : {}),
        })),
      },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } },
    );
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message, rates: [] },
      { status: 502, headers: { 'Cache-Control': 'public, s-maxage=60' } },
    );
  }
}
