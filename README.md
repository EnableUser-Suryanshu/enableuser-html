# Kalpataru Multiplier Ltd — Website (Next.js)

Single-page marketing site for Kalpataru Multiplier Ltd, built with **Next.js 15
(App Router) + TypeScript**. Static-exported — no Node server needed in production.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build for production

```bash
npm run build      # emits a fully static site into ./out
```

> **Note:** stop the dev server (`npm run dev`) before running `npm run build` —
> both share the `.next` working directory, and building while dev is running
> crashes the dev server (restart it with a clean `.next` if that happens).

Upload the contents of `out/` to any web hosting (cPanel, Nginx, Netlify,
Vercel, S3 — anything that serves static files).

## Licensed exchange feed (TrueData — NSE / BSE / MCX)

The Markets section is wired to **TrueData**, an authorised real-time data vendor for
NSE EQ, NSE FO, NSE Indices, BSE EQ, BSE Indices and MCX.

**To switch the licensed feed on, set two environment variables** — no code changes:

```bash
TRUEDATA_USERNAME=your_truedata_id
TRUEDATA_PASSWORD=your_truedata_password
```

- **Locally:** copy `.env.example` → `.env.local` and fill them in.
- **On Vercel:** Project → Settings → Environment Variables → add both → redeploy.

With credentials present, `npm run build` authenticates against
`https://auth.truedata.in/token` (OAuth2 password grant) and pulls quotes from
`https://history.truedata.in/getbars`, lighting up datasets the public API cannot serve:

| Dataset | Segment |
|---|---|
| MCX Commodity Futures (gold, silver, crude, gas, base metals) | MCX |
| BSE Indices (SENSEX, BSE 100/500, MidCap, SmallCap) | BSE |
| Currency Futures (USD/EUR/GBP/JPY INR) | NSE CDS |

Adjust the tracked instruments in `scripts/vendors/truedata.mjs`
(`MCX_COMMODITIES`, `BSE_INDICES`, `CURRENCY_FUTURES`) to match the subscription.

**Without credentials the build still works** — it falls back to NSE's public endpoints
automatically, and the vendor-only datasets show an honest "awaiting data feed" state.
The same happens if the feed is down or the subscription lapses, so a build never fails
and never ships empty tables.

## Live market data (public fallback)

The Markets section renders **real NSE India data**, not mock data.

```bash
npm run fetch:markets   # pull fresh data into lib/markets/snapshot.json
npm run build           # runs fetch:markets automatically first (prebuild)
```

`scripts/fetch-market-data.mjs` pulls from NSE's public endpoints (indices, gainers/losers,
most active, 52-week highs/lows, bulk & block deals, short selling, corporate actions, board
meetings, FII/DII flows, IPOs, index futures) and writes a snapshot that the pages read.
Every deploy therefore ships fresh exchange data, stamped with NSE's own timestamp.

**Keeping it fresh automatically** — the data is as current as the last build, so schedule
redeploys during market hours:

1. Vercel → Project → Settings → Git → **Deploy Hooks** → create a hook, copy the URL.
2. Point any scheduler at it (Vercel Cron, GitHub Actions, or a free service like
   cron-job.org), e.g. every 15 minutes between 09:15 and 15:30 IST on weekdays.

If a fetch fails, the script keeps the previous snapshot so a build never ships empty tables.

Datasets with no free NSE source (world indices, ADR prices, delivery analytics, AMFI fund
data, exchange announcements) are flagged `pending` and render an honest "awaiting data feed"
state — wire the client's licensed vendor feed in the same script to light them up.

## Project structure

| Path | Purpose |
|---|---|
| `app/layout.tsx` | Root layout, fonts (Poppins/Inter via `next/font`), metadata |
| `app/page.tsx` | Assembles all page sections |
| `app/globals.css` | Full design system + all animation keyframes |
| `components/` | One component per section + interaction helpers |
| `lib/links.ts` | **Every external URL** (portals, policies, social, apps, regulators) |
| `lib/data.ts` | Editable content: ticker quotes, fund list, FAQs, marquee items |
| `public/assets/` | Logo + section photos |

## Editing content

- **Links** — edit `lib/links.ts` (portal URLs from the Kalpataru team live here;
  placeholders marked `'#'` are still awaiting URLs: Dormant Policy, Regulatory,
  Terms of Use, Terms & Conditions, partner registration, news articles).
- **Copy/data** — edit `lib/data.ts` (quotes, funds shown in the phone, FAQs).
- **Section text** — edit the relevant component in `components/`.

## Interactive features

- Live-simulated ticker with green/red price flashes (`Ticker.tsx`)
- Animated hero phone: auto-scrolling fund list, typewriter search, cursor tilt (`Hero.tsx`)
- Self-drawing candlestick chart, floating ₹ coins, morphing blobs (CSS + `Hero.tsx`)
- Scroll-reveal system, card 3D tilt, magnetic buttons (`PointerFx.tsx`)
- Count-up stats (`CountUp.tsx`), FAQ accordion (`Faq.tsx`),
  scroll progress bar + FAB progress ring (`ProgressBar.tsx`, `Fab.tsx`)
- All animations respect `prefers-reduced-motion`.
