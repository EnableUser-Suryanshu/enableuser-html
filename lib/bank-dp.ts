// Client bank and depository account details, transcribed from the current
// live site (kalpatarumulti.com/static/our-bank-dp.aspx).
//
// Deliberately NOT carried over from the old page, per the Kalpataru team:
//   • the whole "Early Pay-in A/C Details" table
//   • the BSE CM / NSDL pool account (CM-BP-ID IN630168)

export interface BankAccount {
  bank: string;
  account: string;
  ifsc: string;
  type: string;
  /** Nature-of-account code as filed with the exchanges. */
  nature: string;
}

export interface DpAccount {
  segment: string;
  dp: 'CDSL' | 'NSDL';
  account: string;
}

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bank: 'Bank Of India',
    account: '900020110000161',
    ifsc: 'BKID0009000',
    type: 'Current Account',
    nature: 'USCNBA',
  },
  {
    bank: 'ICICI Bank Ltd',
    account: '005505011525',
    ifsc: 'ICIC0000055',
    type: 'Current Account',
    nature: 'USCNBA',
  },
  {
    bank: 'State Bank Of India',
    account: '30317028786',
    ifsc: 'SBIN0030003',
    type: 'Current Account',
    nature: 'USCNBA',
  },
];

export const DP_POOL: DpAccount[] = [
  { segment: 'BSE CM', dp: 'CDSL', account: '1203160000074299' },
  { segment: 'NSE CM', dp: 'CDSL', account: '1203160000207060' },
  { segment: 'NSE CM', dp: 'NSDL', account: 'CM-BP-ID IN514478' },
];

export const MARGIN_PLEDGE: DpAccount[] = [
  { segment: 'NSECM / NSEFO / BSECM', dp: 'CDSL', account: '1203160000329706' },
  { segment: 'COMMODITY', dp: 'CDSL', account: '1203160000346601' },
];
