import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import MarketsBento from '@/components/markets/MarketsBento';
import DatasetExplorer from '@/components/markets/DatasetExplorer';
import DataNotice from '@/components/markets/DataNotice';
import MarketStatusProvider from '@/components/markets/MarketStatusContext';
import {
  MARKET_DATASETS, MARKET_GROUPS, getDataset, liveIndices, liveDatasetCount, marketMeta,
} from '@/lib/markets';
import { PORTALS, EXT } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Markets — Kalpataru Multiplier Ltd',
  description:
    'Live market dashboard: NSE and BSE indices, movers, delivery data, corporate actions, world indices, ADRs, commodities, currencies, IPOs and the AMFI fund universe.',
};

export default function MarketsPage() {
  const indices = liveIndices();
  const moverRows = (getDataset('gainers-and-losers')?.rows ?? []) as unknown as Array<{
    company: string; last: number; chgPct: number;
  }>;
  const sorted = [...moverRows].sort((a, b) => b.chgPct - a.chgPct);
  const breadth = (getDataset('advances-and-declines')?.rows ?? []) as unknown as Array<{
    group: string; adv: number; dec: number;
  }>;

  return (
    <MarketStatusProvider
      initialStatus={marketMeta.marketStatus}
      initialTimestamp={marketMeta.marketTimestamp}
    >
    <main id="main">
      <PageHero
        crumb="Markets"
        words={[
          { text: 'The' }, { text: 'Market,' }, { text: 'Read', accent: true },
          { text: 'at' }, { text: 'a' }, { text: 'Glance.' },
        ]}
        lead="NSE and BSE indices, movers, delivery data, corporate filings, world markets, commodities and the mutual fund universe — one desk, refreshing live while you watch."
        cta={
          <>
            <a href={PORTALS.webTrading} {...EXT} className="btn btn-white">
              LAUNCH WEB TRADING
            </a>
          </>
        }
      />

      {/* Bento dashboard */}
      <section className="section mkt-bento-sec watch" aria-labelledby="bento-h">
        <div className="container">
          <h2 id="bento-h" className="sr-only">Market dashboard</h2>
          <MarketsBento
            indices={indices}
            gainers={sorted.slice(0, 4)}
            losers={sorted.slice(-4).reverse()}
            breadth={breadth}
          />
        </div>
      </section>

      {/* Compact dataset explorer */}
      <section className="section mkt-explore watch" aria-labelledby="dsx-h">
        <div className="container">
          <div className="mkt-sec-head">
            <div>
              <h2 id="dsx-h" className="sec-title">The Market Desk</h2>
              <p className="sec-sub">
                {liveDatasetCount()} live datasets from NSE, BSE, AMFI and global market feeds, each
                refreshing on its own schedule — filter or search to jump straight in.
              </p>
            </div>
          </div>
          <DatasetExplorer datasets={MARKET_DATASETS} groups={MARKET_GROUPS} />
          <DataNotice />
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band watch">
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="container">
          <h2>Trade what you just researched</h2>
          <p>Open your 3-in-1 trading, demat and mutual fund account and act on these numbers in seconds.</p>
          <div className="row">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-white">OPEN FREE ACCOUNT</a>
            <a href={PORTALS.webTrading} {...EXT} className="btn btn-red">Start Trading</a>
          </div>
        </div>
      </section>
    </main>
    </MarketStatusProvider>
  );
}
