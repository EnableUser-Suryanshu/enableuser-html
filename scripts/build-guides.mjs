/**
 * Builds the four how-to guides as PDFs.
 *
 *   node scripts/build-guides.mjs [--keep-html]
 *
 * The guides the Downloads page carried were screen-by-screen walkthroughs of
 * the old back office, and several of the screens no longer exist. These are
 * written against what this site actually does, and — this is the point — the
 * steps are read out of the site's own data at build time rather than retyped
 * here. lib/pages-data is what /account-services and /new-to-market render, so
 * a guide cannot quietly disagree with the page describing the same process.
 *
 * Rendered through headless Chrome, which is the only thing on this machine
 * that lays out CSS properly. cupsfilter ignores stylesheets, and installing a
 * PDF toolchain for four documents is not worth it.
 *
 * Output is deterministic: Chrome stamps the wall clock into /CreationDate and
 * /ModDate, so an unchanged guide still rendered to different bytes every run
 * — which showed up as four modified files in git and four pointless uploads
 * to Sanity. Both dates are rewritten to a fixed value afterwards, so
 * identical content produces an identical file.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/files/guides');
const KEEP = process.argv.includes('--keep-html');

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('No Chrome/Chromium found — needed to render the PDFs.');
  process.exit(1);
}

/* ---------- pull the procedures out of the site's own source ---------- */

const src = readFileSync(resolve(ROOT, 'lib/pages-data.ts'), 'utf8');

