/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: static export is intentionally OFF. The live ticker needs a
  // server-side route (`/api/ticker`) because NSE sends no CORS headers, so the
  // browser cannot call it directly. Pages are still pre-rendered (SSG) — only
  // that one route is dynamic. Vercel runs this natively.
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },

  // Sanity Studio pulls in @sanity/ui, which imports React 19.2's
  // `useEffectEvent`. Webpack's CJS export lexer cannot see that export
  // statically and fails the build with "Attempted import error", even though
  // React does export it at runtime. Turbopack resolves it correctly, so both
  // `dev` and `build` run on Turbopack — see package.json.
  //
  // The previous `webpack()` hook only widened dev watch-ignores to cover
  // ./out, an artifact of the old static export that is no longer produced.
  // It is dropped rather than carried over, since keeping it would warn on
  // every Turbopack build for no benefit.
};

// NOTE: `next build` and `next dev` share the .next directory. Stop the dev
// server before running `npm run build`, or the dev server will crash with
// "Cannot find module" chunk errors and need a restart.

export default nextConfig;
