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
    person: 'Amitabh Manya Jain (MD)',
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
  { label: 'Kalpataru MF Portal', href: 'https://mf.kalpatarumulti.com/login', desc: 'Transact in mutual funds with our own platforms.' },
];

/* ------------------------------------------------------------------ *
 * NEW TO MARKET — resources published by Kalpataru
 * ------------------------------------------------------------------ */

export interface NtmResource {
  label: string;
  kind: 'PDF' | 'PPT';
  href: string;
  desc: string;
  /**
   * Devanagari lead for a Hindi document. The renderer wraps it in lang="hi"
   * so assistive tech switches voice — WCAG 3.1.2 needs the language of a
   * passage identified when it differs from the page's.
   */
  hi?: string;
}

/*
 * Served from this site, not from www.kalpatarumulti.com — that host is being
 * retired, and these were the last links still pointing at it from this page.
 * The files are the ones it serves, copied into public/files/newtomarket.
 *
 * The ANMI FAQ was linked as .pdf and badged PDF. No such file exists there;
 * it is a .pptx and always was, so the link 404'd. Both are corrected.
 */
export const NTM_RESOURCES: NtmResource[] = [
  { label: 'Margin Pledge', kind: 'PDF', href: '/files/newtomarket/Margin_Pledge.pdf', desc: 'How the margin pledge system works and what you need to authorise.' },
  { label: 'Peak Margin Reporting — Circular', kind: 'PDF', href: '/files/newtomarket/Peak_Margin_Reporting_circular_website.pdf', desc: 'The circular on peak margin reporting and how the penalty is computed.' },
  { label: 'ANMI–Secmark FAQ on Margin', kind: 'PPT', href: '/files/newtomarket/ANMI_Secmark_FAQ_on_Margin_2Sep2020.pptx', desc: 'Industry FAQ on the September 2020 margin rules.' },
  { label: 'Pledge Mechanism', kind: 'PPT', href: '/files/newtomarket/pledge_mechanism.pptx', desc: 'Step-by-step walkthrough of the depository pledge mechanism.' },
];

/** Described on the page rather than linked — both are arranged through the desk. */
export const GOLD_ROUTES = [
  { label: 'Sovereign Gold Bond (SGB)', desc: 'Government-backed bonds that track gold and pay interest — held in demat.' },
  { label: 'Gold ETFs', desc: 'Exchange-traded funds that track gold prices and trade like a share.' },
];

/*
 * One login. MCX Online Trading pointed at onlinetrading.kalpatarumulti.com,
 * which returns 404 — commodity trading runs through the same web terminal as
 * everything else, so it points there now.
 */
