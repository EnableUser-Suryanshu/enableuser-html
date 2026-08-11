/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: static export is intentionally OFF. The live ticker needs a
  // server-side route (`/api/ticker`) because NSE sends no CORS headers, so the
  // browser cannot call it directly. Pages are still pre-rendered (SSG) — only
  // that one route is dynamic. Vercel runs this natively.
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { dev }) => {
    if (dev) {
      // Don't let the dev watcher react to export artifacts in ./out.
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**', '**/out/**'],
      };
    }
    return config;
  },
};

// NOTE: `next build` and `next dev` share the .next directory. Stop the dev
// server before running `npm run build`, or the dev server will crash with
// "Cannot find module" chunk errors and need a restart.

export default nextConfig;
