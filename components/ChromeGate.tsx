'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides the site chrome on /studio.
 *
 * Sanity Studio is a full-screen application: it manages its own header,
 * navigation and scrolling, so rendering it inside the marketing header,
 * ticker, footer and support button leaves it unusable.
 *
 * The textbook fix is a route group with a second root layout, but that means
 * moving all 68 existing routes under `(site)/` — a large change for one
 * staff-only page. `usePathname` resolves during SSR as well as on the client,
 * so the chrome is never rendered for /studio in the first place rather than
 * being hidden after paint.
 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/studio')) return null;
  return <>{children}</>;
}
