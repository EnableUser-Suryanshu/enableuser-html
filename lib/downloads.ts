import 'server-only';
import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, sanityConfigured } from '@/sanity/env';
import fallback from './downloads.json';

export interface DownloadItem {
  label: string;
  href: string;
  kind: string;
  cat: string;
  /** True when the link leaves this site — the vendor pages, mainly. */
  external?: boolean;
}

/**
 * Downloads come from Sanity once a project is configured, and from the
 * checked-in JSON until then.
 *
 * The fallback is not just for first-run convenience. If Sanity is unreachable
 * mid-session the Downloads page still renders its 80 items rather than going
 * blank — on a SEBI-registered broker's site the forms need to be there.
 */

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

const QUERY = `*[_type == "download"]|order(category asc, order asc, label asc){
  label,
  "cat": category,
  kind,
  source,
  url,
  "fileUrl": file.asset->url,
  "ext": file.asset->extension
}`;

/** Falls back to the file extension when no badge was set in the studio. */
function badge(kind: string | null, ext: string | null, external: boolean) {
  if (kind) return kind.toUpperCase();
  if (external) return 'LINK';
  return (ext ?? 'FILE').toUpperCase();
}

export async function getDownloads(): Promise<DownloadItem[]> {
  if (!client) return fallback as DownloadItem[];

  try {
    const rows = await client.fetch<
      Array<{
        label: string; cat: string; kind: string | null;
        source: string; url: string | null; fileUrl: string | null; ext: string | null;
      }>
    >(QUERY, {}, { next: { revalidate: 300 } });

    const items = rows
      .map((r) => {
        const external = r.source === 'external';
        const href = external ? r.url : r.fileUrl;
        if (!href) return null; // incomplete entry — the studio flags these with ⚠
        return { label: r.label, href, kind: badge(r.kind, r.ext, external), cat: r.cat, external };
      })
      .filter(Boolean) as DownloadItem[];

    // An empty result usually means the content has not been migrated yet, not
    // that there are genuinely no downloads. Keep serving the known-good list.
    return items.length ? items : (fallback as DownloadItem[]);
  } catch {
    return fallback as DownloadItem[];
  }
}
