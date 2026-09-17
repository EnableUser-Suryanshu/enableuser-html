import { defineField, defineType } from 'sanity';

/**
 * A client feedback submission.
 *
 * Every submission is stored before any email is attempted, so nothing is lost
 * if the mail provider is down or unconfigured. That ordering matters here:
 * this form carries complaints from clients of a SEBI-registered broker, and a
 * complaint that vanishes because an SMTP call failed is a regulatory problem,
 * not just a bug.
 *
 * Fields are read-only in the studio — this is a record of what the client
 * actually submitted, and editing it would destroy that. Only `status` and
 * `internalNotes` are writable, for tracking the response.
 */
export default defineType({
  name: 'feedback',
  title: 'Client Feedback',
  type: 'document',
  // Submissions arrive from the website; nobody should be hand-creating them.
  __experimental_omnisearch_visibility: false,

  fields: [
    defineField({ name: 'name', title: 'Full name', type: 'string', readOnly: true }),
    defineField({ name: 'clientCode', title: 'Client code', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'contact', title: 'Contact number', type: 'string', readOnly: true }),
    defineField({ name: 'city', title: 'City', type: 'string', readOnly: true }),
    defineField({ name: 'subject', title: 'Subject', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 6, readOnly: true }),
    defineField({ name: 'submittedAt', title: 'Received', type: 'datetime', readOnly: true }),

    defineField({
      name: 'emailed',
      title: 'Notification email sent',
      type: 'boolean',
      readOnly: true,
      description:
        'False means the submission was saved but the notification did not go out — worth checking the desk saw it.',
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        layout: 'radio',
        list: [
          { title: 'New', value: 'new' },
          { title: 'In progress', value: 'inProgress' },
          { title: 'Resolved', value: 'resolved' },
        ],
      },
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal notes',
      type: 'text',
      rows: 4,
      description: 'Not visible to the client. What was done, and when.',
    }),
  ],

  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Oldest first', name: 'oldest', by: [{ field: 'submittedAt', direction: 'asc' }] },
  ],

  preview: {
    select: {
      name: 'name', subject: 'subject', status: 'status',
      at: 'submittedAt', emailed: 'emailed', msg: 'message',
    },
    prepare({ name, subject, status, at, emailed, msg }) {
      const when = at
        ? new Date(at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : '';
      const flag = status === 'resolved' ? '✓' : status === 'inProgress' ? '…' : '●';
      return {
        // An unsent notification is the one thing worth surfacing in the list.
        title: `${flag} ${name || 'Unnamed'}${emailed === false ? '  ⚠ not emailed' : ''}`,
        subtitle: [subject, when].filter(Boolean).join(' · '),
        description: msg,
      };
    },
  },
});
