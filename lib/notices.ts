/**
 * Investor-awareness notices shown on first visit each session.
 *
 * The live site (kalpatarumulti.com) serves these as flat PNG banners. They
 * are rebuilt here as structured content because a picture of a paragraph
 * cannot be read aloud, cannot be zoomed without going soft, cannot be
 * translated and cannot be selected — and one of those banners was 2.5 MB.
 * This site ships an accessibility widget; its own pop-ups should not be the
 * least accessible thing on the page.
 *
 * `id` is what a dismissal is remembered against. Change it when the content
 * changes materially and the notice reappears; leave it for a typo fix so
 * nobody is interrupted twice for nothing.
 */

export type NoticeTheme = 'cdsl' | 'sebi' | 'scores' | 'nseix';

export interface Notice {
  id: string;
  theme: NoticeTheme;
  /** Small label above the title — who is speaking. */
  source: string;
  title: string;
  /**
   * Devanagari headline, where the notice on the live site leads in Hindi.
   * Rendered inside lang="hi" so assistive tech switches voice — WCAG 3.1.2
   * wants the language of a passage identified when it differs from the page.
   */
  titleHi?: string;
  /** Short standfirst under the title. */
  lead: string;
  /** Optional grouped detail. */
  groups?: { heading: string; items: string[] }[];
  cta: { label: string; href: string };
  /** Shown under the button — the caveat or the practical note. */
  footnote?: string;
}

export const NOTICES: Notice[] = [
  {
    // The live site's fourth pop-up (#NFLQuiz), a Kalpataru announcement
    // rather than a regulator's. It leads in Hindi there, so it leads in
    // Hindi here. The phone numbers and the trading URL are read off the
    // banner itself, which is the only place they are published.
    id: 'nseix-global-2026',
    theme: 'nseix',
    source: 'Kalpataru Multiplier Ltd',
    titleHi: 'अंतरराष्ट्रीय कंपनी के शेयर्स में खरीद बिक्री प्रारंभ',
    title: 'Buy and sell international shares',
    lead:
      'Trading in shares of international companies is now open to you through Kalpataru and NSE IX Global — from the same relationship you already hold with us.',
    groups: [
      {
        heading: 'Getting started',
        items: [
          'Trade through NSE IX Global on the Kalpataru web login',
          'Or use the Kalpataru share trading app on Android and iOS',
          'Call the desk and we will walk you through the first order',
        ],
      },
    ],
    cta: { label: 'Open the NSE IX Global login', href: 'https://trade.nseixga.com/login?kalpataru' },
    footnote:
      'Enquiries and reservations: 0755 427 6725 · 98264 30536 · 94250 08895 · 72229 49234 · 89892 71259',
  },
  {
    id: 'cdsl-myeasi-2026',
    theme: 'cdsl',
    source: 'CDSL',
    title: 'Your demat account, on your phone',
    lead:
      'CDSL’s investor features are now unified in the MyEasi app and the Easi / Easiest web platform — holdings, statements and transactions in one place, direct from the depository.',
    groups: [
      {
        heading: 'Where to get it',
        items: [
          'Search “CDSL MyEasi” on Google Play or the App Store',
          'Or sign in to Easi / Easiest on the web',
        ],
      },
    ],
    cta: { label: 'Open Easi / Easiest', href: 'https://web.cdslindia.com/myeasitoken/home/login' },
    footnote: 'CDSL is your depository. Kalpataru is your DP — we never ask for your CDSL password.',
  },
  {
    id: 'sebi-investor-site-2026',
    theme: 'sebi',
    source: 'SEBI · Har Investor Ki Taaqat',
    title: 'Learn the market from the regulator itself',
    lead:
      'SEBI’s investor portal explains personal finance and the securities market in plain language. No account, no cost, no sales pitch.',
    groups: [
      {
        heading: 'What you will find',
        items: [
          'Money Matters — personal finance from the ground up',
          'Educational resources on investing and the securities market',
          'Financial tools and calculators',
          'A financial health check you can run yourself',
        ],
      },
    ],
    cta: { label: 'Visit investor.sebi.gov.in', href: 'https://investor.sebi.gov.in/' },
  },
  {
    id: 'scores-filing-2026',
    theme: 'scores',
    source: 'Investor grievance',
    title: 'Filing a complaint on SCORES',
    lead:
      'If we have not resolved something to your satisfaction, SEBI’s SCORES portal is your next step — and it is designed to be quick.',
    groups: [
      {
        heading: 'Keep ready',
        items: ['Name', 'PAN', 'Address', 'Mobile number', 'Email ID'],
      },
      {
        heading: 'What you get',
        items: [
          'Direct communication with us and with SEBI',
          'Speedy redressal of the grievance',
          'Status visible to you, end to end',
        ],
      },
    ],
    cta: { label: 'Register on SCORES', href: 'https://scores.sebi.gov.in/' },
    footnote: 'Quote your Complaint Reference Number so SEBI can trace what we have already done.',
  },
];
