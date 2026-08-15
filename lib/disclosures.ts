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
  { name: 'Vinod Singh', designation: 'Manager', mobile: '9329209605', email: 'stockvinodsingh@gmail.com' },
  { name: 'Amitabh Manya Jain', designation: 'Compliance Officer', mobile: '9425008895', email: 'kmlho@kalpatarumulti.com' },
  { name: 'Aditya Manya Jain', designation: 'Designated Director', mobile: '9826430536', email: 'kmlho@kalpatarumulti.com' },
  { name: 'Amitabh Manya Jain', designation: 'Designated Director', mobile: '9425008895', email: 'kmlho@kalpatarumulti.com' },
];

export interface ApEntry {
  name: string;
  city: string;
  /** Registered segments: C = Cash, F = F&O */
  segments: string[];
  regNo: string;
  regDate: string;
  status: 'Active' | 'Inactive';
  /** Registered place of business, as filed with the exchange. */
  address: string;
  pin: string;
  mobile: string;
}

/**
 * Address and mobile number added 15-Aug-2026 from the AP disclosure table on
 * kalpatarumulti.com/static/about-us.aspx, to satisfy the verification-sheet
 * requirement for "AP details with Contact and E-mail" — this build listed
 * only name, city, registration number and status.
 *
 * Two fields on the exchange table are deliberately NOT carried over:
 *   • PAN — personal sensitive data, and not part of the disclosure required.
 *   • The 8-digit landline column — several rows carry the placeholder
 *     "00000000", and the rest have no STD code, so the mobile number is the
 *     only contact that can be published truthfully.
 * The exchange record carries no email address for authorised persons; reach
 * them through the branch or the customer-care desk.
 */
export const AUTHORISED_PERSONS: ApEntry[] = [
  { name: 'Meera Saxena', city: 'Bhopal', segments: ['Cash', 'F&O'], regNo: 'AP2114000051', regDate: '30-Jun-2020', status: 'Active', address: 'Shop No. 4, G-2/114, Aishwarya Tower, Gulmohar Colony', pin: '462039', mobile: '9039421671' },
  { name: 'Monika Jain', city: 'Lalitpur', segments: ['Cash', 'F&O'], regNo: 'AP2114000061', regDate: '19-Jul-2021', status: 'Active', address: '17 Talabpura, Lalitpur', pin: '284403', mobile: '9415183899' },
  { name: 'Rajesh Jain', city: 'Sagar', segments: ['Cash', 'F&O'], regNo: 'AP2114000071', regDate: '07-Aug-2025', status: 'Active', address: 'Rukmani Complex, 1st Floor, Namak Mandi, Katra Bazar', pin: '470002', mobile: '9425636400' },
  { name: 'Anup Kumar Tamrakar', city: 'Lalitpur', segments: ['Cash', 'F&O'], regNo: 'AP2114000081', regDate: '03-Sep-2025', status: 'Active', address: '31 Civil Line, Lalitpur', pin: '284403', mobile: '9839484498' },
  { name: 'Alok Kumar Jain', city: 'Gadarwara', segments: ['Cash', 'F&O'], regNo: 'AP2114000091', regDate: '24-Sep-2025', status: 'Active', address: 'Near SBI, Kamath Ward, Gadarwara', pin: '487551', mobile: '9893701718' },
  { name: 'Alok Bhatt', city: 'Jabalpur', segments: ['Cash', 'F&O'], regNo: 'AP2114000101', regDate: '25-Sep-2025', status: 'Active', address: '401 Ranjhi Bazar, Main Road, Opp. Nana Bhai Travels, Ranjhi', pin: '482001', mobile: '9300107852' },
  { name: 'Swati Samaiya', city: 'Bina', segments: ['Cash', 'F&O'], regNo: 'AP2114000111', regDate: '23-Dec-2025', status: 'Active', address: 'In front of Decision Hotel, Khurai Road, Bina', pin: '470113', mobile: '7049592615' },
  { name: 'Ajay Chourasiya', city: 'Bhopal', segments: ['Cash'], regNo: 'AP2114000121', regDate: '09-Jan-2026', status: 'Active', address: 'H. No. 175, Phase 3, Shiv Nagar Colony, Vidisha Road, Sikandari Sarai, Huzur', pin: '462010', mobile: '9039666802' },
  { name: 'Kailash Kumar Paryani', city: 'Bhopal', segments: ['Cash', 'F&O'], regNo: 'AP2114000131', regDate: '10-Mar-2026', status: 'Active', address: '45 Minaal Shopping Mall, First Floor', pin: '462011', mobile: '7974521728' },
  { name: 'Hitendra Kumar Jain', city: 'Harda', segments: ['Cash', 'F&O'], regNo: 'AP2114000141', regDate: '25-Mar-2026', status: 'Active', address: 'Fakhruddin Ali Ahmad Ward, Ward No. 23, Station Road, Harda', pin: '461331', mobile: '9425045136' },
];
