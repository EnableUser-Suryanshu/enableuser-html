/**
 * Writes lib/markets/snapshot.json — the fallback the Markets section renders
 * on first paint, before live data arrives.
 *
 * All the actual fetching lives in scripts/market-sources.mjs, which the live
 * API route (app/api/markets/[slug]) also uses, so the snapshot and the live
 * feed can never drift apart in shape or logic. This script just runs every
 * group once at deploy time and persists the result.
 *
 * Datasets that fail on a given run are carried over from the previous
 * snapshot and clearly labelled, or left empty — never fabricated.
 *
 *   node scripts/fetch-market-data.mjs
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as truedata from './vendors/truedata.mjs';
import { buildAll } from './market-sources.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../lib/markets/snapshot.json');

/** Tables that render an honest empty state when their source yields nothing. */
const PENDING = [
  ['world-indices', 'World Indices', 'institutional', 'Global benchmark levels and overnight moves.'],
  ['adr-prices', 'ADR Prices', 'institutional', 'Indian companies trading as depositary receipts in the US.'],
  ['mcx-commodities', 'Commodity Benchmarks', 'commodity', 'International bullion, energy and base-metal futures.'],
  ['highest-lowest-delivery', 'Highest & Lowest Delivery', 'equity', 'Delivery-to-traded ratio by security.'],
  ['delivery-shockers', 'Delivery Shockers', 'equity', 'Unusual jumps in delivery volumes.'],
  ['five-days-up-and-down', '5 Days Up & Down', 'equity', 'Five-session performance leaders and laggards.'],
  ['rising-vdp', 'Rising Volume, Delivery & Price', 'equity', 'Three sessions of rising volume, delivery and price.'],
  ['rising-vd-falling-price', 'Rising VD, Fall in Price', 'equity', 'Rising volume and delivery against a falling price.'],
  ['book-closure', 'Book Closure', 'corporate', 'Registers closing for dividends and entitlements.'],
  ['change-of-name', 'Change of Name', 'corporate', 'Listed companies that have renamed themselves.'],
  ['delisted-companies', 'Delisted Companies', 'corporate', 'Securities removed from exchange trading platforms.'],
  ['exchange-announcements', 'BSE & NSE Announcements', 'corporate', 'Filings and disclosures made to the exchanges.'],
  ['fund-profile', 'Fund House Profile', 'mutual-fund', 'AMC-wise scheme counts across the AMFI universe.'],
  ['currency-quotes', 'Currency Rates', 'currency', 'Rupee exchange rates against major currencies.'],
];

async function main() {
  console.log('Building market snapshot (all groups in parallel)…');
  const { sets, status } = await buildAll({ log: (m) => console.log(m) });

  /* ---- Licensed vendor feed (TrueData: NSE/BSE/MCX) ---- */
  let vendorName = null;
  if (truedata.isConfigured()) {
    console.log('\nLicensed feed: TrueData credentials found — connecting…');
    try {
      await truedata.authenticate();
      for (const v of await truedata.buildDatasets()) {
        const i = sets.findIndex((s) => s.slug === v.slug);
        if (i >= 0) sets[i] = v;
        else sets.push(v);
      }
      vendorName = 'TrueData (NSE / BSE / MCX licensed feed)';
    } catch (e) {
      console.warn(`  ! TrueData unavailable — continuing on public data.\n    ${e.message}`);
    }
  }

  /* ---- Carry over or mark pending ---- */
  let previous = null;
  try {
    if (existsSync(OUT)) previous = JSON.parse(readFileSync(OUT, 'utf8'));
  } catch { /* unreadable previous snapshot */ }

  let carried = 0;
  for (const [slug, title, group, blurb] of PENDING) {
    if (sets.some((s) => s.slug === slug)) continue;
    const old = previous?.datasets?.find((d) => d.slug === slug && !d.pending && d.rows?.length);
    if (old) {
      const when = previous.marketTimestamp || new Date(previous.fetchedAt).toDateString();
      sets.push({
        ...old,
        note: `This table could not be refreshed on the latest build. Figures are as last retrieved on ${when}.`,
        stale: true,
      });
      carried++;
      continue;
    }
    sets.push({ slug, title, group, blurb, pending: true, columns: [], rows: [] });
  }
  if (carried) console.log(`\n  ↺ ${carried} dataset(s) carried over from the previous snapshot`);

  const live = sets.filter((s) => !s.pending).length;
  const snapshot = {
    fetchedAt: new Date().toISOString(),
    marketTimestamp: status.marketTimestamp,
    marketStatus: status.marketStatus,
    source: [
      'NSE India (nseindia.com public market data)',
      'NSE full bhavcopy (delivery data)',
      'NSE & BSE corporate filings, AMFI scheme data',
      'CNBC market data',
      'ECB reference rates',
      ...(vendorName ? [vendorName] : []),
    ].join(' · '),
    vendor: vendorName,
    datasets: sets,
  };

  if (live < 5) {
    if (existsSync(OUT)) {
      console.warn(`\n!! Only ${live} live datasets fetched — keeping the previous snapshot.`);
      return;
    }
    throw new Error('Market data fetch failed and no previous snapshot exists.');
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(snapshot, null, 1));
  console.log(`\n✓ ${live} live datasets, ${sets.length - live} awaiting feed`);
  console.log(`  market: ${snapshot.marketStatus} | stamp: ${snapshot.marketTimestamp}`);
  console.log(`  rows: ${sets.reduce((n, s) => n + s.rows.length, 0)} -> ${OUT}`);
}

main().catch((e) => {
  console.error('Market fetch error:', e.message);
  if (!existsSync(OUT)) process.exit(1);
  console.warn('Keeping previous snapshot.');
});
