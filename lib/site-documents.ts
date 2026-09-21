import 'server-only';
import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, sanityConfigured } from '@/sanity/env';

/**
 * Resolves the documents that fixed links on the site point at.
 *
 * Same shape as lib/downloads: Sanity is the source, and a checked-in file is
 * the fallback. The fallback matters more here than convenience — these are
 * links in the footer of a SEBI-registered broker's site, and a link that
 * renders as nothing because a CMS was briefly unreachable is worse than one
 * serving a slightly older copy of the same document.
 */

/**
 * This read is authenticated, unlike the one in lib/downloads.
 *
 * The dataset's ACL is public, but the project grants anonymous read per
 * document type, and only `download` and `sanity.fileAsset` are granted. A new
 * type is invisible to an unauthenticated query — it comes back empty rather
 * than erroring, which is exactly the failure that silently serves a stale
 * fallback. So this asks with the token instead.
 *
 * Safe because the module is server-only: the token never reaches the browser.
 * The tidier fix is a read-only token, or granting anonymous read on
 * `siteDocument` in the project's API settings — either is the client's call,
 * not something to change on their behalf.
 */
const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN;

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  : null;

/**
 * Where each document lived before Sanity, and what is served if Sanity has
 * no entry for the key yet. These files stay in the repo for exactly that.
 */
const FALLBACKS: Record<string, string> = {
  'investor-complaint-process': '/files/pdf/investor-client-complaint-resolution-process.pdf',
};

const QUERY = `*[_type == "siteDocument" && key == $key][0]{ "url": file.asset->url }`;

/** Returns the Sanity URL for a key, or the bundled copy if there is none. */
export async function siteDocumentUrl(key: keyof typeof FALLBACKS | string): Promise<string> {
  const fallback = FALLBACKS[key] ?? '';
  if (!client) return fallback;

  try {
    const row = await client.fetch<{ url: string | null } | null>(
      QUERY,
      { key },
      { next: { revalidate: 300 } },
    );
    return row?.url ?? fallback;
  } catch {
    return fallback;
  }
}
