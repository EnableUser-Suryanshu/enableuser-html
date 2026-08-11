// Central place for every external destination used on the site.
// Portal URLs supplied by the Kalpataru team; the rest come from the
// current live website (kalpatarumulti.com).

export const PORTALS = {
  ekycAccountOpening:
    'https://kml-backoffice.kalpatarumulti.com/ekyc/ekycaccountopening',
  backOfficeLogin: 'https://kml-backoffice.kalpatarumulti.com/Account/Login',
  webTrading: 'https://trading.kalpatarumulti.com:28001/',
  mutualFund: 'https://mf.kalpatarumulti.com/login',
  reKyc:
    'https://re-kyc.kalpatarumulti.com/v1/company/kalpatarumulti/modification/login',
} as const;

const SITE = 'https://www.kalpatarumulti.com';

export const POLICY_LINKS = {
  security: `${SITE}/static/security-policy.aspx`,
  pmla: `${SITE}/static/pmla-policies.aspx`,
  privacy: `${SITE}/static/privacy-policy.aspx`,
  dormant: '#', // not published on the current site yet
  surveillance: `${SITE}/static/surveillance-policy.aspx`,
  branchSupervision: `${SITE}/static/branch-supervision-policy.aspx`,
  investorCharter: `${SITE}/static/investorcharter-stockbroker.aspx`,
  sebiComplaint: `${SITE}/files/pdf/Filing-Complaints-on-SCORES.pdf`,
  complaintProcess: `${SITE}/files/pdf/investor-Client-Complaint-Resolution-Process.pdf`,
  advisory: `${SITE}/static/advisory-investors.aspx`,
  riskDisclosures:
    'https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-of-individual-traders-dealing-in-equity-fando-segment_67525.html',
  circulars: `${SITE}/static/circular.aspx`,
  regulatory: '#',
  termsOfUse: '#',
  termsConditions: '#',
  disclaimer: `${SITE}/static/disclaimer.aspx`,
  rms: `${SITE}/static/rmspolicy.aspx`,
  gtt: `${SITE}/static/gttpolicy.aspx`,
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/kalpatarumultiplerltd',
  instagram: 'https://www.instagram.com/kalpataru_multiplier_ltd/',
  twitter: 'https://twitter.com/kalpataru_multi',
  linkedin: 'https://www.linkedin.com/in/kalpataru-multiplier-ltd-648b18101/',
} as const;

export const APP_LINKS = {
  android: 'https://play.google.com/store/apps/details?id=com.saral_info.moneymakerapi.kalpataru',
  ios: 'https://apps.apple.com/us/app/kalpataru-share-trade/id6760214498',
} as const;

export const REGULATOR_LINKS = {
  smartOdr: 'https://smartodr.in/login',
  sebiScores: 'https://scores.sebi.gov.in/',
  exchangeGrievance: 'https://investorhelpline.nseindia.com/NICEPLUS/',
  nse: 'https://www.nseindia.com/',
  bse: 'https://www.bseindia.com/',
  mcx: 'https://www.mcxindia.com/',
  cdsl: 'https://www.cdslindia.com/',
  sebi: 'https://www.sebi.gov.in/',
} as const;

export const MAPS = {
  corporateBhopal:
    'https://maps.google.com/?q=Kalpataru+Multiplier+GTB+Complex+TT+Nagar+Bhopal',
  headOffice:
    'https://maps.google.com/?q=Kalpataru+House+18+Itwara+Bhopal',
  whatsapp: 'https://wa.me/917648983065',
  whatsappAlt: 'https://wa.me/919589754231',
} as const;

/** Attributes for links that leave the site. */
export const EXT = { target: '_blank', rel: 'noopener' } as const;
