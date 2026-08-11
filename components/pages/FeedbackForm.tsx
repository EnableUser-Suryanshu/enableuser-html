'use client';

import { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from '../icons';

const CITIES = [
  'Bhopal', 'Sagar', 'Bina', 'Katni', 'Chhatarpur', 'Jabalpur', 'Bhilai',
  'Lalitpur', 'Guna', 'Ashok Nagar', 'Harda', 'Gadarwara', 'Damoh', 'Other',
];

const SUBJECTS = [
  'Trading query', 'Demat / DP query', 'Back office & statements',
  'Mutual fund query', 'Technical / login issue', 'Complaint', 'Feedback / suggestion', 'Other',
];

/**
 * Client feedback form. The site is a static export, so submission composes a
 * pre-filled email to the customer-care desk. Swap `buildMailto` for a POST to
 * a form endpoint (or a Next.js route handler) when a backend is available.
 */
export default function FeedbackForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    clientCode: '', name: '', email: '', contact: '', city: '', subject: '', message: '',
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = buildMailto();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fb-done" role="status">
        <span className="fb-done-ico"><CheckCircle size={34} strokeW={2} /></span>
        <h3>Your email is ready to send</h3>
        <p>
          We&apos;ve opened your mail app with the details filled in — press send and our
          customer-care desk will pick it up. If nothing opened, write to{' '}
          <a href="mailto:complaint@kalpatarumulti.com">complaint@kalpatarumulti.com</a> directly.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form className="fb-form" onSubmit={onSubmit}>
      <div className="fb-row">
        <div className="fb-field">
          <label htmlFor="fb-name">Full name <span aria-hidden="true">*</span></label>
          <input id="fb-name" required value={form.name} onChange={set('name')} autoComplete="name" />
        </div>
        <div className="fb-field">
          <label htmlFor="fb-code">Client code</label>
          <input id="fb-code" value={form.clientCode} onChange={set('clientCode')} placeholder="If you are an existing client" />
        </div>
      </div>

      <div className="fb-row">
        <div className="fb-field">
          <label htmlFor="fb-email">Email <span aria-hidden="true">*</span></label>
          <input id="fb-email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
        </div>
        <div className="fb-field">
          <label htmlFor="fb-contact">Contact number <span aria-hidden="true">*</span></label>
          <input id="fb-contact" type="tel" required value={form.contact} onChange={set('contact')} autoComplete="tel" />
        </div>
      </div>

      <div className="fb-row">
        <div className="fb-field">
          <label htmlFor="fb-city">City</label>
          <select id="fb-city" value={form.city} onChange={set('city')}>
            <option value="">Select city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="fb-field">
          <label htmlFor="fb-subject">Subject <span aria-hidden="true">*</span></label>
          <select id="fb-subject" required value={form.subject} onChange={set('subject')}>
            <option value="">Select a subject</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="fb-field">
        <label htmlFor="fb-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="fb-message" rows={5} required value={form.message} onChange={set('message')}
          placeholder="Tell us what happened, and what you would like us to do." />
      </div>

      <p className="fb-note">
        <Mail size={14} strokeW={2} /> Fields marked * are required. Never share passwords, OTPs
        or PIN numbers in this form — no Kalpataru employee will ask for them.
      </p>

      <button type="submit" className="btn btn-navy">
        Send to Customer Care <ArrowRight size={16} strokeW={2.2} />
      </button>
    </form>
  );
}
