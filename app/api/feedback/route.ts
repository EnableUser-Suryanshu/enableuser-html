/**
 * Client feedback submissions.
 *
 * Order of operations is deliberate: the submission is written to Sanity
 * first, and only then is an email attempted. This form carries complaints
 * from clients of a SEBI-registered broker — one that disappears because a
 * mail provider had a bad minute is a regulatory problem, not a bug. Saving
 * first means every submission is recoverable from the studio even if no
 * email ever goes out.
 *
 * The response tells the client it has been received as long as the save
 * succeeded. Whether the notification email also went is an internal concern,
 * recorded on the document as `emailed`.
 */
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, sanityConfigured } from '@/sanity/env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Where submissions go. Mirrors the addresses the old mailto used. */
const TO = process.env.FEEDBACK_TO ?? 'complaint@kalpatarumulti.com';
const CC = process.env.FEEDBACK_CC ?? 'support@kalpatarumulti.com';

interface Payload {
  name?: string; clientCode?: string; email?: string;
  contact?: string; city?: string; subject?: string; message?: string;
  /** Honeypot — real users never see or fill this. */
  website?: string;
}

const clean = (s: unknown, max = 400) =>
  typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '';

function validate(p: Payload) {
  const errors: Record<string, string> = {};
  const name = clean(p.name, 120);
  const email = clean(p.email, 160);
  const contact = clean(p.contact, 40);
  const message = clean(p.message, 5000);

  if (!name) errors.name = 'Enter your full name so we know who to reply to.';
  if (!email) errors.email = 'Enter your email address in the format name@example.com';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'That email address is missing an @ or a domain.';
  }
  if (!contact.replace(/\D/g, '')) errors.contact = 'Enter a contact number we can reach you on.';
  if (!message) errors.message = 'Tell us what happened so we can look into it.';

  return {
    errors,
    data: {
      name, email, contact, message,
      clientCode: clean(p.clientCode, 60),
      city: clean(p.city, 80),
      subject: clean(p.subject, 120) || 'General',
    },
  };
}

/** Escapes values before they go anywhere near an HTML email body. */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function sendEmail(d: ReturnType<typeof validate>['data']) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FEEDBACK_FROM;
  if (!key || !from) return { sent: false, reason: 'email not configured' };

  const rows: Array<[string, string]> = [
    ['Name', d.name],
    ['Client code', d.clientCode || '—'],
    ['Email', d.email],
    ['Contact', d.contact],
    ['City', d.city || '—'],
    ['Subject', d.subject],
  ];

  const html = `
    <h2 style="font:600 18px system-ui;margin:0 0 14px">Client feedback from the website</h2>
    <table style="font:14px system-ui;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr>
        <td style="padding:4px 14px 4px 0;color:#666">${esc(k)}</td>
        <td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`).join('')}
    </table>
    <p style="font:14px system-ui;margin:16px 0 6px;color:#666">Message</p>
    <div style="font:14px/1.7 system-ui;white-space:pre-wrap;border-left:3px solid #bb0009;padding:8px 0 8px 12px">${esc(d.message)}</div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [TO],
        cc: CC ? [CC] : undefined,
        // Replying in the mail client goes straight back to the client.
        reply_to: d.email,
        subject: `[Website Feedback] ${d.subject} — ${d.name}`,
        html,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return { sent: false, reason: `provider returned ${r.status}` };
    return { sent: true, reason: '' };
  } catch (e) {
    return { sent: false, reason: (e as Error).message };
  }
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  // Bots fill every field they find; humans never see this one.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const { errors, data } = validate(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!sanityConfigured || !token) {
    // Nowhere to put it and no guarantee of email — say so rather than show a
    // success screen for a message that went nowhere.
    return NextResponse.json(
      { ok: false, error: 'The feedback desk is not reachable right now. Please email support@kalpatarumulti.com.' },
      { status: 503 },
    );
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

  let id: string;
  try {
    const doc = await client.create({
      _type: 'feedback',
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'new',
      emailed: false,
    });
    id = doc._id;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'We could not record your message. Please email support@kalpatarumulti.com.' },
      { status: 502 },
    );
  }

  // Saved — the client is safe from here. Email is best-effort.
  const mail = await sendEmail(data);
  if (mail.sent) {
    try { await client.patch(id).set({ emailed: true }).commit(); } catch { /* cosmetic only */ }
  } else {
    console.warn(`feedback ${id} saved but not emailed: ${mail.reason}`);
  }

  return NextResponse.json({ ok: true, emailed: mail.sent });
}
