/**
 * Live market news.
 *
 * Aggregates the RSS feeds of the mainstream Indian financial press. Several
 * publishers are polled in parallel so one being slow or down never empties the
 * section, and headlines are de-duplicated because the same wire story is often
 * carried by more than one of them.
 *
 * Only the headline, publisher, timestamp and link are kept — never the article
 * body. Each item links back to the publisher, which is what their feeds are
 * published for; reproducing the copy would not be ours to do.
 *
 * Moneycontrol is deliberately absent: its RSS endpoints still respond 200 but
 * have not been updated since April 2024.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

/** [publisher, feed URL, section label] */
const FEEDS = [
  ['The Economic Times', 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', 'Markets'],
  ['Business Standard', 'https://www.business-standard.com/rss/markets-106.rss', 'Markets'],
  ['Mint', 'https://www.livemint.com/rss/markets', 'Markets'],
  ['The Hindu BusinessLine', 'https://www.thehindubusinessline.com/markets/feeder/default.rss', 'Markets'],
];

const decode = (s) =>
  String(s ?? '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, ' ')
    .trim();

const tag = (block, name) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i').exec(block);
  return m ? decode(m[1]) : '';
};

/** Strips the tracking and campaign junk publishers append to feed links. */
function cleanUrl(raw) {
  try {
    const u = new URL(raw);
    for (const k of [...u.searchParams.keys()]) {
      if (/^(utm_|from$|source$|cid$|ncid$)/i.test(k)) u.searchParams.delete(k);
    }
    return u.toString();
  } catch {
    return raw;
  }
}

/** Normalises a headline for duplicate detection across publishers. */
const key = (title) =>
  title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).slice(0, 9).join(' ');

async function readFeed(publisher, url, section) {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return [];
    const xml = await r.text();

    const items = [];
    // Feeds are RSS <item> or Atom <entry>; both are handled.
    const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? [];
    for (const b of blocks) {
      const title = tag(b, 'title');
      if (!title) continue;

      let link = tag(b, 'link');
      if (!link) {
        const href = /<link[^>]*href="([^"]+)"/i.exec(b);
        link = href ? href[1] : '';
      }
      if (!/^https?:\/\//i.test(link)) continue;

      const when = tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || '';
      const ts = Date.parse(when);

      items.push({
        title,
        url: cleanUrl(link),
        publisher,
        section,
        publishedAt: Number.isFinite(ts) ? new Date(ts).toISOString() : null,
        ts: Number.isFinite(ts) ? ts : 0,
      });
    }
    return items;
  } catch {
    return [];
  }
}

/**
 * @param {{limit?: number}} opts
 * @returns {Promise<{items: Array<object>, publishers: string[], fetchedAt: string}>}
 */
export async function fetchNews({ limit = 24 } = {}) {
  const batches = await Promise.all(FEEDS.map(([p, u, s]) => readFeed(p, u, s)));

  const seen = new Set();
  const items = [];
  for (const item of batches.flat()) {
    const k = key(item.title);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    items.push(item);
  }

  // Newest first. Items without a parseable date sink to the bottom rather than
  // claiming to be the freshest thing on the page.
  items.sort((a, b) => b.ts - a.ts);

  const publishers = [...new Set(items.map((i) => i.publisher))];
  return {
    items: items.slice(0, limit).map(({ ts, ...rest }) => rest), // eslint-disable-line no-unused-vars
    publishers,
    fetchedAt: new Date().toISOString(),
  };
}
