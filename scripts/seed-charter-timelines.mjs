/**
 * Seeds the two Charter — Activities & Timelines documents from what is
 * currently published.
 *
 *   node scripts/seed-charter-timelines.mjs [--force]
 *
 * Reads the same JSON lib/charter-timelines falls back to, so the seed and
 * the fallback cannot disagree. Refuses to overwrite an existing document
 * without --force: once compliance has edited a timeline, that is the record.
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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-16',
  useCdn: false,
});

const seed = JSON.parse(readFileSync(resolve(ROOT, 'lib/charter-timelines-seed.json'), 'utf8'));

for (const charter of ['broker', 'depository']) {
  const id = `charterTimelines.${charter}`;
  const s = seed[charter];
  const existing = await client.getDocument(id).catch(() => null);

  if (existing && !FORCE) {
    console.log(`• ${charter}: already seeded (${existing.rows?.length ?? 0} rows) — --force to overwrite`);
    continue;
  }

  await client.createOrReplace({
    _id: id,
    _type: 'charterTimelines',
    charter,
    activityHeading: s.headings[1],
    timelineHeading: s.headings[2],
    rows: s.rows.map((r, i) => ({
      _type: 'row', _key: `r${i}`, activity: r.activity, timeline: r.timeline,
    })),
  });
  console.log(`✓ ${charter}: seeded ${s.rows.length} rows — "${s.headings[1]}"`);
}
