// Content data for the site. Edit copy here without touching components.

export interface Quote {
  name: string;
  /** Reference price used to compute the displayed change %. */
  base: number;
  /** Starting price shown before the live simulation kicks in. */
  start: number;
  /** Decimal places to display. */
  dec: number;
}

export const QUOTES: Quote[] = [
  { name: 'NIFTY 50', base: 22450.25, start: 22450.25, dec: 2 },
  { name: 'SENSEX', base: 73961.1, start: 73872.1, dec: 2 },
  { name: 'GOLD', base: 70357, start: 71200, dec: 0 },
];

export interface Fund {
  initials: string;
  color: string;
  name: string;
  sub: string;
  ret: string;
}

export const FUNDS: Fund[] = [
  { initials: 'H', color: '#e31e24', name: 'HDFC Silver ETF Fund Of Fund Regular Growth', sub: 'Others Funds (INF179KC1DV5)', ret: '44.43%' },
  { initials: 'A', color: '#97144d', name: 'Axis Silver Fund Of Fund', sub: 'Others Funds (INF846K018J8)', ret: '44.19%' },
  { initials: 'A', color: '#97144d', name: 'Axis Silver Fund Of Fund', sub: 'Others Funds (INF846K019J6)', ret: '44.19%' },
  { initials: 'i', color: '#f06321', name: 'ICICI Prudential Silver ETF FOF Growth', sub: 'Others Funds (INF109KC1Y64)', ret: '44.34%' },
  { initials: 'AB', color: '#c8102e', name: 'Aditya Birla Sun Life Silver ETF Fund Of Fund Regular Growth', sub: 'Others Funds (INF209KB13F9)', ret: '44.21%' },
  { initials: 'AB', color: '#c8102e', name: 'Aditya Birla Sun Life Silver ETF FOF Regular IDCW Payout', sub: 'Others Funds (INF209KB14F7)', ret: '44.21%' },
  { initials: 'K', color: '#003874', name: 'Kotak Silver ETF Fund Of Fund', sub: 'Others Funds (INF174KA1HS0)', ret: '44.09%' },
];

/** Candle close values (y from baseline) for the decorative hero chart. */
export const CHART_CLOSES = [58, 70, 64, 82, 90, 84, 100, 116, 108, 124, 136, 130, 148, 162, 156, 174];

export const MARQUEE_ITEMS = [
  'NSE', 'BSE', 'MCX', 'CDSL', 'SEBI Registered', 'Since 1992', '35K+ Happy Clients',
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_LEFT: FaqItem[] = [
  {
    q: 'What is an Online Trading Platform?',
    a: 'An online trading platform is software that lets you buy and sell securities such as stocks, derivatives, commodities, and mutual funds over the internet — with live market data, charts, and instant order placement from your phone or desktop.',
  },
  {
    q: 'What are the advanced Option Chain features available on Kalpataru share trade Web trading platform?',
    a: 'The web platform offers a live option chain with real-time Greeks, open interest build-up, PCR analysis, strike-wise OI change visualisation, and one-click order placement directly from the chain.',
  },
  {
    q: 'What is a share market app?',
    a: 'A share market app is a mobile application that brings the stock exchange to your pocket — track indices, research companies, invest in IPOs and mutual funds, and manage your portfolio anytime, anywhere.',
  },
  {
    q: 'What are the features available on Kalpataru share trade Web trading platform?',
    a: 'Advanced charting with 100+ indicators, multi-watchlists, basket orders, GTT orders, live P&L tracking, back-office integration, and institutional-grade security — all in the browser with no installation needed.',
  },
];

export const FAQ_RIGHT: FaqItem[] = [
  {
    q: 'How to choose a trading App?',
    a: 'Look for SEBI registration, exchange memberships, execution speed, stability during peak market hours, transparent pricing, research quality, and responsive customer support before choosing a trading app.',
  },
  {
    q: 'What makes a good trading App?',
    a: 'A good trading app combines fast, reliable order execution with clean design, real-time data, strong security (2FA, encryption), useful alerts, and seamless fund transfers — so you never miss a market opportunity.',
  },
  {
    q: 'What are the different types of orders that can be placed on the Kalpataru share trade Trading App?',
    a: 'You can place Market, Limit, Stop-Loss (SL & SL-M), Cover, Bracket, AMO (after-market), and GTT (good-till-triggered) orders across Equity, F&O, and Commodity segments.',
  },
];

export const TYPEWRITER_PHRASES = [
  'Search by scheme',
  'Silver ETF funds',
  'Nifty 50 index funds',
  'Top 3Y returns',
];

export const MEMBER_DETAILS = [
  { label: 'SEBI Regn No.', value: 'INZ000259437' },
  { label: 'BSE Member ID', value: '3016' },
  { label: 'NSE Member ID', value: '11152' },
  { label: 'MCX Member ID', value: '16020' },
  { label: 'CDSL DP-ID', value: '12031600' },
];