/** Reads a `steps: [ ... ]` array out of the named block. */
function steps(anchor) {
  const i = src.indexOf(anchor);
  if (i < 0) throw new Error(`anchor not found: ${anchor}`);
  const s = src.indexOf('steps: [', i);
  const e = src.indexOf('],', s);
  return [...src.slice(s, e).matchAll(/'((?:[^'\\]|\\.)*)'/g)]
    .map((m) => m[1].replace(/\\'/g, "'"))
    .filter((t) => t.length > 12);
}

function field(anchor, name) {
  const i = src.indexOf(anchor);
  const m = new RegExp(`${name}:\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`).exec(src.slice(i, i + 2600));
  return m ? m[1].replace(/\\'/g, "'") : '';
}

const BRAND = {
  name: 'Kalpataru Multiplier Ltd',
  line: 'Share Broker · Mutual Fund Distributor · Depository Participant',
  site: 'kalpatarumulti.com',
  office: 'Hall No. 2, 1st Floor Western Block, Above Central Bank, GTB Complex, T. T. Nagar, Bhopal 462003',
};

const DESKS = {
  dp:      { person: 'Mr. Manoj Gupta', role: 'DP Manager',            email: 'dp@kalpatarumulti.com',      phone: '0755-4350143' },
  account: { person: 'Mr. Vinod Singh', role: 'General Manager, Back Office', email: 'account@kalpatarumulti.com', phone: '0755-4350142' },
  it:      { person: 'Mr. Javed Khan',  role: 'IT Manager',            email: 'info@kalpatarumulti.com',    phone: '0755-4350141' },
};

const PORTAL = {
  ekyc: 'https://kml-backoffice.kalpatarumulti.com/ekyc/ekycaccountopening',
  back: 'https://kml-backoffice.kalpatarumulti.com/Account/Login',
};

const GUIDES = [
  {
    file: 'demo-account-opening-online',
    title: 'Opening an Account',
    strap: 'Online with Aadhaar eKYC, or on paper at a branch.',
    intro:
      'Two routes lead to the same account. Online takes about 15 minutes and needs your Aadhaar-linked mobile number; the paper route can be completed at any of our Bhopal branches.',
    sections: [
      { h: 'Route 1 — Online, with eKYC', note: `Start at ${PORTAL.ekyc}`, steps: steps("key: 'online'") },
      { h: 'Route 2 — Paper form at a branch', steps: steps("key: 'offline'") },
    ],
    ready: ['PAN card', 'Aadhaar, with your mobile number linked to it', 'A cancelled cheque or bank statement', 'A specimen signature on plain paper', "Nominee's name, date of birth and share — or the opt-out declaration"],
    desk: DESKS.account,
    timeline: 'The Unique Client Code is usually activated within one working day of a complete online application, and within 7 days for a paper application.',
  },
  {
    file: 'demo-account-modification-online',
    title: 'Modifying Your Account',
    strap: 'Change your address, mobile, email, bank account or signature.',
    intro: field("key: 'reKyc'", 'summary'),
    sections: [
      { h: 'Online, through the Back Office', note: `Sign in at ${PORTAL.back}`, steps: steps("key: 'reKyc'") },
      {
        h: 'Offline, by form',
        steps: [
          'Download the Account Modification Form from the Downloads page, or collect one from any branch.',
          'Fill it in your own handwriting and strike off every field you are not changing.',
          'Attach self-attested proof of the detail being changed — an address proof, or a cancelled cheque for a bank change.',
          'Submit it at a branch, or email a scanned copy to the back-office desk from your registered email ID.',
        ],
      },
    ],
    ready: ['Your client ID', 'Access to your registered mobile number and email ID', 'Proof of the new detail — address proof, cancelled cheque or bank statement'],
    desk: DESKS.account,
    timeline: field("key: 'reKyc'", 'timeline'),
  },
  {
    file: 'how-to-close-account',
    title: 'Closing Your Account',
    strap: 'Free of charge, with the refundable AMC returned.',
    intro: field("key: 'closure'", 'summary'),
    sections: [
      { h: 'Before you start', steps: ['Sell your holdings, or transfer them to another demat account — an account cannot be closed while securities remain in it.', 'Settle any outstanding dues on the trading account.', 'Cancel any standing instructions, SIPs or pledges running against the account.'] },
      { h: 'Closing the account', note: `Sign in at ${PORTAL.back}`, steps: steps("key: 'closure'") },
    ],
    ready: ['Your client ID', 'A nil holdings and nil dues position', 'The registered bank account for the AMC refund'],
    desk: DESKS.dp,
    timeline: field("key: 'closure'", 'timeline'),
  },
  {
    file: 'how-to-create-a-ticket',
    title: 'Raising a Ticket',
    strap: 'Get a complaint, query or suggestion to the right desk.',
    intro:
      'Every request raised through the website reaches the customer-care desk with a reference against it, so it can be traced. Use this route rather than an individual’s mobile number — a ticket is recorded, a phone call is not.',
    sections: [
      {
        h: 'Raising it on the website',
        note: `Go to ${BRAND.site}/customer-care and use the Raise a Ticket form`,
        steps: [
          'Fill in your full name, email ID and contact number. All three are required — we reply on the email and call on the number.',
          'Enter your client code if you have one. It is optional, but it lets us trace the account immediately instead of asking you for it.',
          'Choose the subject that matches your query: Trading, Demat / DP, Back office & statements, Mutual fund, Technical / login, Complaint, Feedback or Other.',
          'Describe what happened, including dates, order numbers or scrip names where they apply. The more specific it is, the fewer times we have to come back to you.',
          'Submit. The request is recorded and sent to the customer-care desk, and a copy goes to the support desk.',
        ],
      },
      {
        h: 'Raising it in the Back Office',
        note: `Sign in at ${PORTAL.back}`,
        steps: [
          'Sign in with your client ID and password.',
          'Open the ticket or query section and choose the category of the issue.',
          'Describe the issue and attach a screenshot or statement where it helps.',
          'Submit, and note the ticket number the system returns — quote it in any follow-up.',
        ],
      },
      {
        h: 'If it is not resolved',
        steps: [
          'Write to complaint@kalpatarumulti.com quoting your ticket number.',
          'If still unresolved, escalate through the Escalation Matrix published at kalpatarumulti.com/customer-care — customer care, then Compliance Officer, then the Chief Executive Officer.',
          'Beyond that, you may lodge a complaint on SEBI SCORES at scores.sebi.gov.in, with the exchange investor grievance cell, or through SMART ODR at smartodr.in. Quote your Complaint Reference Number so they can trace what has already been done.',
        ],
      },
    ],
    ready: ['Your client code, if you have one', 'The date and details of what happened', 'Any order number, scrip name or statement that relates to it'],
    desk: DESKS.it,
    timeline: 'Complaints are redressed within 30 days of receipt, as required by SEBI.',
  },
];

/* ---------------------------- rendering ---------------------------- */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `
  @page { size: A4; margin: 17mm 16mm 16mm; }
  *{box-sizing:border-box}
  body{margin:0;font:11pt/1.62 -apple-system,"Segoe UI",Roboto,sans-serif;color:#141b2d;
       -webkit-print-color-adjust:exact;print-color-adjust:exact}
  .bar{height:5px;background:linear-gradient(90deg,#bb0009,#e11d2a);margin:0 0 15px}
  .brand{display:flex;justify-content:space-between;align-items:baseline;
         border-bottom:1px solid #e4e5e9;padding-bottom:9px;margin-bottom:22px}
  .brand b{font-size:12.5pt;color:#bb0009;letter-spacing:.2px}
  .brand span{font-size:7.6pt;color:#6b7280;text-transform:uppercase;letter-spacing:.7px}
  h1{font-size:21pt;margin:0 0 5px;line-height:1.18}
  .strap{font-size:10.5pt;color:#bb0009;font-weight:600;margin:0 0 14px}
  .intro{font-size:10.4pt;color:#3d4757;margin:0 0 20px}
  h2{font-size:11.5pt;margin:21px 0 4px;padding-bottom:5px;border-bottom:2px solid #f0d3d4;
     page-break-after:avoid}
  .note{font-size:9pt;color:#6b7280;margin:5px 0 10px;word-break:break-all}
  ol{margin:9px 0 0;padding:0;counter-reset:s;list-style:none}
  ol li{counter-increment:s;position:relative;padding:0 0 11px 30px;font-size:10.3pt;
        page-break-inside:avoid}
  ol li::before{content:counter(s);position:absolute;left:0;top:1px;width:20px;height:20px;
    border-radius:50%;background:#bb0009;color:#fff;font-size:8.4pt;font-weight:700;
    display:flex;align-items:center;justify-content:center}
  .box{border:1px solid #e4e5e9;border-left:3px solid #bb0009;border-radius:5px;
       padding:12px 15px;margin:22px 0 0;background:#fcfcfd;page-break-inside:avoid}
  .box h3{margin:0 0 7px;font-size:9.2pt;text-transform:uppercase;letter-spacing:.7px;color:#bb0009}
  .box ul{margin:0;padding-left:17px;font-size:10pt}
  .box ul li{padding-bottom:3px}
  .box p{margin:0;font-size:10pt}
  .two{display:flex;gap:13px;margin-top:22px}
  .two .box{flex:1;margin-top:0}
  footer{margin-top:26px;padding-top:9px;border-top:1px solid #e4e5e9;
         font-size:8.2pt;color:#8b93a1;page-break-inside:avoid}
`;

function html(g) {
  const sec = g.sections.map((s) => `
    <h2>${esc(s.h)}</h2>
    ${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}
    <ol>${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`).join('');

  return `<!doctype html><html lang="en"><meta charset="utf-8">
<title>${esc(g.title)} — ${esc(BRAND.name)}</title><style>${CSS}</style>
<div class="bar"></div>
<div class="brand"><b>${esc(BRAND.name)}</b><span>${esc(BRAND.line)}</span></div>
<h1>${esc(g.title)}</h1>
<p class="strap">${esc(g.strap)}</p>
<p class="intro">${esc(g.intro)}</p>
${sec}
<div class="two">
  <div class="box"><h3>Keep ready</h3><ul>${g.ready.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
  <div class="box"><h3>Who to ask</h3><p><b>${esc(g.desk.person)}</b><br>${esc(g.desk.role)}<br>${esc(g.desk.phone)}<br>${esc(g.desk.email)}</p></div>
</div>
${g.timeline ? `<div class="box"><h3>How long it takes</h3><p>${esc(g.timeline)}</p></div>` : ''}
<footer>${esc(BRAND.name)} · ${esc(BRAND.office)} · ${esc(BRAND.site)}<br>
This guide describes the process as published on ${esc(BRAND.site)}. Where a regulator's
requirement differs, the regulator's requirement applies.</footer>
</html>`;
}

mkdirSync(OUT, { recursive: true });
const kb = (n) => `${Math.round(n / 1024)} KB`;

for (const g of GUIDES) {
  const htmlPath = resolve(OUT, `${g.file}.html`);
  const pdfPath = resolve(OUT, `${g.file}.pdf`);
  writeFileSync(htmlPath, html(g), 'utf8');

  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`,
  ], { stdio: 'pipe' });

  // Same length, so the xref offsets stay valid without rebuilding them.
  const FIXED = "D:20260101000000+00'00'";
  const buf = readFileSync(pdfPath);
  const fixed = Buffer.from(
    buf.toString('latin1').replace(/(\/(?:Creation|Mod)Date\s*\()[^)]*(\))/g, `$1${FIXED}$2`),
    'latin1',
  );
  if (fixed.length !== buf.length) throw new Error(`${g.file}: date rewrite changed the file length`);
  writeFileSync(pdfPath, fixed);

  if (!KEEP) unlinkSync(htmlPath);
  const steps = g.sections.reduce((n, s) => n + s.steps.length, 0);
  const sha = createHash('sha1').update(fixed).digest('hex').slice(0, 8);
  console.log(`  ✓ ${g.file}.pdf  ${kb(statSync(pdfPath).size).padStart(7)}  ${steps} steps  ${sha}`);
}

console.log(`\n${GUIDES.length} guides written to public/files/guides/`);
