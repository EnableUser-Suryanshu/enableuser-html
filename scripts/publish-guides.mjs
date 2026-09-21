/**
 * Replaces the four rewritten guides on the Downloads page.
 *
 *   node scripts/publish-guides.mjs [--dry]
 *
 * Run scripts/build-guides.mjs first — this only uploads what that produced.
 *
 * Patches the existing Sanity documents rather than creating new ones, so the
 * cards keep their place, their category and their sort order. Two of the four
 * were PPTX and become PDF, so `kind` is corrected with the file: a card
 * labelled PPTX that hands over a PDF is worse than no badge at all.
 *
 * Re-running is a no-op. Sanity stores a sha1 against every file asset, so an
 * unchanged guide is recognised and skipped rather than uploaded again — four
 * orphaned assets per run adds up. --force overrides it.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
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

function cliToken() {
  try {
    const cfg = resolve(process.env.HOME ?? '', '.config/sanity/config.json');
    return existsSync(cfg) ? JSON.parse(readFileSync(cfg, 'utf8')).authToken ?? null : null;
  } catch { return null; }
}

const JOBS = [
  { id: 'download-demo-account-opening-process-online', file: 'demo-account-opening-online.pdf',      label: 'Demo Account Opening process (Online)' },
  { id: 'download-demo-account-modification-online',    file: 'demo-account-modification-online.pdf', label: 'Demo Account Modification (Online)' },
  { id: 'download-how-to-close-account',                file: 'how-to-close-account.pdf',             label: 'How to Close Your Account' },
  { id: 'download-how-to-create-a-ticket',              file: 'how-to-create-a-ticket.pdf',           label: 'How to Raise a Ticket' },
];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN ?? cliToken();
if (!projectId) { console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set.'); process.exit(1); }
if (!token && !DRY) { console.error('No write token.'); process.exit(1); }

const client = createClient({
  projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production', token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-16', useCdn: false,
});

for (const j of JOBS) {
  const abs = resolve(ROOT, 'public/files/guides', j.file);
  if (!existsSync(abs)) {
    console.error(`  ✗ ${j.file} not built — run scripts/build-guides.mjs first`);
    process.exitCode = 1;
    continue;
  }

  const doc = await client.getDocument(j.id).catch(() => null);
  const bytes = readFileSync(abs);
  const sha = createHash('sha1').update(bytes).digest('hex');

  console.log(`\n${j.label}`);
  console.log(`  was     ${doc ? `${doc.kind ?? '—'} · ${doc.label}` : 'document not found'}`);
  console.log(`  file    ${j.file} (${Math.round(statSync(abs).size / 1024)} KB)  ${sha.slice(0, 8)}`);
  if (!doc) { process.exitCode = 1; continue; }

  // What is already published, by content rather than by filename.
  const live = doc.file?.asset?._ref
    ? await client.fetch('*[_id == $id][0].sha1hash', { id: doc.file.asset._ref }).catch(() => null)
    : null;

  if (live === sha && doc.kind === 'PDF' && doc.label === j.label && !FORCE) {
    console.log('  • unchanged — skipped');
    continue;
  }
  if (DRY) { console.log('  — dry run'); continue; }

  const asset = await client.assets.upload('file', bytes, {
    filename: basename(abs), contentType: 'application/pdf',
  });

  await client.patch(j.id).set({
    label: j.label,
    kind: 'PDF',
    source: 'upload',
    file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
  }).commit();

  console.log(`  ✓ now     PDF · ${j.label}`);
  console.log(`            ${asset.url}`);
}

console.log('\nDone.');
