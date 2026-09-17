'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, CheckCircle, ArrowRight, Warning } from '../icons';

const CITIES = [
  'Bhopal', 'Sagar', 'Bina', 'Katni', 'Chhatarpur', 'Jabalpur', 'Bhilai',
  'Lalitpur', 'Guna', 'Ashok Nagar', 'Harda', 'Gadarwara', 'Damoh', 'Other',
];

const SUBJECTS = [
  'Trading query', 'Demat / DP query', 'Back office & statements',
  'Mutual fund query', 'Technical / login issue', 'Complaint', 'Feedback / suggestion', 'Other',
];

type Field = 'name' | 'email' | 'contact' | 'subject' | 'message';

/**
 * Client feedback form.
 *
 * Posts to /api/feedback, which records the submission in Sanity and then
 * notifies the customer-care desk. It used to hand off to a `mailto:` draft in
 * the visitor's own mail app — which meant a complaint only ever arrived if
 * they had a mail client configured and remembered to press send. The mailto is
 * kept, but only as an escape hatch shown when the server call fails.
 *
 * Validation is done here rather than left to the browser so that each error
 * meets WCAG 3.3.1 and 3.3.3: the message is text, it is tied to its field
 * with aria-describedby, the field carries aria-invalid, and every message
 * says how to fix the problem rather than only what is wrong. On submit the
 * error summary takes focus, giving screen reader and keyboard users the whole
 * list at once with a link to each field.
 */
