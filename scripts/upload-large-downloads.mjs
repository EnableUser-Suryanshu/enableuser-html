/**
 * Uploads the four large downloads that the main migration skipped.
 *
 * They are 723 MB in total and still live only on the legacy IIS server, which
 * the domain no longer points at. They cannot go in the repo (Vercel would
 * refuse the deployment), so they go to Sanity's asset CDN like everything
 * else on the Downloads page.
 *
 *   node scripts/upload-large-downloads.mjs [--dry]
 *
 * Handled one at a time — fetch, upload, write the document, delete the temp
 * file — so peak disk use is one file rather than all four. Ordered smallest
 * first, so an asset-size limit shows up after 71 MB instead of after 500 MB.
 *
 * Re-runnable: document ids are deterministic, and a file already present in
 * Sanity is skipped unless --force is passed.
 */
import { readFileSync, existsSync, createReadStream, createWriteStream, unlinkSync, statSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createClient } from '@sanity/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');
const FORCE = process.argv.includes('--force');
const TMP = resolve(ROOT, '.tmp-large-downloads');

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

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN ?? cliToken();
if (!projectId || (!token && !DRY)) {
  console.error('Missing project id or credential. Run `npx sanity login` first.');
  process.exit(1);
}

// Half-gigabyte uploads exceed the client's default request timeout — the
// video failed with HTTP 408 at the default. 30 minutes is generous enough for
// a slow uplink without hanging indefinitely.
const client = createClient({
  projectId, dataset, token, apiVersion: '2026-09-16', useCdn: false,
  timeout: 30 * 60 * 1000,
  maxRetries: 3,
});

const LEGACY_IP = '15.207.187.185';
const idFor = (label) =>
  'download-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

/** The four entries still pointing at the legacy host. */
const downloads = JSON.parse(readFileSync(resolve(ROOT, 'lib/downloads.json'), 'utf8'));
const targets = downloads
  .map((d, i) => ({ ...d, order: i }))
  .filter((d) => d.href.includes('kalpatarumulti.com/files/'));

if (!targets.length) { console.log('Nothing left on the legacy host.'); process.exit(0); }

/** The legacy box only serves these under the www Host header. */
function fetchLegacy(path, dest) {
  return new Promise((ok, fail) => {
    const url = 'https://www.kalpatarumulti.com' + encodeURI(path);
    const p = spawn('/usr/bin/curl', [
      '-sgL', '--max-time', '900',
      '--resolve', `www.kalpatarumulti.com:443:${LEGACY_IP}`,
      '-o', dest, '-w', '%{http_code}', url,
    ]);
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.on('close', () => (out.trim() === '200' ? ok() : fail(new Error(`HTTP ${out.trim()}`))));
  });
}

const mb = (n) => (n / 1048576).toFixed(1);

/** Content-Length from the legacy box, so the run can go smallest-first. */
function headLegacy(path) {
  return new Promise((ok) => {
    const url = 'https://www.kalpatarumulti.com' + encodeURI(path);
    const p = spawn('/usr/bin/curl', [
      '-sIg', '--max-time', '40', '--resolve', `www.kalpatarumulti.com:443:${LEGACY_IP}`, url,
    ]);
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.on('close', () => {
      const m = /content-length:\s*(\d+)/i.exec(out);
      ok(m ? Number(m[1]) : 0);
    });
  });
}

const sized = [];
for (const t of targets) {
  const path = new URL(t.href).pathname;
  sized.push({ ...t, path, name: decodeURIComponent(basename(path)), size: await headLegacy(path) });
}
// Smallest first, so an asset-size limit surfaces after 71 MB not after 500 MB.
sized.sort((a, b) => a.size - b.size);

mkdirSync(TMP, { recursive: true });

console.log(`${sized.length} files to move off the legacy server\n`);
let moved = 0;

for (const t of sized) {
  const existing = await client.fetch('*[_id == $id][0]{_id, source, "asset": file.asset->_id}', { id: idFor(t.label) });
  if (existing?.asset && !FORCE) {
    console.log(`  – already in Sanity, skipping: ${t.label}`);
    continue;
  }

  if (DRY) { console.log(`  would move: ${t.label}  (${t.name})`); continue; }

  const dest = resolve(TMP, t.name);
  process.stdout.write(`  ↓ ${t.label.slice(0, 34).padEnd(34)} `);
  if (existsSync(dest) && statSync(dest).size === t.size) {
    process.stdout.write('(cached) ');
  } else {
    try {
      await fetchLegacy(t.path, dest);
    } catch (e) {
      console.log(`download failed (${e.message})`);
      continue;
    }
  }
  const size = statSync(dest).size;
  process.stdout.write(`${mb(size).padStart(7)} MB → uploading… `);

  try {
    const asset = await client.assets.upload('file', createReadStream(dest), { filename: t.name });
    await client.createOrReplace({
      _id: idFor(t.label),
      _type: 'download',
      label: t.label,
      category: t.cat,
      source: 'upload',
      kind: t.kind,
      order: t.order,
      file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
    });
    console.log('done');
    moved++;
    // Keep peak disk to a single file — but only discard on success, so a
    // retry after a timeout does not re-download half a gigabyte.
    try { unlinkSync(dest); } catch {}
  } catch (e) {
    console.log(`upload failed: ${e.message}`);
    console.log(`    kept ${dest} for the retry`);
  }
}

console.log(`\n${moved} file(s) now served from Sanity.`);
if (moved) console.log('Remove them from lib/downloads.json once verified — Sanity is the source now.');
