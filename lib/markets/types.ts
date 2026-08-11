/** Column value semantics — drives alignment, formatting and colour coding. */
export type ColType =
  | 'text'
  | 'num'      // right-aligned number
  | 'change'   // signed number: green when ≥0, red when <0
  | 'pct'      // signed percentage
  | 'date'
  | 'tag';     // pill (deal type, issue type, segment…)

export interface MarketColumn {
  key: string;
  label: string;
  type: ColType;
}

export type MarketGroupId =
  | 'equity'
  | 'corporate'
  | 'institutional'
  | 'derivatives'
  | 'commodity'
  | 'currency'
  | 'mutual-fund'
  | 'ipo';

export interface MarketDataset {
  slug: string;
  title: string;
  group: MarketGroupId;
  /** One-line description shown under the page title and on cards. */
  blurb: string;
  columns: MarketColumn[];
  rows: Array<Record<string, string | number>>;
  /** Column key used for the headline sort on first render. */
  defaultSort?: string;
  /** True when no live source is wired yet — renders an honest empty state. */
  pending?: boolean;
  /**
   * Shown in place of rows when the source is wired and reachable but has
   * nothing to report (e.g. no company has an open book-closure window), and
   * as a banner above the table when `stale` is set.
   */
  note?: string;
  /** Rows were carried over from an earlier build because this run could not refresh them. */
  stale?: boolean;
  /** Set when the rows came from a licensed vendor feed rather than public data. */
  vendor?: string;
}

export interface MarketSnapshot {
  /** ISO time the data was pulled. */
  fetchedAt: string;
  /** Exchange-reported timestamp, e.g. "03-Aug-2026 15:30". */
  marketTimestamp: string;
  /** "Open" | "Closed" per NSE. */
  marketStatus: string;
  source: string;
  /** Licensed feed in use, e.g. "TrueData (NSE / BSE / MCX licensed feed)". */
  vendor?: string | null;
  datasets: MarketDataset[];
}

export interface MarketGroup {
  id: MarketGroupId;
  label: string;
  blurb: string;
}

export const MARKET_GROUPS: MarketGroup[] = [
  { id: 'equity', label: 'Equity', blurb: 'Movers, activity, delivery and index snapshots from NSE & BSE.' },
  { id: 'corporate', label: 'Corporate Actions', blurb: 'Dividends, bonuses, splits, board meetings and announcements.' },
  { id: 'institutional', label: 'Institutional & Global', blurb: 'FII/DII flows, world indices and ADR prices.' },
  { id: 'derivatives', label: 'Derivatives', blurb: 'Futures and options activity across index and stock contracts.' },
  { id: 'commodity', label: 'Commodities', blurb: 'Bullion, energy and base-metal benchmarks that MCX contracts settle against.' },
  { id: 'currency', label: 'Currency', blurb: 'Rupee exchange rates against the major traded currencies.' },
  { id: 'mutual-fund', label: 'Mutual Funds', blurb: 'Fund house profiles and the AMFI scheme universe.' },
  { id: 'ipo', label: 'IPO', blurb: 'Open, upcoming and recently listed public issues.' },
];
