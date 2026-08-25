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
  // NSE IX (NSE International Exchange) at GIFT City — US stocks from India.
  globalInvesting: 'https://trade.nseixga.com/login?kalpataru',
} as const;

/**
 * The three online account services CDSL/SEBI expect to be linked from the
 * website — raised as audit points 13 and 14 by VRDK & Co on 14-Aug-2026.
 *
 * These match how the live site (kalpatarumulti.com) actually implements them:
 * its "Account Closure" and "Account Modification" links both point at the
 * back office, and its Re-KYC tile points at the modification portal. There is
 * no separate nomination portal, so nomination runs through the back office
 * too — `/account-services` documents the form route alongside it.
 *
 * NOTE: re-kyc.kalpatarumulti.com resolves but times out on connection as of
 * 15-Aug-2026, on the live site as well as here. It is kept as the primary
 * Re-KYC link to match the live site, with the back office offered as the
 * working alternative. Confirm the host is reachable with the hosting vendor.
 */
export const SERVICE_PORTALS: Record<'nomination' | 'reKyc' | 'closure', string | null> = {
  nomination: PORTALS.backOfficeLogin,
  reKyc: PORTALS.reKyc,
  closure: PORTALS.backOfficeLogin,
};

const SITE = 'https://www.kalpatarumulti.com';

// Policy pages now live on this site (see lib/policies.ts). PDFs are mirrored
// under /public/files/pdf so nothing depends on the old host staying online.
export const POLICY_LINKS = {
  security: '/policies/security-policy',
  pmla: '/policies/pmla-policy',
  privacy: '/policies/privacy-policy',
  dormant: '/policies/dormant-policy',
  surveillance: '/policies/surveillance-policy',
  branchSupervision: '/policies/branch-supervision-policy',
  investorCharter: '/policies/investor-charter',
  investorCharterDepository: '/policies/investor-charter-depository',
  sebiComplaint: '/files/pdf/filing-complaints-on-scores.pdf',
  complaintProcess: '/files/pdf/investor-client-complaint-resolution-process.pdf',
  advisory: '/policies/advisory-for-investors',
  riskDisclosures:
    'https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-of-individual-traders-dealing-in-equity-fando-segment_67525.html',
  circulars: '/circulars',
  regulatory: '/policies/regulatory-disclosures',
  termsOfUse: '/policies/terms-of-use',
  termsConditions: '/policies/terms-and-conditions',
  disclaimer: '/policies/disclaimer',
  rms: '/policies/rms-policy',
  gtt: '/policies/gtt-policy',
} as const;

/** Policy destinations that are internal routes rather than external links. */
export const isInternalPolicy = (href: string) => href.startsWith('/');

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
  // Investor protection funds — the exchange links flagged dead in the
  // 16-Aug-2026 verification sheet. These replacements were checked live.
  investorProtectionNse:
    'https://www.nseindia.com/complaints/investor-protection-fund-trust',
  investorProtectionBse: 'https://www.bseindia.com/static/investors/services.aspx',
  // Client registration documents in vernacular languages (also flagged dead).
  kycVernacularNse:
    'https://www.nseindia.com/trade/members-client-registration-documents',
  kycVernacularMcx:
    'https://www.mcxindia.com/membership/members-compliance/vernacular-language',
  // Carried over from the live site (kalpatarumulti.com), where both are
  // published in the footer but were missing from this build.
  cdslEvoting: 'https://evoting.cdslindia.com/evoting/evotinglogin',
  nseClientCollateral:
    'https://investorhelpline.nseindia.com/ClientCollateral/welcomeCLUser',
  // NSE's check-trades / verify-IPO-bids tool.
  nseVerifyIpoBids: 'https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids',
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
