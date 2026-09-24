/**
 * Publishes the standalone documents that fixed links on the site point at.
 *
 *   node scripts/upload-site-documents.mjs [--dry] [--force]
 *
 * Right now that is one file: the Investor / Client Complaint Process, linked
 * from the footer. It was served straight out of public/, which meant a new
 * version of a regulatory document needed a code change and a deployment.
 * From Sanity, compliance replaces the file in the studio and the link
 * follows.
 *
 * The copy in public/ stays where it is on purpose — lib/site-documents falls
 * back to it if Sanity is unreachable.
 *
 * Re-runnable: document ids are derived from the key, so a second run updates
 * rather than duplicates. An existing document keeps its file unless --force.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');
const FORCE = process.argv.includes('--force');

function loadEnvLocal() {
  const f = resolve(ROOT, '.env.local');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnvLocal();

/** The Sanity CLI's own login, so this works without pasting a token. */
function cliToken() {
  try {
    const cfg = resolve(process.env.HOME ?? '', '.config/sanity/config.json');
    return existsSync(cfg) ? JSON.parse(readFileSync(cfg, 'utf8')).authToken ?? null : null;
  } catch { return null; }
}

const DOCS = [
  {
    key: 'investor-complaint-process',
    title: 'Investor / Client Complaint Process',
    file: 'public/files/pdf/investor-client-complaint-resolution-process.pdf',
    note: 'Published from the repo copy on 21-Sep-2026.',
  },
];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN ?? cliToken();

if (!projectId) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set — nothing to publish to.');
  process.exit(1);
}
if (!token && !DRY) {
  console.error('No write token. Set SANITY_API_WRITE_TOKEN or run `npx sanity login`.');
  process.exit(1);
}

const client = createClient({
  projectId, dataset, token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-16',
  useCdn: false,
});

const kb = (n) => `${Math.round(n / 1024)} KB`;

for (const d of DOCS) {
  const abs = resolve(ROOT, d.file);
  const id = `siteDocument.${d.key}`;

  if (!existsSync(abs)) {
    console.error(`  ✗ ${d.key}: ${d.file} not found`);
    process.exitCode = 1;
    continue;
  }

  const size = statSync(abs).size;
  console.log(`\n${d.title}`);
  console.log(`  source  ${d.file} (${kb(size)})`);
  console.log(`  doc id  ${id}`);

  if (DRY) { console.log('  — dry run, nothing written'); continue; }

  const existing = await client.getDocument(id).catch(() => null);
  if (existing?.file?.asset?._ref && !FORCE) {
    console.log('  • already published — pass --force to replace the file');
    continue;
  }

  const asset = await client.assets.upload('file', readFileSync(abs), {
    filename: basename(abs),
    contentType: 'application/pdf',
  });
  console.log(`  ↑ uploaded ${asset._id}`);

  await client.createOrReplace({
    _id: id,
    _type: 'siteDocument',
    key: d.key,
    title: d.title,
    note: d.note,
    file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
  });
  console.log(`  ✓ published → ${asset.url}`);
}

console.log('\nDone.');
