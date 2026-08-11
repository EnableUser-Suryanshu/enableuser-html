import branchesJson from './branches.json';
import downloadsJson from './downloads.json';

/* ------------------------------------------------------------------ *
 * CONTACT
 * ------------------------------------------------------------------ */

export interface Branch {
  city: string;
  address: string;
  person: string;
  mobile: string;
  phone: string;
  email: string;
}

export const BRANCHES = branchesJson as Branch[];

export const KEY_CONTACTS = [
  {
    role: 'Customer Care',
    person: 'Manoj Gupta',
    address: 'Hall No. 2, 1st Floor, Western Block, GTB Complex, T. T. Nagar',
    phones: ['0755-4350141', '7648983065'],
    emails: ['dp@kalpatarumulti.com', 'support@kalpatarumulti.com'],
    hours: 'Mon to Sat · 10:00 AM – 6:00 PM',
  },
  {
    role: 'Head of Customer Care',
    person: 'Vinod Singh',
    address: 'Hall No. 2, 1st Floor, Western Block, GTB Complex, T. T. Nagar',
    phones: ['0755-4350142'],
    emails: ['compliance@kalpatarumulti.com'],
    hours: 'Mon to Sat · 10:00 AM – 7:00 PM',
  },
  {
    role: 'Compliance Officer',
    person: 'Amitabh Manya Jain',
    address: 'Hall No. 2, 1st Floor, Western Block, GTB Complex, T. T. Nagar',
    phones: ['9425008895'],
    emails: ['kmlho@kalpatarumulti.com'],
    hours: 'Mon to Sat · 11:00 AM – 7:00 PM',
  },
  {
    role: 'Chief Executive Officer',
    person: 'Aditya Manya Jain',
    address: 'Hall No. 2, 1st Floor, Western Block, GTB Complex, T. T. Nagar',
    phones: ['9826430536'],
    emails: ['aditya@kalpatarumulti.com'],
    hours: 'Mon to Sat · 11:00 AM – 7:00 PM',
  },
];

export const HEAD_OFFICES = [
  {
    label: 'Corporate Office',
    address:
      'Hall No. 2, 1st Floor Western Block, Above Central Bank, GTB Complex, T. T. Nagar, Bhopal - 462003',
    phones: ['0755-4350141-143', '0755-4283016'],
    email: 'kmlho@kalpatarumulti.com',
    person: 'Amitabh Manya Jain',
  },
  {
    label: 'Head Office (Registered)',
    address: '"Kalpataru House", 18 Itwara, Bhopal (MP) - 462001',
    phones: ['0755-2530536', '0755-2739822', '0755-4262655'],
    email: 'kml01@kalpatarumulti.com',
    person: 'Aditya Manya Jain (Chairman)',
  },
];

/** Investor grievance escalation, exactly as published by the exchanges. */
export const ESCALATION = [
  { level: '1', title: 'Contact the branch or dealer', detail: 'Raise the issue with your branch head or relationship manager first — most queries are resolved here.' },
  { level: '2', title: 'Customer care desk', detail: 'Write to support@kalpatarumulti.com or call 0755-4350141. Quote your client code for a faster response.' },
  { level: '3', title: 'Head of Customer Care', detail: 'Escalate to Vinod Singh on 0755-4350142 or compliance@kalpatarumulti.com.' },
  { level: '4', title: 'Compliance Officer', detail: 'Amitabh Manya Jain — 9425008895, kmlho@kalpatarumulti.com.' },
  { level: '5', title: 'Chief Executive Officer', detail: 'Aditya Manya Jain — 9826430536, aditya@kalpatarumulti.com.' },
];

