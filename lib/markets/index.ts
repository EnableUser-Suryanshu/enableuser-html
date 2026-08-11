import snapshot from './snapshot.json';
import {
  MARKET_GROUPS,
  type MarketDataset,
  type MarketGroupId,
  type MarketSnapshot,
} from './types';

/**
 * Real exchange data, refreshed by `scripts/fetch-market-data.mjs`
 * (runs automatically on every build via the `prebuild` npm script).
 */
const SNAPSHOT = snapshot as unknown as MarketSnapshot;

export const MARKET_DATASETS: MarketDataset[] = SNAPSHOT.datasets;
export { MARKET_GROUPS };
export type { MarketDataset, MarketGroupId };

export const marketMeta = {
  fetchedAt: SNAPSHOT.fetchedAt,
  marketTimestamp: SNAPSHOT.marketTimestamp,
  marketStatus: SNAPSHOT.marketStatus,
  source: SNAPSHOT.source,
  vendor: SNAPSHOT.vendor ?? null,
};

export function getDataset(slug: string): MarketDataset | undefined {
  return MARKET_DATASETS.find((d) => d.slug === slug);
}

export function datasetsInGroup(group: MarketGroupId): MarketDataset[] {
  return MARKET_DATASETS.filter((d) => d.group === group);
}

export function groupOf(id: MarketGroupId) {
  return MARKET_GROUPS.find((g) => g.id === id)!;
}

export function liveDatasetCount() {
  return MARKET_DATASETS.filter((d) => !d.pending).length;
}

/** Benchmark indices used for the animated strip on the markets hub. */
export function liveIndices() {
  return (getDataset('live-indices')?.rows ?? []) as unknown as Array<{
    index: string; close: number; prev: number; chgPct: number;
  }>;
}
