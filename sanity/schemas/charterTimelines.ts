import { defineField, defineType } from 'sanity';

/**
 * The activity-and-timelines table on an Investor Charter.
 *
 * One document per charter — the stock broker's and the depository
 * participant's are different lists with different column headings, so they
 * are not shared the way the complaints data is.
 *
 * These change far less often than the monthly complaints return, but they do
 * change when SEBI revises a timeline, and that should not need a deployment
 * either.
 */

export const CHARTERS = [
  { value: 'broker', title: 'Investor Charter — Stock Broker' },
  { value: 'depository', title: 'Investor Charter — Depository Participant' },
] as const;

export default defineType({
  name: 'charterTimelines',
  title: 'Charter — Activities & Timelines',
  type: 'document',
  fields: [
    defineField({
      name: 'charter',
      title: 'Which charter',
      type: 'string',
      options: { list: CHARTERS.map((c) => ({ title: c.title, value: c.value })) },
      description: 'One document per charter — do not create two with the same value.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'activityHeading',
      title: 'Heading for the activity column',
      type: 'string',
      description: 'e.g. “Activity”, or “Brief about the activity / service”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'timelineHeading',
      title: 'Heading for the timeline column',
      type: 'string',
      description: 'e.g. “Expected Timelines”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      description: 'In the order they should appear. Numbering is added automatically.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'row',
        fields: [
          { name: 'activity', title: 'Activity / service', type: 'text', rows: 2, validation: (r) => r.required() },
          { name: 'timeline', title: 'Expected timeline', type: 'string', validation: (r) => r.required() },
        ],
        preview: {
          select: { title: 'activity', subtitle: 'timeline' },
        },
      }],
      validation: (r) => r.required().min(1),
    }),
  ],

  preview: {
    select: { charter: 'charter', rows: 'rows' },
    prepare: ({ charter, rows }) => ({
      title: CHARTERS.find((c) => c.value === charter)?.title ?? charter,
      subtitle: `${rows?.length ?? 0} activities`,
    }),
  },
});