export const EXCHANGE_GRIEVANCE = [
  { name: 'NSE Investor Helpline', href: 'https://investorhelpline.nseindia.com/NICEPLUS/' },
  { name: 'BSE Investor Complaints', href: 'https://bsecrs.bseindia.com/ecomplaint/frmInvestorHome.aspx' },
  { name: 'MCX Investor Services', href: 'https://www.mcxindia.com/Investor-Services' },
  { name: 'CDSL Grievances', href: 'https://www.cdslindia.com/eservices/footer/grievances' },
  { name: 'SEBI SCORES', href: 'https://scores.sebi.gov.in/' },
  { name: 'SMART ODR', href: 'https://smartodr.in/login' },
];

/* ------------------------------------------------------------------ *
 * MF ONLINE — AMC direct-investment portals (ARN-linked)
 * ------------------------------------------------------------------ */

export const MF_TOOLS = [
  { label: 'MF Portfolio Login', href: 'https://www.ifaplanet.com/form_login.php', desc: 'View your consolidated mutual fund portfolio and statements.' },
  { label: 'Kalpataru MF Portal', href: 'https://mf.kalpatarumulti.com/login', desc: 'Transact in direct and regular plans through our own platform.' },
];

/* ------------------------------------------------------------------ *
 * NEW TO MARKET — resources published by Kalpataru
 * ------------------------------------------------------------------ */

export const NTM_RESOURCES = [
  { label: 'Margin Pledge', kind: 'PDF', href: 'https://www.kalpatarumulti.com/files/newtomarket/Margin_Pledge.pdf', desc: 'How the margin pledge system works and what you need to authorise.' },
  { label: 'ANMI–Secmark FAQ on Margin', kind: 'PDF', href: 'https://www.kalpatarumulti.com/files/newtomarket/ANMI_Secmark_FAQ_on_Margin_2Sep2020.pdf', desc: 'Industry FAQ on the September 2020 margin rules.' },
  { label: 'Pledge Mechanism', kind: 'PPT', href: 'https://www.kalpatarumulti.com/files/newtomarket/pledge_mechanism.pptx', desc: 'Step-by-step walkthrough of the depository pledge mechanism.' },
  { label: 'Union Budget 2016 — Key Features (Hindi)', kind: 'PDF', href: 'https://www.kalpatarumulti.com/files/pdf/Budget_2016_keyfeature_hindi.pdf', desc: 'बजट की मुख्य बातें — key budget features in Hindi.' },
  { label: 'Rail Budget Highlights (Hindi)', kind: 'PDF', href: 'https://www.kalpatarumulti.com/files/pdf/rail_budget_highlights_hindi.pdf', desc: 'रेल बजट की मुख्य बातें — rail budget highlights in Hindi.' },
];

export const GOLD_ROUTES = [
  { label: 'Sovereign Gold Bond (SGB)', href: 'https://meon.space/sgb/kalpataru', desc: 'Government-backed bonds that track gold and pay interest — held in demat.' },
  { label: 'Gold ETFs', href: 'https://www.nseindia.com/market-data/exchange-traded-funds-etf', desc: 'Exchange-traded funds that track gold prices and trade like a share.' },
];

export const COMMODITY_LOGINS = [
  { label: 'MCX Online Trading', href: 'http://onlinetrading.kalpatarumulti.com/pages/Login.aspx' },
  { label: 'NCDEX Online Trading', href: 'http://onlinetrading.kalpatarumulti.com/' },
];

/* ------------------------------------------------------------------ *
 * DOWNLOADS
 * ------------------------------------------------------------------ */


export interface DownloadItem {
  label: string;
  href: string;
  kind: string;
  cat: string;
}

export const DOWNLOADS = downloadsJson as DownloadItem[];

export const DOWNLOAD_CATS = [
  'Account Opening & KYC',
  'Demat & DP Forms',
  'Nomination & Transmission',
  'Pledge & Margin',
  'Guides & Demos',
  'Software & Utilities',
];

/* ------------------------------------------------------------------ *
 * CUSTOMER CARE — support desks exactly as published
 * ------------------------------------------------------------------ */

