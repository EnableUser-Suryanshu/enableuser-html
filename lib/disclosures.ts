// Regulatory disclosure data, sourced from the published disclosures on
// kalpatarumulti.com (about-us page). Spellings normalised for consistency.

export interface KmpEntry {
  name: string;
  designation: string;
  mobile: string;
  email: string;
}

export const KMP: KmpEntry[] = [
  { name: 'Aditya Manya Jain', designation: 'Chief Executive Officer (CEO)', mobile: '9826430536', email: 'aditya@kalpatarumulti.com' },
  { name: 'Amitabh Manya Jain', designation: 'Managing Director (MD)', mobile: '9425008895', email: 'kmlho@kalpatarumulti.com' },
  { name: 'Vinod Singh', designation: 'General Manager', mobile: '9329209605', email: 'stockvinodsingh@gmail.com' },
  { name: 'Amitabh Manya Jain', designation: 'Compliance Officer', mobile: '9425008895', email: 'kmlho@kalpatarumulti.com' },
  { name: 'Aditya Manya Jain', designation: 'Designated Director', mobile: '9826430536', email: 'kmlho@kalpatarumulti.com' },
  { name: 'Amitabh Manya Jain', designation: 'Designated Director', mobile: '9425008895', email: 'kmlho@kalpatarumulti.com' },
];


/**
 * Authorised Persons, published in the column layout the exchange prescribes:
 * name, exchange-wise AP code, constitution, status, registered address
 * (address / city / state / PIN) and terminal details.
 *
 * Sources, kept distinct because they do not cover the same fields:
 *  • AP codes, terminal count and terminal-allotted flag — the client's own
 *    "Auth Person Export Data" sheet (13 rows), which is the exchange record.
 *  • Address, city, PIN, registration date and mobile for the first ten — the
 *    AP disclosure table previously published on kalpatarumulti.com.
 *  • Address, city and PIN for the three that appear only in the sheet, and
 *    `constitution` for all thirteen — supplied by the client 21-Sep-2026.
 *
 * Still not on record, and left null rather than guessed: registration date
 * and mobile number for those same three (AP2114000151, AP2114000171,
 * AP2114000161). This is a regulatory disclosure, and a plausible guess
 * published as fact is worse than a visible gap.
 *
 * NOTE ON `constitution`: the exchange's own column means the legal form of
 * the authorised person — Individual, Partnership Firm, LLP, Body Corporate.
 * The client supplied "India" for every row, which is a country rather than a
 * constitution, and it is published here as given rather than reinterpreted.
 * All thirteen are registered under personal names, so the value the exchange
 * almost certainly holds is "Individual". Worth confirming against the filing.
 *
 * ONE CORRECTION to the exchange column as supplied. Swati Samaiya's row
 * reads "NSE,SE,MCX". "SE" is not an exchange, and the same row carries a BSE
 * authorised person code (AP20260820170774), so it is published as BSE. Every
 * other row with a BSE code reads "NSE,BSE,MCX", which fits. Worth confirming,
 * but publishing "SE" on a regulatory disclosure was not an option.
 *
 * `state` is the one derived field, and it is read off the PIN code rather
 * than guessed from the city name: 461xxx / 462xxx / 470xxx / 482xxx / 487xxx
 * are Madhya Pradesh, 284xxx is Uttar Pradesh, 490xxx is Chhattisgarh. Every
 * one agrees with the city given alongside it.
 *
 * Two fields on the exchange table are deliberately not carried over: PAN, as
 * personal sensitive data outside the required disclosure, and the landline
 * column, where several rows hold the placeholder "00000000" and the rest
 * carry no STD code. The exchange record holds no email for an AP — reach
 * them through the branch or the customer-care desk.
 */

/** One AP code as the exchange issues them — one per exchange and segment. */
export interface ApCode {
  /** Short exchange-and-segment label, e.g. "NSE Cash & F&O", "BSE". */
  exchange: string;
  code: string;
}

export interface ApEntry {
  name: string;
  codes: ApCode[];
  /**
   * Exchanges the authorised person is registered on. Distinct from `codes`,
   * which only covers the exchanges that issue an AP code — MCX appears here
   * and nowhere else.
   */
  exchanges: string[];
  /** Individual / Partnership / Body Corporate. Null where not on record. */
  constitution: string | null;
  /** The exchange's own wording for an AP registration. */
  status: 'Approved' | 'Cancelled';
  address: string | null;
  city: string | null;
  state: string | null;
  pin: string | null;
  terminalAllotted: 'Y' | 'N';
  terminals: number;
  /** Retained from the earlier disclosure; not part of the NSE layout. */
  segments: string[];
  regDate: string | null;
  mobile: string | null;
}

const MP = 'Madhya Pradesh';
const UP = 'Uttar Pradesh';
const CG = 'Chhattisgarh';