export const COMMODITY_LOGINS = [
  { label: 'MCX Online Trading', href: 'https://trading.kalpatarumulti.com:28001/' },
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
 * ACCOUNT OPENING — the two routes, step by step
 *
 * Audit point 12 (VRDK & Co, 14-Aug-2026): the site documented the online
 * eKYC route only, and the auditor asked for the offline procedure to be
 * published alongside it. Audit point 1 asks that the SARAL AOF be offered
 * together with the CDSL additional-information annexure and a nomination
 * form — see SARAL_AOF_NOTE below.
 * ------------------------------------------------------------------ */

export interface OpeningRoute {
  key: 'online' | 'offline';
  title: string;
  strap: string;
  steps: string[];
}

export const ACCOUNT_OPENING_ROUTES: OpeningRoute[] = [
  {
    key: 'online',
    title: 'Online — eKYC',
    strap: 'About 15 minutes, from anywhere.',
    steps: [
      'Open the eKYC account opening portal and enter your PAN and mobile number.',
      'Verify the one-time password sent to your mobile number and email ID.',
      'Complete Aadhaar-based eKYC and the in-person verification over video.',
      'Enter your bank details and upload a cancelled cheque or bank statement, along with your signature.',
      'Nominate — add a nominee, or record the opt-out declaration. One of the two is mandatory.',
      'E-sign the account opening form using the Aadhaar OTP.',
      'Your Unique Client Code and demat account are activated, usually within one working day.',
    ],
  },
  {
    key: 'offline',
    title: 'Offline — physical form',
    strap: 'At any of our Bhopal branches, or by post.',
    steps: [
      'Download and print the account opening and KYC forms, or collect a set from any branch.',
      'Fill the KYC form in your own handwriting, strike off every blank, and never sign an incomplete form.',
      'Attach self-attested copies of your PAN, Aadhaar or other address proof, a cancelled cheque or bank statement, and passport-size photographs.',
      'Complete in-person verification with our authorised official, who signs and stamps the IPV on the form.',
      'Submit the set along with the nomination form (SH-13) or the signed opt-out declaration.',
      'We upload your Unique Client Code to the exchange and hand you a copy of the completed documents within 7 days.',
    ],
  },
];

/**
 * The three documents that must be offered together with the SARAL AOF.
 *
 * `href: null` means the document has not been supplied for publication yet.
 * The page then renders it as an explicit "awaiting document" card rather than
 * dropping it silently, so the gap stays visible until the file arrives.
 */
export const SARAL_AOF_SET: { label: string; desc: string; href: string | null }[] = [
  {
    label: 'SARAL Account Opening Form — Resident Individuals',
    desc: 'The simplified AOF for resident individuals trading in the cash segment.',
    href: 'https://www.kalpatarumulti.com/files/download/SARAL_account_opening_Form_for_resident_individuals.pdf',
  },
  {
    label: 'Annexure — Additional information with SARAL AOF',
    desc: 'The additional information annexure prescribed by CDSL operating instructions, to be submitted with the SARAL AOF.',
    href: null,
  },
  {
    label: 'Form SH-13 — Nomination Form',
    desc: 'Mandatory with the SARAL AOF, unless the opt-out declaration is submitted instead.',
    href: 'https://www.kalpatarumulti.com/files/download/Nomination_Registration_Form_1.1_SH13_29.04.14_(1).pdf',
  },
  {
    label: 'Declaration for opting out of nomination',
    desc: 'Submit this instead of Form SH-13 if you choose not to nominate.',
    href: 'https://www.kalpatarumulti.com/files/download/NOMINEE_OPTION.pdf',
  },
];

/** Condition attached to the simplified SARAL account opening form (audit point 1). */
export const SARAL_AOF_NOTE =
  'Resident individuals who intend to trade only in the cash segment may use the simplified SARAL Account Opening Form. As per CDSL operating instructions, the SARAL AOF must be submitted together with the additional information annexure and a nomination form — or the signed declaration opting out of nomination. All three are listed below.';

/* ------------------------------------------------------------------ *
 * ACCOUNT SERVICES — online nomination, Re-KYC and account closure
 *
 * Published to close audit points 13 and 14 raised by VRDK & Co on
 * 14-Aug-2026: CDSL/SEBI expect an online nomination / Re-KYC facility and
 * an online closure facility to be linked from the website, and neither
 * could be found. Online closure is mandatory wherever account opening is
 * offered online.
 *
 * The portal URL for each service comes from SERVICE_PORTALS in lib/links.ts.
 * Where Kalpataru has not yet supplied a self-service URL, the page publishes
 * the documented digital route instead of a dead button, so the facility is
 * still available and auditable.
 * ------------------------------------------------------------------ */

export interface AccountService {
  key: 'nomination' | 'reKyc' | 'closure';
  title: string;
  summary: string;
  /** Depository-prescribed processing timeline, shown against the service. */
  timeline: string;
  /** Label for the button that opens SERVICE_PORTALS[key]. */
  portalLabel: string;
  /** Second route offered when the primary portal is not the back office. */
  altLabel?: string;
  steps: string[];
  forms: { label: string; href: string }[];
  desk: { person: string; role: string; email: string; phone: string };
}

const DP_DESK = {
  person: 'Mr. Manoj Gupta',
  role: 'DP Manager',
  email: 'dp@kalpatarumulti.com',
  phone: '0755-4350143',
};

export const ACCOUNT_SERVICES: AccountService[] = [
  {
    key: 'nomination',
    title: 'Online Nomination',
    summary:
      'Appoint, change or opt out of a nomination on your demat account at any time, free of charge. SEBI requires every demat account to carry either a registered nominee or a signed opt-out declaration — a nomination lets your heirs claim the securities without a court order.',
    timeline: 'Registered within 7 days of a complete request.',
    portalLabel: 'Update nomination in the Back Office',
    steps: [
      'Sign in to the back office with your client ID, or open the Re-KYC and modification portal.',
      'Choose Nomination, then add, change or opt out. Enter each nominee’s name, relationship, date of birth and percentage share.',
      'Authenticate with the OTP sent to the mobile number and email registered against your demat account, and e-sign the request.',
      'CDSL confirms the nomination against your demat account, and you receive the confirmation by email and SMS.',
    ],
    forms: [
      { label: 'Form SH-13 — Nomination Form', href: 'https://www.kalpatarumulti.com/files/download/Nomination_Registration_Form_1.1_SH13_29.04.14_(1).pdf' },
      { label: 'Form SH-14 — Cancellation or Variation of Nomination', href: 'https://www.kalpatarumulti.com/files/download/Form_No._SH_14_p.pdf' },
      { label: 'Declaration for opting out of nomination', href: 'https://www.kalpatarumulti.com/files/download/NOMINEE_OPTION.pdf' },
    ],
    desk: DP_DESK,
  },
  {
    key: 'reKyc',
    title: 'Re-KYC & Account Modification',
    summary:
      'Refresh your KYC and update the details held against your trading and demat account — address, mobile number, email ID, bank account, income range or signature. Keeping your own mobile number and email registered is what makes the exchange and depository alerts reach you directly.',
    timeline: 'Updated with the KRA and CKYCR within 10 days of a complete request.',
    portalLabel: 'Open the Back Office',
    steps: [
      'Sign in to the back office with your client ID, then open the modification request.',
      'Select the details you need to change and upload the supporting proof — an address proof, a cancelled cheque or a bank statement, as applicable.',
      'Authenticate with the OTP sent to your registered mobile and email, and complete the Aadhaar-based e-sign.',
      'We verify the request, update your records with the KRA and CKYCR, and confirm the change by email.',
    ],
    forms: [
      { label: 'Account Modification Form', href: '/files/download/modi.pdf' },
      { label: 'KYC Form for KRA', href: 'https://www.kalpatarumulti.com/files/download/Kyc_Form_New.pdf' },
      { label: 'Guide — Modifying your account', href: '/files/guides/demo-account-modification-online.pdf' },
    ],
    desk: {
      person: 'Mr. Vinod Singh',
      role: 'General Manager, Back Office',
      email: 'account@kalpatarumulti.com',
      phone: '0755-4350142',
    },
  },
  {
    key: 'closure',
    title: 'Online Account Closure',
    summary:
      'Close your trading and demat account online, whenever you choose. There is no charge for closing an account, and the refundable ₹2,600 component of the lifetime AMC is returned to your registered bank account. You may also transfer your holdings to another Depository Participant instead of selling them.',
    timeline: 'Closed within 7 days of a complete request.',
    portalLabel: 'Close your account in the Back Office',
    steps: [
      'Settle any outstanding dues, and either sell your holdings or transfer them to another demat account — closure cannot be completed while securities remain in the account.',
      'Submit the closure request from the back office, or send the signed Account Closure Request Form to the DP desk from your registered email ID.',
      'We verify the balances, dues and pending instructions on the account, and confirm the request by email and SMS.',
      'The account is closed within 7 days and the refundable AMC component is credited to your registered bank account.',
    ],
    forms: [
      { label: 'Account Closure Request Form', href: 'https://www.kalpatarumulti.com/files/download/ACCOUNT_CLOSURE_REQUEST_FORM.pdf' },
      { label: 'Guide — Closing your account', href: '/files/guides/how-to-close-account.pdf' },
    ],
    desk: DP_DESK,
  },
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
