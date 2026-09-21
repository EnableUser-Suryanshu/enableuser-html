/**
 * Investor-awareness notices shown on first visit each session.
 *
 * These are the four banners kalpatarumulti.com publishes, and they are shown
 * here as the same pictures, so the pop-ups look like the ones clients already
 * know. Each banner is also written out as text — `title`, `lead`, `groups`,
 * `footnote` — because every one of them is a picture of a paragraph, and a
 * picture of a paragraph cannot be read aloud, enlarged, translated or
 * selected. The component renders the image for sighted visitors and the text
 * for everyone else, so the two never disagree.
 *
 * The SEBI banner is served at 1400px rather than the original 5202px: the
 * source file was 2.5 MB for something shown about 600px wide.
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
  /**
   * The banner as the live site publishes it. This is what a sighted visitor
   * sees; `title`, `lead` and `groups` above are the same content as text,
   * rendered for screen readers and for anyone using the site's own
   * accessibility toolkit — a picture of a paragraph cannot be read aloud,
   * enlarged, translated or selected, and every one of these banners is one.
   * Intrinsic dimensions are declared so the dialog does not jump as each
   * image loads.
   */
  image: { src: string; w: number; h: number };
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
    image: { src: '/assets/popups/nseix-banner.jpg', w: 1136, h: 1280 },
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
    image: { src: '/assets/popups/cdsl-banner.png', w: 650, h: 365 },
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
    image: { src: '/assets/popups/sebi-banner.jpg', w: 1400, h: 787 },
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
    image: { src: '/assets/popups/scores-banner.png', w: 336, h: 425 },
    cta: { label: 'Register on SCORES', href: 'https://scores.sebi.gov.in/' },
    footnote: 'Quote your Complaint Reference Number so SEBI can trace what we have already done.',
  },
];
