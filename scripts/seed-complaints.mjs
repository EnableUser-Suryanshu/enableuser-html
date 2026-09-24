/**
 * Seeds the Investor Complaints Data document from what is currently
 * published, so compliance edits real figures rather than an empty form.
 *
 *   node scripts/seed-complaints.mjs [--force]
 *
 * Runs once. The document is the live record after that, so a re-run refuses
 * to overwrite unless --force — a month's figures are not something to lose
 * to an accidental second run.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FORCE = process.argv.includes('--force');

for (const line of existsSync(resolve(ROOT, '.env.local'))
  ? readFileSync(resolve(ROOT, '.env.local'), 'utf8').split(/\r?\n/) : []) {
  const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const ID = 'complaintsReport.current';
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-16',
  useCdn: false,
});

// Same file lib/complaints falls back to, so the seed and the fallback can
// never disagree.
const seed = JSON.parse(readFileSync(resolve(ROOT, 'lib/complaints-seed.json'), 'utf8'));

const existing = await client.getDocument(ID).catch(() => null);
if (existing && !FORCE) {
  console.log(`Already seeded (${existing.monthEnding}). Pass --force to overwrite.`);
  process.exit(0);
}

const key = (p, i) => ({ _key: `${p}${i}` });
await client.createOrReplace({
  _id: ID,
  _type: 'complaintsReport',
  monthEnding: seed.monthEnding,
  updatedAt: new Date().toISOString().slice(0, 10),
  snapshot: seed.snapshot.map((r, i) => ({ _type: 'row', ...key('s', i), ...r })),
  monthlyTrend: seed.monthlyTrend.map((r, i) => ({
    _type: 'row', ...key('m', i), month: r.label,
    carriedForward: r.carriedForward, received: r.received, resolved: r.resolved, pending: r.pending,
  })),
  annualTrend: seed.annualTrend.map((r, i) => ({
    _type: 'row', ...key('a', i), year: r.label,
    carriedForward: r.carriedForward, received: r.received, resolved: r.resolved, pending: r.pending,
  })),
});

console.log(`✓ seeded ${ID} — ${seed.monthEnding}`);
console.log(`  snapshot ${seed.snapshot.length} · monthly ${seed.monthlyTrend.length} · annual ${seed.annualTrend.length}`);
