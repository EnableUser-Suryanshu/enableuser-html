/**
 * One-off migration: pushes the 80 downloads into Sanity.
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx \
 *   SANITY_API_WRITE_TOKEN=sk... \
 *   node scripts/migrate-downloads-to-sanity.mjs [--dry]
 *
 * Files already mirrored under public/files/download are uploaded to Sanity so
 * the content stops depending on this repo. Third-party links are stored as
 * links. Anything still pointing at the legacy host is reported rather than
 * migrated — those are the four large files that need a decision first.
 *
 * Safe to re-run: documents use a deterministic _id derived from the label, so
 * a second run updates rather than duplicates.
 */
import { readFileSync, existsSync, statSync, createReadStream } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set.');
  process.exit(1);
}
if (!token && !DRY) {
  console.error('SANITY_API_WRITE_TOKEN is not set. Create one at');
  console.error(`  https://www.sanity.io/manage/project/${projectId}/api  (Editor permissions)`);
  console.error('Or run with --dry to preview without writing.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-09-16', useCdn: false });

/** Stable, readable id so re-runs update the same document. */
const idFor = (label) =>
  'download-' +
  label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const downloads = JSON.parse(readFileSync(resolve(ROOT, 'lib/downloads.json'), 'utf8'));

const uploaded = [];
const linked = [];
const orphaned = [];

for (const [i, item] of downloads.entries()) {
  const { label, href, kind, cat } = item;

  // Hosted in this repo → upload the actual file to Sanity.
  if (href.startsWith('/files/download/')) {
    const local = resolve(ROOT, 'public' + decodeURIComponent(href));
    if (!existsSync(local)) { orphaned.push([label, 'file missing locally', href]); continue; }
    uploaded.push({ label, cat, kind, local, order: i });
    continue;
  }

  // Still on the legacy host → cannot migrate, needs a decision.
  if (href.includes('kalpatarumulti.com/files/')) {
    orphaned.push([label, 'still on the legacy server', href]);
    continue;
  }

  linked.push({ label, cat, kind: kind || 'LINK', url: href, order: i });
}

const mb = (p) => (statSync(p).size / 1048576).toFixed(1);
console.log(`to upload : ${uploaded.length} files (${uploaded.reduce((n, u) => n + statSync(u.local).size, 0) / 1048576 | 0} MB)`);
console.log(`to link   : ${linked.length}`);
console.log(`skipped   : ${orphaned.length}`);
for (const [label, why, href] of orphaned) console.log(`   ! ${why}: ${label} (${basename(href)})`);

if (DRY) { console.log('\n--dry: nothing written.'); process.exit(0); }

let done = 0;
for (const u of uploaded) {
  const asset = await client.assets.upload('file', createReadStream(u.local), {
    filename: basename(u.local),
  });
  await client.createOrReplace({
    _id: idFor(u.label),
    _type: 'download',
    label: u.label,
    category: u.cat,
    source: 'upload',
    kind: u.kind,
    order: u.order,
    file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
  });
  console.log(`  ✓ uploaded ${mb(u.local).padStart(6)} MB  ${u.label.slice(0, 48)}`);
  done++;
}

for (const l of linked) {
  await client.createOrReplace({
    _id: idFor(l.label),
    _type: 'download',
    label: l.label,
    category: l.cat,
    source: 'external',
    kind: l.kind,
    order: l.order,
    url: l.url,
  });
  console.log(`  ✓ linked    ${l.label.slice(0, 48)}`);
  done++;
}

console.log(`\n${done} documents written to ${projectId}/${dataset}.`);
console.log('Open /studio to manage them.');
