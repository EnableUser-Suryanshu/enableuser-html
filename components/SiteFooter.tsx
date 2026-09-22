import Link from 'next/link';
import { MEMBER_DETAILS } from '@/lib/data';
import { siteDocumentUrl } from '@/lib/site-documents';
import {
  APP_LINKS, MAPS, POLICY_LINKS, REGULATOR_LINKS, SOCIAL_LINKS, EXT, isInternalPolicy,
} from '@/lib/links';
import {
  Facebook, Instagram, XTwitter, LinkedIn, Target, OfficeBuilding,
  Phone, Mail, Person, Map, Pencil, ListCheck, Bank, Handshake, Headset, Download, IdCard,
  Calculator,
} from './icons';

/**
 * Links the live site singles out with a filled box, because they are the ones
 * an investor is most often sent to look for. Marked rather than reordered, so
 * each stays in the group it belongs to; the styling is this site's own —
 * a tinted chip — rather than a copy of the navy blocks.
 */
const FEATURED = new Set([
  'Advisory for Investor',
  'Risk Disclosures on Derivatives',
  'Shareholder e-Voting (CDSL)',
  'Client Collateral Data (NSE)',
  'Procedure for Voluntary Freeze / Block of Online Access',
  'Circulars',
]);

/**
 * Marker for a link whose file lives in Sanity. The column table is static, so
 * the entry carries this instead of a URL and the real one is swapped in when
 * the footer renders. Keeps the link in its published position rather than
 * pushing it to the end of the column.
 */
const SITE_DOC_HREF = 'sanity:investor-complaint-process';

const POLICY_COLUMNS = [
  {
    heading: 'Compliance & Policies',
    links: [
      ['Security Policy', POLICY_LINKS.security],
      ['PMLA Policy', POLICY_LINKS.pmla],
      ['Privacy Policy', POLICY_LINKS.privacy],
      ['Dormant Policy', POLICY_LINKS.dormant],
      ['Surveillance Policy', POLICY_LINKS.surveillance],
      ['Branch Supervision Policy', POLICY_LINKS.branchSupervision],
      ['RMS Policy', POLICY_LINKS.rms],
      ['GTT Policy', POLICY_LINKS.gtt],
    ],
  },
  {
    heading: 'Investor Relations',
    links: [
      ['Investor Charter — Stock Broker', POLICY_LINKS.investorCharter],
      ['Investor Charter — Depository Participant', POLICY_LINKS.investorCharterDepository],
      ['Sebi Complaint', POLICY_LINKS.sebiComplaint],
      // Resolved from Sanity at request time — see SITE_DOC_HREF below.
      ['Investor/Client Complaint Process', SITE_DOC_HREF],
      ['Advisory for Investor', POLICY_LINKS.advisory],
      ['Risk Disclosures on Derivatives', POLICY_LINKS.riskDisclosures],
      ['Shareholder e-Voting (CDSL)', REGULATOR_LINKS.cdslEvoting],
      ['Client Collateral Data (NSE)', REGULATOR_LINKS.nseClientCollateral],
      ['Procedure for Voluntary Freeze / Block of Online Access', POLICY_LINKS.voluntaryFreeze],
      ['Investor Protection Fund — NSE', REGULATOR_LINKS.investorProtectionNse],
      ['Investor Protection — BSE', REGULATOR_LINKS.investorProtectionBse],
      ['KYC Documents in Vernacular Languages — NSE', REGULATOR_LINKS.kycVernacularNse],
      ['Vernacular Language Documents — MCX', REGULATOR_LINKS.kycVernacularMcx],
    ],
  },
  {
    heading: 'Legal & Governance',
    links: [
      ['Circulars', POLICY_LINKS.circulars],
      ['Regulatory', POLICY_LINKS.regulatory],
      ['Terms of Use', POLICY_LINKS.termsOfUse],
      ['Terms & Conditions', POLICY_LINKS.termsConditions],
      ['Disclaimer', POLICY_LINKS.disclaimer],
    ],
  },
] as const;

