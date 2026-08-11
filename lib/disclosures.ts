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
}

export const AUTHORISED_PERSONS: ApEntry[] = [
  { name: 'Meera Saxena', city: 'Bhopal', segments: ['Cash', 'F&O'], regNo: 'AP2114000051', regDate: '30-Jun-2020', status: 'Active' },
  { name: 'Monika Jain', city: 'Lalitpur', segments: ['Cash', 'F&O'], regNo: 'AP2114000061', regDate: '19-Jul-2021', status: 'Active' },
  { name: 'Rajesh Jain', city: 'Sagar', segments: ['Cash', 'F&O'], regNo: 'AP2114000071', regDate: '07-Aug-2025', status: 'Active' },
  { name: 'Anup Kumar Tamrakar', city: 'Lalitpur', segments: ['Cash', 'F&O'], regNo: 'AP2114000081', regDate: '03-Sep-2025', status: 'Active' },
  { name: 'Alok Kumar Jain', city: 'Gadarwara', segments: ['Cash', 'F&O'], regNo: 'AP2114000091', regDate: '24-Sep-2025', status: 'Active' },
  { name: 'Alok Bhatt', city: 'Jabalpur', segments: ['Cash', 'F&O'], regNo: 'AP2114000101', regDate: '25-Sep-2025', status: 'Active' },
  { name: 'Swati Samaiya', city: 'Bina', segments: ['Cash', 'F&O'], regNo: 'AP2114000111', regDate: '23-Dec-2025', status: 'Active' },
  { name: 'Ajay Chourasiya', city: 'Bhopal', segments: ['Cash'], regNo: 'AP2114000121', regDate: '09-Jan-2026', status: 'Active' },
  { name: 'Kailash Kumar Paryani', city: 'Bhopal', segments: ['Cash', 'F&O'], regNo: 'AP2114000131', regDate: '10-Mar-2026', status: 'Active' },
  { name: 'Hitendra Kumar Jain', city: 'Harda', segments: ['Cash', 'F&O'], regNo: 'AP2114000141', regDate: '25-Mar-2026', status: 'Active' },
];
