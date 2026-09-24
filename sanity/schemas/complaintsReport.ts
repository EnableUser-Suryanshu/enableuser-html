import { defineField, defineType } from 'sanity';

/**
 * The investor-complaints data SEBI requires to be published monthly, on both
 * Investor Charters — stock broker and depository participant.
 *
 * One document, not one per month. The charters show a current snapshot plus
 * rolling trends, so each month you edit this document rather than creating a
 * new one: change `monthEnding`, update the four rows of the snapshot, and add
 * the month that just closed to the monthly trend. The site picks it up within
 * five minutes, with no deployment.
 *
 * Both charter pages read this same document, which is the point — they showed
 * identical tables maintained in two places before, and two copies of a
 * regulated disclosure is two chances to publish a stale one.
 */

const COUNT = {
  type: 'string',
  description: 'A number, or “Nil” / “NA” where that is what the return says.',
} as const;

export default defineType({
  name: 'complaintsReport',
  title: 'Investor Complaints Data',
  type: 'document',
  fields: [
    defineField({
      name: 'monthEnding',
      title: 'Data for every month ending',
      type: 'string',
      description: 'As it should read on the page, e.g. “August - 2026”.',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'snapshot',
      title: 'This month’s complaints',
      description: 'One row per source. The four SEBI asks for are pre-filled.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'row',
        fields: [
          { name: 'source', title: 'Received from', type: 'string', validation: (r) => r.required() },
          { name: 'carriedForward', title: 'Carried forward from previous month', ...COUNT },
          { name: 'received', title: 'Received during the month', ...COUNT },
          { name: 'totalPending', title: 'Total pending', ...COUNT },
          { name: 'resolved', title: 'Resolved', ...COUNT },
          { name: 'pendingUnder3', title: 'Pending — less than 3 months', ...COUNT },
          { name: 'pendingOver3', title: 'Pending — more than 3 months', ...COUNT },
          { name: 'avgResolutionDays', title: 'Average resolution time (days)', ...COUNT },
        ],
        preview: {
          select: { title: 'source', received: 'received', resolved: 'resolved' },
          prepare: ({ title, received, resolved }) => ({
            title,
            subtitle: `received ${received ?? '—'} · resolved ${resolved ?? '—'}`,
          }),
        },
      }],
      validation: (r) => r.required().min(1),
    }),

    defineField({
      name: 'monthlyTrend',
      title: 'Trend of monthly disposal',
      description: 'Twelve months, oldest first, then the grand total as the last row.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'row',
        fields: [
          { name: 'month', title: 'Month', type: 'string', description: 'e.g. “August-2026”, or “Grand Total” for the last row.', validation: (r) => r.required() },
          { name: 'carriedForward', title: 'Carried forward', ...COUNT },
          { name: 'received', title: 'Received', ...COUNT },
          { name: 'resolved', title: 'Resolved', ...COUNT },
          { name: 'pending', title: 'Pending', ...COUNT },
        ],
        preview: {
          select: { title: 'month', received: 'received', pending: 'pending' },
          prepare: ({ title, received, pending }) => ({
            title, subtitle: `received ${received ?? '—'} · pending ${pending ?? '—'}`,
          }),
        },
      }],
    }),

    defineField({
      name: 'annualTrend',
      title: 'Trend of annual disposal',
      description: 'One row per financial year, then the grand total.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'row',
        fields: [
          { name: 'year', title: 'Year', type: 'string', description: 'e.g. “2025-26”, or “Grand Total”.', validation: (r) => r.required() },
          { name: 'carriedForward', title: 'Carried forward', ...COUNT },
          { name: 'received', title: 'Received', ...COUNT },
          { name: 'resolved', title: 'Resolved', ...COUNT },
          { name: 'pending', title: 'Pending', ...COUNT },
        ],
        preview: {
          select: { title: 'year', received: 'received', pending: 'pending' },
          prepare: ({ title, received, pending }) => ({
            title, subtitle: `received ${received ?? '—'} · pending ${pending ?? '—'}`,
          }),
        },
      }],
    }),

    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'date',
      description: 'Shown on the page so a reader knows how current the figures are.',
    }),
  ],

  preview: {
    select: { month: 'monthEnding', updated: 'updatedAt' },
    prepare: ({ month, updated }) => ({
      title: `Complaints data — ${month ?? 'no month set'}`,
      subtitle: updated ? `updated ${updated}` : 'no update date set',
    }),
  },
});