export const SUPPORT_TEAMS = [
  {
    team: 'Online / Technical Support',
    person: 'Mr. Javed Khan',
    designation: 'IT Manager',
    mobiles: ['094795 85008'],
    phones: ['0755-4350141', '0755-4350142'],
    emails: ['info@kalpatarumulti.com', 'complaint@kalpatarumulti.com'],
  },
  {
    team: 'A/c Back Office Support',
    person: 'Mr. Vinod Singh',
    designation: 'General Manager',
    mobiles: ['093292 09605'],
    phones: ['0755-4350142', '0755-4350143'],
    emails: ['account@kalpatarumulti.com'],
  },
  {
    team: 'DP Back Office Support',
    person: 'Mr. Manoj Gupta',
    designation: 'DP Manager',
    mobiles: ['7648983054'],
    phones: ['0755-4350143'],
    emails: ['dp@kalpatarumulti.com'],
  },
];

export const TRADING_DESKS = [
  {
    label: 'BSE Share Trading',
    groups: [
      { where: 'Head Office', numbers: ['0755-4262655', '9300327450', '9009995302', '7648983062', '9303132109'] },
      { where: 'Corporate Office', numbers: ['0755-4350141', '0755-4350142', '0755-4350143', '7648983052', '7648983051'] },
    ],
  },
  {
    label: 'NSE & NSE F&O Trading',
    groups: [{ where: 'Dealing desk', numbers: ['0755-4283016', '+91 7648983051', '+91 7648983052'] }],
  },
  {
    label: 'Commodity Trading',
    groups: [{ where: 'Dealing desk', numbers: ['+91 7648983053', '0755-4350143', '9407880812'] }],
  },
];

export const CARE_ESCALATION = [
  { person: 'Mr. Amitabh Manya Jain', role: 'Managing Director', mobile: '094250 08895', email: 'kmlho@kalpatarumulti.com' },
  { person: 'Mr. S. N. Tiwari', role: 'Chief General Manager', mobile: '98932 76728', phone: '0755-4262655', email: 'kmlho@kalpatarumulti.com' },
];

/* ------------------------------------------------------------------ *
 * BUSINESS PARTNERS — franchise support pillars
 * ------------------------------------------------------------------ */

export const PARTNER_PILLARS = [
  {
    title: 'Training',
    body: 'We believe in the "Power of Knowledge". Extensive training is conducted for the business partner and their team — at your office, and finally at our head office in Bhopal.',
  },
  {
    title: 'Business Development Support',
    body: 'A dedicated team of business development managers helps partners grow business at their outlets, add new customers and offer inclusive wealth-management solutions.',
  },
  {
    title: 'Research Support',
    body: '"Solid research. Solid advice." Our research desk provides positive, actionable solutions for all the advisory requirements of our branches and their clients.',
  },
  {
    title: 'Marketing & Branding Support',
    body: 'Partners get organised, professional marketing support — planned publicity campaigns for brand building and sales promotion at regular intervals.',
  },
  {
    title: 'Technology',
    body: 'Technology is the backbone of the share business. We back partners with comprehensive, latest and ultramodern trading and back-office technology.',
  },
  {
    title: 'Supervision & Compliance',
    body: 'Senior executives visit branches regularly to ensure smooth operations and supervise regulatory compliance, stepping in with resources wherever potential is untapped.',
  },
];

export const PARTNER_VALUES = [
  {
    title: 'Investing as unique as you are',
    body: 'No two investors are alike — goals, appetite, risk-bearing capacity and style all differ. Our advice and plans are tailor-made, with customised research, selective calls and flexible service options.',
  },
  {
    title: 'Your gain is our aim',
    body: 'Our decisions revolve around the client’s profit. Even if it is called a contrarian approach, our aim is to safeguard client interests and protect their money from potential risk.',
  },
  {
    title: 'Here trust is tradition',
    body: 'Kalpataru is a synonym for trust. Transparency in transactions and honesty in dealings have become our identity — a relationship built on trust, transparency and tradition.',
  },
];
