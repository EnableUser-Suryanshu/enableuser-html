// Circulars and downloadable documents, mirrored from the previous site's
// circular.aspx page. The PDFs themselves are served from /public/files/pdf
// so the new site does not depend on the old host staying up.

export interface CircularDoc {
  title: string;
  /** Short line explaining what the document covers. */
  note: string;
  file: string;
  /** Approximate size in KB, shown next to the download link. */
  kb: number;
  /** Issuing body, shown as a chip. */
  source: string;
}

export interface CircularGroup {
  key: string;
  label: string;
  blurb: string;
  docs: CircularDoc[];
}

export const CIRCULAR_GROUPS: CircularGroup[] = [
  {
    key: 'regulatory',
    label: 'Regulatory Circulars',
    blurb: 'Circulars issued by SEBI and the depositories that affect how you trade and hold securities.',
    docs: [
      {
        title: 'Master Circular for Online Resolution of Disputes in the Indian Securities Market',
        note: 'SEBI’s consolidated framework for resolving investor disputes through the SMART ODR portal.',
        file: '/files/pdf/sebi-master-circular-online-resolution-of-disputes.pdf',
        kb: 538,
        source: 'SEBI',
      },
      {
        title: 'Mandatory updation of certain attributes of KYC of clients (DP-152)',
        note: 'CDSL communique on the KYC attributes every demat account holder must keep current.',
        file: '/files/pdf/cdsl-dp-152-kyc-attributes-updation.pdf',
        kb: 152,
        source: 'CDSL',
      },
    ],
  },
  {
    key: 'policies',
    label: 'Policies & Procedures',
    blurb: 'Our own published policies governing dealings between Kalpataru Multiplier Ltd and its clients.',
    docs: [
      {
        title: 'Policies and Procedures',
        note: 'The consolidated policies and procedures document for the current year.',
        file: '/files/pdf/policies-and-procedures.pdf',
        kb: 193,
        source: 'Kalpataru',
      },
      {
        title: 'Procedure for Voluntary Freeze / Block of Online Access to Trading Account',
        note: 'How to voluntarily freeze or block online access to your trading account, and how to unblock it.',
        file: '/files/pdf/voluntary-freeze-block-trading-account.pdf',
        kb: 271,
        source: 'Kalpataru',
      },
    ],
  },
  {
    key: 'complaints',
    label: 'Investor Complaints',
    blurb: 'How to escalate a grievance, and the route a complaint takes once it is lodged.',
    docs: [
      {
        title: 'Filing Complaints on SCORES',
        note: 'Step-by-step guidance on lodging a complaint through SEBI’s SCORES portal.',
        file: '/files/pdf/filing-complaints-on-scores.pdf',
        kb: 197,
        source: 'SEBI',
      },
      {
        title: 'Investor / Client Complaint Resolution Process',
        note: 'The internal escalation matrix and timelines we follow when resolving a complaint.',
        file: '/files/pdf/investor-client-complaint-resolution-process.pdf',
        kb: 651,
        source: 'Kalpataru',
      },
    ],
  },
];

export const ALL_CIRCULARS = CIRCULAR_GROUPS.flatMap((g) => g.docs);