export default async function SiteFooter() {
  /*
    Served from Sanity so compliance can replace the PDF without a deployment.
    Everything else in these columns is a policy page or a regulator's own
    site, neither of which we host; this is the one file of ours a fixed link
    points at. Falls back to the copy in the repo if Sanity is unreachable.
  */
  const complaintProcess = await siteDocumentUrl('investor-complaint-process');

  return (
    <footer className="footer">
      <div className="container">
        <div className="f-top">
          <div className="f-brand">
            <div className="row">
              <img src="/assets/logo.png" alt="Kalpataru Multiplier Ltd logo" />
              <div>
                <div className="brand-name">Kalpataru</div>
                <div className="brand-tag">Multiplier Ltd</div>
              </div>
            </div>
            <p className="f-desc">
              Kalpataru is a wishful Divine Tree and in present context a widely Trusted,
              Time tested and Transparent Share Broker, Mutual Fund Distributor and D.P.
              of Central India.
            </p>
            <div className="f-label">Mobile Trading Apps</div>
            <div className="f-apps">
              <a href={APP_LINKS.android} {...EXT} className="store-badge play">
                <img src="/assets/badges/google-play.png" alt="Get it on Google Play" loading="lazy" />
              </a>
              <a href={APP_LINKS.ios} {...EXT} className="store-badge">
                <img src="/assets/badges/app-store.svg" alt="Download on the App Store" loading="lazy" />
              </a>
            </div>
            <div className="f-label">Connect With Us</div>
            <div className="f-social">
              <a href={SOCIAL_LINKS.facebook} {...EXT} aria-label="Facebook"><Facebook /></a>
              <a href={SOCIAL_LINKS.instagram} {...EXT} aria-label="Instagram"><Instagram /></a>
              <a href={SOCIAL_LINKS.twitter} {...EXT} aria-label="X (Twitter)"><XTwitter /></a>
              <a href={SOCIAL_LINKS.linkedin} {...EXT} aria-label="LinkedIn"><LinkedIn /></a>
            </div>
          </div>
          <div>
            <div className="branch-head">
              <Target size={20} /> Our Branches are Our Strength
            </div>
            <div className="branches">
              <div className="bcard">
                <div className="bh"><OfficeBuilding size={19} strokeW={1.9} /> Corporate Office</div>
                <address>
                  Hall No. 2, 1st Floor Western Block, Above Central Bank, GTB Complex,
                  T. T. Nagar, Bhopal-462003
                </address>
                <div className="meta">
                  <span>
                    <Phone size={15} strokeW={1.8} />
                    <a href="tel:07554350141" style={{ textDecoration: 'underline' }}>0755-4350141-143</a>,&nbsp;
                    <a href="tel:07554283016" style={{ textDecoration: 'underline' }}>0755-4283016</a>
                  </span>
                  <span><Mail size={15} strokeW={1.8} /> kmlho@kalpatarumulti.com</span>
                  <span><Person size={15} strokeW={1.8} /> Amitabh Manya Jain</span>
                </div>
                <a href={MAPS.corporateBhopal} {...EXT} className="link-red loc">
                  <Map size={15} strokeW={1.8} /> View Location
                </a>
              </div>
              <div className="bcard">
                <div className="bh"><OfficeBuilding size={19} strokeW={1.9} /> Head Office (Regd.)</div>
                <address>
                  &quot;Kalpataru House&quot;, 18 Itwara, Bhopal (MP) - 462001
                </address>
                <div className="meta">
                  <span><Phone size={15} strokeW={1.8} /> 0755-2530536, 2739822, 4262655</span>
                  <span><Mail size={15} strokeW={1.8} /> kml01@kalpatarumulti.com</span>
                  <span><Person size={15} strokeW={1.8} /> Aditya Manya Jain (Chairman)</span>
                </div>
                <a href={MAPS.headOffice} {...EXT} className="link-red loc">
                  <Map size={15} strokeW={1.8} /> View Location
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="f-mid">
          <div>
            <h2>Important Policies &amp; Disclosures</h2>
            <div className="policy-cols">
              {POLICY_COLUMNS.map((col) => (
                <div key={col.heading}>
                  <h3>{col.heading}</h3>
                  {col.links.map(([label, href]) => {
                    const to = href === SITE_DOC_HREF ? complaintProcess : href;
                    const cls = FEATURED.has(label) ? 'pol-hi' : undefined;
                    // policy pages route in-app; PDFs and regulator links open in a new tab
                    return isInternalPolicy(to) && !to.endsWith('.pdf')
                      ? <Link key={label} href={to} className={cls}>{label}</Link>
                      : <a key={label} href={to} className={cls} {...EXT}>{label}</a>;
                  })}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>Member Details &amp; Registration</h2>
            <div className="member-card">
              {MEMBER_DETAILS.map((m) => (
                <div className="member-row" key={m.label}>
                  <span>{m.label}</span>
                  <span className="v">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grievance">
          <h2>Quick Links</h2>
          <div className="g-row" style={{ marginBottom: 34 }}>
            <Link href="/account-services" className="gbtn">
              <IdCard size={20} strokeW={1.9} />
              <span><span className="t">ACCOUNT SERVICES</span><br /><span className="s">Nomination, Re-KYC &amp; closure</span></span>
            </Link>
            <Link href="/customer-care" className="gbtn">
              <Headset size={20} strokeW={1.9} />
              <span><span className="t">CUSTOMER CARE</span><br /><span className="s">Support &amp; feedback</span></span>
            </Link>
            <Link href="/downloads" className="gbtn">
              <Download size={20} strokeW={1.9} />
              <span><span className="t">DOWNLOADS</span><br /><span className="s">Forms &amp; software</span></span>
            </Link>
            <Link href="/bank-details" className="gbtn">
              <Bank size={20} strokeW={1.9} />
              <span><span className="t">BANK &amp; DP DETAILS</span><br /><span className="s">Verified account numbers</span></span>
            </Link>
            <Link href="/business-partners" className="gbtn">
              <Handshake size={20} strokeW={1.9} />
              <span><span className="t">BUSINESS PARTNERS</span><br /><span className="s">Franchise &amp; sub-broker</span></span>
            </Link>
            <Link href="/tools/margin-calculator" className="gbtn">
              <Calculator size={20} strokeW={1.9} />
              <span><span className="t">MARGIN CALCULATOR</span><br /><span className="s">Exchange margin, live rates</span></span>
            </Link>
          </div>
          <h2>Grievance Redressal Mechanisms</h2>
          <div className="g-row">
            <a href={REGULATOR_LINKS.smartOdr} {...EXT} className="gbtn">
              <Pencil size={20} strokeW={1.9} />
              <span>
                <span className="t">SMART ODR</span><br />
                <span className="s">Online Dispute Resolution</span>
              </span>
            </a>
            <a href={REGULATOR_LINKS.sebiScores} {...EXT} className="gbtn">
              <ListCheck size={20} strokeW={1.9} />
              <span>
                <span className="t">SEBI SCORES</span><br />
                <span className="s">Lodge a Complaint</span>
              </span>
            </a>
            <a href={REGULATOR_LINKS.exchangeGrievance} {...EXT} className="gbtn">
              <Bank size={20} strokeW={1.9} />
              <span>
                <span className="t">Exchange Grievance</span><br />
                <span className="s">NSE / BSE / MCX Links</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="f-bottom">
        <div className="container">
          <span>© 2026 Kalpataru Multiplier Ltd. All rights reserved.</span>
          <span>Made with <span className="heart">♥</span> in India</span>
          <nav aria-label="Regulators">
            <a href={REGULATOR_LINKS.nse} {...EXT}>NSE</a>
            <a href={REGULATOR_LINKS.bse} {...EXT}>BSE</a>
            <a href={REGULATOR_LINKS.mcx} {...EXT}>MCX</a>
            <a href={REGULATOR_LINKS.cdsl} {...EXT}>CDSL</a>
            <a href={REGULATOR_LINKS.sebi} {...EXT}>SEBI</a>
            <a href={REGULATOR_LINKS.sebiScores} {...EXT}>SCORES</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