export const AUTHORISED_PERSONS: ApEntry[] = [
  {
    name: 'Meera Saxena',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000051' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: 'Shop No. 4, G-2/114, Aishwarya Tower, Gulmohar Colony',
    city: 'Bhopal',
    state: MP,
    pin: '462039',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: '30-Jun-2020',
    mobile: '9039421671',
  },
  {
    name: 'Monika Jain',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000061' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: '17 Talabpura, Lalitpur',
    city: 'Lalitpur',
    state: UP,
    pin: '284403',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: '19-Jul-2021',
    mobile: '9415183899',
  },
  {
    name: 'Rajesh Jain',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000071' }, { exchange: 'BSE', code: 'AP20260103166431' }],
    exchanges: ['NSE', 'BSE', 'MCX'],
    constitution: 'India',
    status: 'Approved',
    address: 'Rukmani Complex, 1st Floor, Namak Mandi, Katra Bazar',
    city: 'Sagar',
    state: MP,
    pin: '470002',
    terminalAllotted: 'Y',
    terminals: 5,
    segments: ['Cash', 'F&O'],
    regDate: '07-Aug-2025',
    mobile: '9425636400',
  },
  {
    name: 'Anup Kumar Tamrakar',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000081' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: '31 Civil Line, Lalitpur',
    city: 'Lalitpur',
    state: UP,
    pin: '284403',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: '03-Sep-2025',
    mobile: '9839484498',
  },
  {
    name: 'Alok Kumar Jain',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000091' }, { exchange: 'BSE', code: 'AP20260820170799' }],
    exchanges: ['NSE', 'BSE', 'MCX'],
    constitution: 'India',
    status: 'Approved',
    address: 'Near SBI, Kamath Ward, Gadarwara',
    city: 'Gadarwara',
    state: MP,
    pin: '487551',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: '24-Sep-2025',
    mobile: '9893701718',
  },
  {
    name: 'Alok Bhatt',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000101' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: '401 Ranjhi Bazar, Main Road, Opp. Nana Bhai Travels, Ranjhi',
    city: 'Jabalpur',
    state: MP,
    pin: '482001',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: '25-Sep-2025',
    mobile: '9300107852',
  },
  {
    name: 'Swati Samaiya',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000111' }, { exchange: 'BSE', code: 'AP20260820170774' }],
    exchanges: ['NSE', 'BSE', 'MCX'],
    constitution: 'India',
    status: 'Approved',
    address: 'In front of Decision Hotel, Khurai Road, Bina',
    city: 'Bina',
    state: MP,
    pin: '470113',
    terminalAllotted: 'Y',
    terminals: 3,
    segments: ['Cash', 'F&O'],
    regDate: '23-Dec-2025',
    mobile: '7049592615',
  },
  {
    name: 'Ajay Chourasiya',
    codes: [{ exchange: 'NSE Cash', code: 'AP2114000121' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: 'H. No. 175, Phase 3, Shiv Nagar Colony, Vidisha Road, Sikandari Sarai, Huzur',
    city: 'Bhopal',
    state: MP,
    pin: '462010',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash'],
    regDate: '09-Jan-2026',
    mobile: '9039666802',
  },
  {
    name: 'Kailash Kumar Paryani',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000131' }, { exchange: 'BSE', code: 'AP20260219167278' }],
    exchanges: ['NSE', 'BSE', 'MCX'],
    constitution: 'India',
    status: 'Approved',
    address: '45 Minaal Shopping Mall, First Floor',
    city: 'Bhopal',
    state: MP,
    pin: '462011',
    terminalAllotted: 'Y',
    terminals: 3,
    segments: ['Cash', 'F&O'],
    regDate: '10-Mar-2026',
    mobile: '7974521728',
  },
  {
    name: 'Hitendra Kumar Jain',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000141' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: 'Fakhruddin Ali Ahmad Ward, Ward No. 23, Station Road, Harda',
    city: 'Harda',
    state: MP,
    pin: '461331',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: '25-Mar-2026',
    mobile: '9425045136',
  },
  {
    name: 'Akhilesh Narayan Saxena',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000151' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: 'Shop No. 2, Bhagat Singh Square, Karond',
    city: 'Bhopal',
    state: MP,
    pin: '462038',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: null,
    mobile: '9893032568',
  },
  {
    name: 'Ashish Jain',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000171' }],
    exchanges: ['NSE'],
    constitution: 'India',
    status: 'Approved',
    address: 'Shop No. 49-A, Market, Sector 10',
    city: 'Bhilai',
    state: CG,
    pin: '490006',
    terminalAllotted: 'Y',
    terminals: 1,
    segments: ['Cash', 'F&O'],
    regDate: null,
    mobile: '9425556747',
  },
  {
    name: 'Pankaj Chourasia',
    codes: [{ exchange: 'NSE Cash & F&O', code: 'AP2114000161' }, { exchange: 'BSE', code: 'AP20250731162884' }],
    exchanges: ['NSE', 'BSE', 'MCX'],
    constitution: 'India',
    status: 'Approved',
    address: '27, Noble Plaza, Zone-II, M.P. Nagar',
    city: 'Bhopal',
    state: MP,
    pin: '462011',
    terminalAllotted: 'Y',
    terminals: 2,
    segments: ['Cash', 'F&O'],
    regDate: null,
    mobile: '9425008895',
  },
];
