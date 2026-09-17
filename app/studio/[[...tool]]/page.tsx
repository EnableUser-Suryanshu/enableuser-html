/**
 * Sanity Studio, mounted at /studio.
 *
 * Staff-only: access is governed by Sanity project membership, so this route
 * shows a login screen to anyone who has not been invited. It is excluded from
 * search engines in the metadata below.
 */
import type { Metadata, Viewport } from 'next';
import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import { sanityConfigured } from '../../../sanity/env';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Kalpataru Studio',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  // The studio manages its own layout and needs the full viewport.
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main
        id="main"
        style={{ maxWidth: 620, margin: '0 auto', padding: '80px 26px', fontFamily: 'system-ui, sans-serif' }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 14 }}>Studio not connected yet</h1>
        <p style={{ lineHeight: 1.75, color: '#444' }}>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally{' '}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>) in the project’s environment variables, then
          redeploy. Until then the Downloads page continues to serve its existing list, so nothing
          on the public site is affected.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