export default function FeedbackForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  /** Set when the server could not take the message; offers the mailto route. */
  const [failed, setFailed] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [attempt, setAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    clientCode: '', name: '', email: '', contact: '', city: '', subject: '', message: '',
    website: '', // honeypot
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    // Clear an error as soon as the field is corrected, so the summary never
    // contradicts what the user is looking at.
    setErrors((prev) => (prev[k as Field] ? { ...prev, [k]: undefined } : prev));
  };

  /** Each message states the fix, not just the fault (WCAG 3.3.3). */
  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) e.name = 'Enter your full name so we know who to reply to.';
    if (!form.email.trim()) {
      e.email = 'Enter your email address in the format name@example.com';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      e.email = 'That email address is missing an @ or a domain. Enter it in the format name@example.com';
    }
    const digits = form.contact.replace(/\D/g, '');
    if (!digits) {
      e.contact = 'Enter a contact number we can reach you on, for example 9876543210.';
    } else if (digits.length < 10) {
      e.contact = `That number has ${digits.length} digits. Enter a 10-digit mobile number, for example 9876543210.`;
    }
    if (!form.subject) e.subject = 'Choose the subject that best matches your query.';
    if (!form.message.trim()) e.message = 'Tell us what happened and what you would like us to do.';
    return e;
  };

  const buildMailto = () => {
    const subject = `[Website Feedback] ${form.subject || 'General'} — ${form.name}`;
    const body = [
      `Name: ${form.name}`,
      `Client Code: ${form.clientCode || '—'}`,
      `Email: ${form.email}`,
      `Contact No: ${form.contact}`,
      `City: ${form.city || '—'}`,
      `Subject: ${form.subject || '—'}`,
      '',
      'Message:',
      form.message,
    ].join('\n');
    return `mailto:complaint@kalpatarumulti.com?cc=support@kalpatarumulti.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      // Focus moves in the effect below — the summary is not in the DOM until
      // React has committed this state change.
      setAttempt((n) => n + 1);
      return;
    }

    setSending(true);
    setFailed(null);
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await r.json().catch(() => ({}));

      if (r.ok && j.ok) {
        setSent(true);
      } else if (r.status === 422 && j.errors) {
        // The server revalidates; surface anything the client check missed.
        setErrors(j.errors);
        setAttempt((n) => n + 1);
      } else {
        setFailed(j.error ?? 'We could not reach the customer-care desk just now.');
      }
    } catch {
      setFailed('We could not reach the customer-care desk just now.');
    } finally {
      setSending(false);
    }
  };

  // Move focus to the error summary after each failed submit, so the whole
  // list is announced and keyboard users land on the links to each field.
  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus();
  }, [attempt]);

  const err = (f: Field) =>
    errors[f]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${f}-error` }
      : {};

  const Err = ({ f }: { f: Field }) =>
    errors[f] ? (
      <p className="fb-err" id={`${f}-error`}>
        <Warning size={14} strokeW={2.2} aria-hidden="true" /> {errors[f]}
      </p>
    ) : null;

  const errorList = (Object.entries(errors) as [Field, string | undefined][])
    .filter(([, v]) => v);

  return (
    <>
      {/* Rendered once, always present, so screen readers announce changes to
          it. A region injected at the moment it gains text announces nothing
          (WCAG 4.1.3). */}
      <div className="sr-only" role="status" aria-live="polite">
        {sending ? 'Sending your message…' : ''}
        {sent ? 'Your message has been sent to the customer-care desk.' : ''}
        {failed ?? ''}
      </div>

      {sent ? (
        <div className="fb-done">
          <span className="fb-done-ico"><CheckCircle size={34} strokeW={2} /></span>
          <h3>Thank you — we have your message</h3>
          <p>
            It has reached our customer-care desk and been logged against a reference. We aim to
            respond within one working day. For anything urgent on a live trade, call the dealing
            desk on <a href="tel:07554350141">0755-4350141</a> — that is always quicker.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setSent(false);
              setForm({ clientCode: '', name: '', email: '', contact: '', city: '', subject: '', message: '', website: '' });
            }}
          >
            Submit another response
          </button>
        </div>
      ) : (
        <form className="fb-form" onSubmit={onSubmit} noValidate>
          {/* Honeypot: off-screen and hidden from assistive tech, so only bots
              fill it. Submissions carrying it are accepted and discarded. */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
              value={form.website} onChange={set('website')}
            />
          </div>

          {failed && (
            <div className="fb-summary" role="alert">
              <p><strong>{failed}</strong></p>
              <p style={{ marginTop: 6, fontWeight: 400 }}>
                Nothing has been lost — you can send the same details by email instead,
                or call the desk on <a href="tel:07554350141">0755-4350141</a>.
              </p>
              <p style={{ marginTop: 10 }}>
                <a className="btn btn-outline" href={buildMailto()}>Send it by email instead</a>
              </p>
            </div>
          )}
          {errorList.length > 0 && (
            <div
              className="fb-summary"
              role="alert"
              tabIndex={-1}
              ref={summaryRef}
            >
              <strong>
                <Warning size={16} strokeW={2.2} aria-hidden="true" />{' '}
                {errorList.length === 1
                  ? 'There is 1 problem with this form'
                  : `There are ${errorList.length} problems with this form`}
              </strong>
              <ul>
                {errorList.map(([f, msg]) => (
                  <li key={f}><a href={`#fb-${f}`}>{msg}</a></li>
                ))}
              </ul>
            </div>
          )}

          <div className="fb-row">
            <div className="fb-field">
              <label htmlFor="fb-name">Full name <span aria-hidden="true">*</span></label>
              <input id="fb-name" required value={form.name} onChange={set('name')} autoComplete="name" {...err('name')} />
              <Err f="name" />
            </div>
            <div className="fb-field">
              <label htmlFor="fb-code">Client code</label>
              <input id="fb-code" value={form.clientCode} onChange={set('clientCode')} placeholder="If you are an existing client" />
            </div>
          </div>

          <div className="fb-row">
            <div className="fb-field">
              <label htmlFor="fb-email">Email <span aria-hidden="true">*</span></label>
              <input id="fb-email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" {...err('email')} />
              <Err f="email" />
            </div>
            <div className="fb-field">
              <label htmlFor="fb-contact">Contact number <span aria-hidden="true">*</span></label>
              <input id="fb-contact" type="tel" required value={form.contact} onChange={set('contact')} autoComplete="tel" {...err('contact')} />
              <Err f="contact" />
            </div>
          </div>

          <div className="fb-row">
            <div className="fb-field">
              <label htmlFor="fb-city">City</label>
              <select id="fb-city" value={form.city} onChange={set('city')} autoComplete="address-level2">
                <option value="">Select city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="fb-field">
              <label htmlFor="fb-subject">Subject <span aria-hidden="true">*</span></label>
              <select id="fb-subject" required value={form.subject} onChange={set('subject')} {...err('subject')}>
                <option value="">Select a subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <Err f="subject" />
            </div>
          </div>

          <div className="fb-field">
            <label htmlFor="fb-message">Message <span aria-hidden="true">*</span></label>
            <textarea id="fb-message" rows={5} required value={form.message} onChange={set('message')}
              placeholder="Tell us what happened, and what you would like us to do." {...err('message')} />
            <Err f="message" />
          </div>

          <p className="fb-note">
            <Mail size={14} strokeW={2} /> Fields marked * are required. Never share passwords, OTPs
            or PIN numbers in this form — no Kalpataru employee will ask for them.
          </p>

          <button type="submit" className="btn btn-navy" disabled={sending}>
            {sending ? 'Sending…' : 'Send to Customer Care'}
            {!sending && <ArrowRight size={16} strokeW={2.2} />}
          </button>
        </form>
      )}
    </>
  );
}
