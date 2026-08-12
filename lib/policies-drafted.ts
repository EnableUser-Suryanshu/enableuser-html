// Pages that were NEVER published on the previous kalpatarumulti.com site —
// the old footer linked them to dead anchors. These are newly drafted from
// standard Indian broking practice plus this firm's own registration data.
//
// ⚠ They carry `draft: true`, which renders a review banner on the page.
// Compliance must review and sign off, then flip the flag to remove the banner.

import type { PolicyPage } from './policies';

export interface DraftedPolicy extends PolicyPage {
  draft: true;
}

export const DRAFTED_POLICIES: DraftedPolicy[] = [
  {
    slug: 'dormant-policy',
    title: 'Dormant Account Policy',
    group: 'compliance',
    draft: true,
    blurb:
      'When a trading or demat account is treated as dormant or inactive, how balances are handled, and how to reactivate it.',
    blocks: [
      { t: 'h', level: 2, text: 'Purpose' },
      { t: 'p', text: 'This policy sets out how Kalpataru Multiplier Ltd identifies, flags and reactivates trading and demat accounts that have remained unused for an extended period. It is framed in line with the requirements prescribed by SEBI and the exchanges for the treatment of inactive and dormant client accounts.' },

      { t: 'h', level: 2, text: 'When an account is treated as inactive' },
      { t: 'p', text: 'A trading account is classified as inactive where no trade has been executed in that account across any exchange or segment for a continuous period of twelve months. The period is counted from the date of the last executed trade, not from the date the account was opened.' },
      { t: 'li', text: 'No buy or sell transaction in the cash, derivatives, currency or commodity segment for twelve continuous months.' },
      { t: 'li', text: 'Accounts flagged as inactive are blocked for fresh order placement until they are reactivated.' },
      { t: 'li', text: 'A demat account with no debit transaction for a continuous period may separately be flagged in accordance with depository requirements.' },
      { t: 'li', text: 'Classification is applied at the client level and is reviewed periodically by the compliance team.' },

      { t: 'h', level: 2, text: 'Treatment of funds and securities' },
      { t: 'p', text: 'Marking an account inactive does not affect your ownership of any funds or securities. Your assets continue to belong to you and are not appropriated by the broker in any circumstance.' },
      { t: 'li', text: 'Any credit balance lying in an inactive account is settled back to the client’s registered bank account in accordance with the running account settlement policy.' },
      { t: 'li', text: 'Securities held in the demat account remain in the client’s own name with the depository and are not transferred out.' },
      { t: 'li', text: 'Corporate action benefits — dividends, bonus and rights entitlements — continue to accrue to the client as normal.' },
      { t: 'li', text: 'Statements of account continue to be despatched to the registered email address.' },

      { t: 'h', level: 2, text: 'Reactivating an account' },
      { t: 'p', text: 'Reactivation is a straightforward process and is not chargeable. Before an inactive account is re-enabled for trading, we are required to re-confirm your identity and refresh your KYC record where it has become outdated.' },
      { t: 'li', text: 'Submit a written or digitally signed reactivation request through the back office, email from your registered address, or at any branch.' },
      { t: 'li', text: 'Confirm that your KYC details — address, bank account, mobile number, email ID and income range — remain current, and update them where they do not.' },
      { t: 'li', text: 'Provide fresh proof of identity and address if your existing KYC record is incomplete or has expired.' },
      { t: 'li', text: 'Where required, complete re-KYC through the online re-KYC portal or in person at a branch.' },
      { t: 'p', text: 'Once the request and any supporting documents are verified, the account is ordinarily re-enabled within one working day and you will be notified on your registered mobile number and email address.' },

      { t: 'h', level: 2, text: 'Records and review' },
      { t: 'p', text: 'Records of accounts flagged inactive, the balances settled and the reactivation requests received are maintained by the compliance team and are available for inspection by SEBI, the exchanges and the depository. This policy is reviewed periodically and whenever the underlying regulatory requirements change.' },

      { t: 'h', level: 2, text: 'Questions' },
      { t: 'p', text: 'For any question about the status of your account or to begin reactivation, contact the compliance desk on 0755-4350141-143 or write to kmlho@kalpatarumulti.com.' },
    ],
  },

  {
    slug: 'regulatory-disclosures',
    title: 'Regulatory Disclosures',
    group: 'legal',
    draft: true,
    blurb:
      'Our registrations, memberships, key personnel and the escalation route for investor grievances, in one place.',
    blocks: [
      { t: 'h', level: 2, text: 'Registration and membership' },
      { t: 'p', text: 'Kalpataru Multiplier Ltd is a SEBI-registered stock broker and a CDSL Depository Participant, holding memberships across the equity, derivatives, currency and commodity segments.' },
      {
        t: 'table',
        rows: [
          [{ head: true, text: 'Particulars' }, { head: true, text: 'Registration / ID' }],
          [{ head: false, text: 'SEBI Registration Number' }, { head: false, text: 'INZ000259437' }],
          [{ head: false, text: 'BSE Member ID' }, { head: false, text: '3016' }],
          [{ head: false, text: 'NSE Member ID' }, { head: false, text: '11152' }],
          [{ head: false, text: 'MCX Member ID' }, { head: false, text: '16020' }],
          [{ head: false, text: 'CDSL DP-ID' }, { head: false, text: '12031600' }],
          [{ head: false, text: 'CDSL DP Registration' }, { head: false, text: 'IN-DP-CDSL-221-2003' }],
        ],
      },

      { t: 'h', level: 2, text: 'Key managerial personnel' },
      { t: 'p', text: 'The following officials are designated under SEBI and exchange requirements. Full contact details for each, along with the list of registered authorised persons, are published on our About page.' },
      {
        t: 'table',
        rows: [
          [{ head: true, text: 'Designation' }, { head: true, text: 'Name' }, { head: true, text: 'Contact' }],
          [{ head: false, text: 'Chief Executive Officer' }, { head: false, text: 'Aditya Manya Jain' }, { head: false, text: 'aditya@kalpatarumulti.com' }],
          [{ head: false, text: 'Managing Director' }, { head: false, text: 'Amitabh Manya Jain' }, { head: false, text: 'kmlho@kalpatarumulti.com' }],
          [{ head: false, text: 'Compliance Officer' }, { head: false, text: 'Amitabh Manya Jain' }, { head: false, text: '9425008895 · kmlho@kalpatarumulti.com' }],
          [{ head: false, text: 'Designated Director' }, { head: false, text: 'Aditya Manya Jain' }, { head: false, text: 'kmlho@kalpatarumulti.com' }],
          [{ head: false, text: 'Designated Director' }, { head: false, text: 'Amitabh Manya Jain' }, { head: false, text: 'kmlho@kalpatarumulti.com' }],
        ],
      },

      { t: 'h', level: 2, text: 'Registered and corporate offices' },
      { t: 'p', text: 'Registered Office — "Kalpataru House", 18 Itwara, Bhopal (MP) 462001. Telephone 0755-2530536, 2739822, 4262655.' },
      { t: 'p', text: 'Corporate Office — Hall No. 2, 1st Floor Western Block, Above Central Bank, GTB Complex, T. T. Nagar, Bhopal 462003. Telephone 0755-4350141-143 and 0755-4283016.' },

      { t: 'h', level: 2, text: 'Investor grievance escalation' },
      { t: 'p', text: 'If you have a complaint, please raise it with us first so that we can resolve it directly. If you are not satisfied with the outcome, you may escalate it to the exchange or to SEBI through the channels below.' },
      { t: 'li', text: 'Step 1 — Write to our customer care desk or call 0755-4350141-143 during market hours.' },
      { t: 'li', text: 'Step 2 — Escalate to the Compliance Officer at kmlho@kalpatarumulti.com or 9425008895.' },
      { t: 'li', text: 'Step 3 — Lodge a complaint on SEBI SCORES at scores.sebi.gov.in, or with the relevant exchange investor grievance cell.' },
      { t: 'li', text: 'Step 4 — Refer the dispute to the SMART ODR portal at smartodr.in for online conciliation and arbitration.' },
      { t: 'p', text: 'Our monthly and annual complaint disposal data is published on the Investor Charter page. Guidance on filing a SCORES complaint and our internal complaint resolution process are available as downloads on the Circulars page.' },

      { t: 'h', level: 2, text: 'Statutory notices' },
      { t: 'li', text: 'Investments in the securities market are subject to market risk. Read all related documents carefully before investing.' },
      { t: 'li', text: 'Prevent unauthorised transactions in your account — update your mobile number and email ID with us and with the depository so that you receive alerts directly from the exchange and CDSL.' },
      { t: 'li', text: 'KYC is a one-time exercise across the securities market. Once completed through any SEBI-registered intermediary, it need not be repeated elsewhere.' },
      { t: 'li', text: 'We do not offer any assured, guaranteed or fixed return on investment, and no employee or authorised person is permitted to promise one.' },
      { t: 'li', text: 'Never share your trading password, transaction password or OTP with anyone, including our own staff.' },
    ],
  },

  {
    slug: 'terms-of-use',
    title: 'Terms of Use',
    group: 'legal',
    draft: true,
    blurb:
      'The terms governing your use of this website, its market data and the online services linked from it.',
    blocks: [
      { t: 'h', level: 2, text: 'Acceptance of these terms' },
      { t: 'p', text: 'This website is owned and operated by Kalpataru Multiplier Ltd. By accessing or using the site you agree to these Terms of Use. If you do not accept them, please do not use the site. We may revise these terms from time to time, and continued use of the site after a revision constitutes acceptance of the revised terms.' },

      { t: 'h', level: 2, text: 'Permitted use' },
      { t: 'li', text: 'You may use this site for your own personal, non-commercial information and to access services for which you are a registered client.' },
      { t: 'li', text: 'You may not copy, republish, scrape, mirror or redistribute any part of the site for commercial purposes without our written consent.' },
      { t: 'li', text: 'You may not attempt to gain unauthorised access to any part of the site, any account that is not yours, or any connected system or network.' },
      { t: 'li', text: 'You may not use automated tools to place load on the site or its data endpoints in a manner that degrades service for other users.' },
      { t: 'li', text: 'You may not use the site for any unlawful purpose or in breach of any applicable securities law or exchange regulation.' },

      { t: 'h', level: 2, text: 'Market data' },
      { t: 'p', text: 'Index levels, quotes, gainers and losers, and other market statistics shown on this site are sourced from the exchanges and third-party feeds. This data is provided for general information only. It may be delayed, may be subject to revision by the source, and must not be relied upon for trading decisions or as a substitute for the official records of the exchange.' },
      { t: 'li', text: 'Data is presented on an "as available" basis with no guarantee of accuracy, completeness or timeliness.' },
      { t: 'li', text: 'We are not liable for any loss arising from reliance on data displayed on this site.' },
      { t: 'li', text: 'The official record of any trade is the contract note and the ledger in your back office, not any figure displayed on this website.' },

      { t: 'h', level: 2, text: 'No investment advice' },
      { t: 'p', text: 'Nothing on this site constitutes investment advice, a research recommendation, or an offer or solicitation to buy or sell any security. Content is general in nature and does not take account of your particular objectives, financial situation or needs. You should take independent advice where appropriate before acting.' },

      { t: 'h', level: 2, text: 'Account credentials' },
      { t: 'p', text: 'Where you access a trading, back office, mutual fund or re-KYC portal linked from this site, you are responsible for maintaining the confidentiality of your login credentials and for all activity carried out under them. Notify us immediately if you suspect any unauthorised use. We will never ask you for your password or OTP.' },

      { t: 'h', level: 2, text: 'Third-party links' },
      { t: 'p', text: 'This site links to external destinations including the exchanges, SEBI, CDSL, the SMART ODR portal and our own hosted trading platforms. We do not control third-party sites and are not responsible for their content, availability or privacy practices. A link does not imply endorsement.' },

      { t: 'h', level: 2, text: 'Intellectual property' },
      { t: 'p', text: 'The Kalpataru name and logo, and the design, text and graphics of this site, belong to Kalpataru Multiplier Ltd except where content is reproduced from a regulator or exchange. Regulatory circulars and forms published here remain the property of their issuing body.' },

      { t: 'h', level: 2, text: 'Availability and limitation of liability' },
      { t: 'p', text: 'We aim to keep this site available at all times but do not warrant uninterrupted or error-free operation. Access may be suspended for maintenance, or interrupted by events outside our control including network failure. To the extent permitted by law, we exclude liability for any indirect or consequential loss arising from use of, or inability to use, this site.' },

      { t: 'h', level: 2, text: 'Governing law' },
      { t: 'p', text: 'These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts at Bhopal, Madhya Pradesh, without prejudice to the arbitration and dispute resolution mechanisms prescribed by SEBI and the exchanges for client disputes.' },

      { t: 'h', level: 2, text: 'Contact' },
      { t: 'p', text: 'Questions about these terms may be sent to kmlho@kalpatarumulti.com or raised on 0755-4350141-143.' },
    ],
  },

  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    group: 'legal',
    draft: true,
    blurb:
      'The commercial terms on which we open and operate trading, demat and mutual fund accounts, including charges.',
    blocks: [
      { t: 'h', level: 2, text: 'Scope' },
      { t: 'p', text: 'These Terms & Conditions apply to the accounts and services offered by Kalpataru Multiplier Ltd. They supplement, and do not replace, the SEBI-prescribed Rights and Obligations document, the Risk Disclosure Document and the Tariff Sheet signed at the time of account opening. Where there is any inconsistency, the SEBI-prescribed documents prevail.' },

      { t: 'h', level: 2, text: 'Account opening and charges' },
      { t: 'p', text: 'Trading and demat account opening is free. Charges applicable to the 3-in-1 account are set out below and in the tariff sheet.' },
      { t: 'li', text: 'There is no account opening fee for a trading account or a demat account.' },
      { t: 'li', text: 'A one-time ₹3,125 lifetime AMC applies to the 3-in-1 account, of which ₹2,600 is refunded when the account is closed.' },
      { t: 'li', text: 'Brokerage is charged at the rates agreed in the tariff sheet and is reflected in the contract note for each trade.' },
      { t: 'li', text: 'Statutory charges and levies — STT/CTT, exchange transaction charges, SEBI turnover fees, stamp duty and GST — are charged at prevailing rates and are outside our control.' },
      { t: 'li', text: 'Depository transaction charges apply on debit of securities from the demat account as per the tariff sheet.' },
      { t: 'li', text: 'Charges are subject to revision on prior notice sent to your registered email address.' },

      { t: 'h', level: 2, text: 'Eligibility and KYC' },
      { t: 'li', text: 'Accounts are opened only for persons competent to contract under Indian law and after completion of KYC.' },
      { t: 'li', text: 'PAN, Aadhaar linked to your mobile number, bank proof and a signature image are required for digital eKYC.' },
      { t: 'li', text: 'You must keep your address, bank account, mobile number, email ID and income range current, and inform us promptly of any change.' },
      { t: 'li', text: 'We may decline to open, or may close, an account where KYC is incomplete or where required by law or regulation.' },

      { t: 'h', level: 2, text: 'Trading and settlement' },
      { t: 'li', text: 'Orders are accepted subject to the risk management policy, applicable margins and exposure limits in force at the time.' },
      { t: 'li', text: 'We may decline, restrict or square off positions in accordance with the RMS Policy, including where margin is insufficient.' },
      { t: 'li', text: 'Pay-in of funds and securities must be met by the prescribed settlement deadline.' },
      { t: 'li', text: 'Contract notes and ledgers are issued in the back office and are the definitive record of your transactions.' },
      { t: 'li', text: 'Funds lying in your account are settled periodically in accordance with the running account settlement preference you have given.' },

      { t: 'h', level: 2, text: 'Securities held in your name' },
      { t: 'p', text: 'Securities you buy are credited to your own CDSL demat account under DP-ID 12031600 and remain in your name at all times. They are never held in the broker’s name. Pledging of securities for margin is done only against your specific authorisation through the depository’s margin pledge mechanism.' },

      { t: 'h', level: 2, text: 'Mutual fund investments' },
      { t: 'li', text: 'We act as a distributor of mutual fund schemes and not as an investment adviser.' },
      { t: 'li', text: 'Scheme returns are not guaranteed and past performance does not indicate future performance.' },
      { t: 'li', text: 'Read the scheme information document and key information memorandum before investing.' },

      { t: 'h', level: 2, text: 'Account closure' },
      { t: 'li', text: 'You may close your account at any time once dues are settled and holdings are transferred out or sold.' },
      { t: 'li', text: 'Closure can be completed digitally through the back office or in person at a branch.' },
      { t: 'li', text: 'The refundable component of the lifetime AMC is returned to your registered bank account on closure.' },
      { t: 'li', text: 'We may close or suspend an account on notice where required by law, regulation or the risk management policy.' },

      { t: 'h', level: 2, text: 'Grievances' },
      { t: 'p', text: 'Complaints may be raised with our customer care desk and escalated to the Compliance Officer at kmlho@kalpatarumulti.com. Unresolved complaints may be taken to the exchange, to SEBI SCORES, or to the SMART ODR portal, as set out on the Regulatory Disclosures page.' },

      { t: 'h', level: 2, text: 'Governing law' },
      { t: 'p', text: 'These terms are governed by Indian law and by the bye-laws, rules and regulations of SEBI, the exchanges and the depository. Disputes are subject to the dispute resolution mechanism prescribed by SEBI and the relevant exchange.' },
    ],
  },
];
