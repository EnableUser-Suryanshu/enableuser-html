/**
 * SEBI's Annexure-I risk disclosures on derivatives.
 *
 * Shown as a dialog from the footer, the way the live site shows it, rather
 * than sending the reader straight to a 90-page SEBI study and hoping they
 * find the four findings that matter. The link to the study is inside the
 * dialog, which is where it belongs — as the source, not as the destination.
 *
 * The wording is SEBI's and is reproduced verbatim. It also appears on
 * /policies/disclaimer, which is generated from the previous site; if the two
 * ever disagree, that one is the record and this should be corrected to match.
 * Do not paraphrase either: this is a mandated disclosure.
 */

export const RISK_DISCLOSURE = {
  annexure: 'Annexure-I: Risk disclosures',
  heading: 'Risk disclosures on derivatives',
  findings: [
    '9 out of 10 individual traders in the equity Futures and Options Segment, incurred net losses.',
    'On an average, loss makers registered net trading losses close to ₹ 50,000.',
    'Over and above the net trading losses incurred, loss makers expended an additional 28% of net trading losses as transaction costs.',
    'Those making net trading profits, incurred between 15% to 50% of such profits as transaction cost.',
  ],
  source: {
    lead: 'Source',
    text:
      'SEBI study dated January 25, 2023 on “Analysis of Profit and Loss of Individual Traders dealing in equity Futures and Options (F&O) Segment”, wherein Aggregate Level findings are based on annual Profit/Loss incurred by individual traders in equity F&O during FY 2021-22.',
    href:
      'https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-of-individual-traders-dealing-in-equity-fando-segment_67525.html',
    label: 'Read the SEBI study',
  },
} as const;
