'use client';

import { useEffect, useState } from 'react';
import { Newspaper, ArrowRight } from './icons';
import { EXT } from '@/lib/links';

interface Item {
  title: string;
  url: string;
  publisher: string;
  section: string;
  publishedAt: string | null;
}

/** "3 min ago" / "2 h ago" / "4 Sep" — compact and unambiguous. */
function ago(iso: string | null) {
  if (!iso) return '';
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return '';
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return new Date(then).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Live headlines from the Indian financial press.
 *
 * Headlines and links only — the article stays with the publisher that wrote
 * it, and every item opens on their site.
 */
export default function MarketNews({ limit = 8, heading = 'Market News' }: { limit?: number; heading?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'empty'>('loading');
  const [at, setAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const pull = async () => {
      if (items.length && (document.hidden || document.documentElement.classList.contains('motion-paused'))) {
        timer = setTimeout(pull, 300_000);
        return;
      }
      try {
        const r = await fetch(`/api/news?limit=${limit}`, { cache: 'no-store' });
        const j = (await r.json()) as { items?: Item[] };
        if (cancelled) return;
        if (j.items?.length) {
          setItems(j.items);
          setState('ready');
          setAt(new Date());
        } else if (state === 'loading') {
          setState('empty');
        }
      } catch {
        if (!cancelled && state === 'loading') setState('empty');
      }
      // The feeds are cached for five minutes upstream; match that.
      timer = setTimeout(pull, 305_000);
    };

    pull();
    const onVis = () => { if (!document.hidden) pull(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return (
    <div className="mnews">
      <h2 className="news-head">
        <Newspaper size={22} /> {heading}
      </h2>

      {state === 'empty' ? (
        <p className="mnews-empty">
          Live headlines are unavailable right now. Please check back shortly.
        </p>
      ) : state === 'loading' ? (
        <ul className="mnews-list" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <li className="mnews-item skel" key={i}>
              <span className="skel-line" />
              <span className="skel-line short" />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <ul className="mnews-list">
            {items.map((n) => (
              <li className="mnews-item" key={n.url}>
                <a href={n.url} {...EXT}>
                  <span className="mnews-title">{n.title}</span>
                  <span className="mnews-meta">
                    <span className="mnews-pub">{n.publisher}</span>
                    {n.publishedAt && (
                      <>
                        <span aria-hidden="true">·</span>
                        <time dateTime={n.publishedAt}>{ago(n.publishedAt)}</time>
                      </>
                    )}
                  </span>
                  <ArrowRight size={15} strokeW={2.2} />
                </a>
              </li>
            ))}
          </ul>
          <p className="mnews-foot">
            <span className="mkt-live-dot on" aria-hidden="true"></span>
            {at ? `Updated ${at.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}` : 'Live'}
            {' · '}Headlines from the Indian financial press. Each opens on the publisher&apos;s site.
          </p>
        </>
      )}
    </div>
  );
}
