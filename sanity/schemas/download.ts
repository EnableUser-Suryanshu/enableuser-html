import { defineField, defineType } from 'sanity';

/**
 * A single item on the Downloads page.
 *
 * Two kinds exist and the form adapts to which one is chosen:
 *
 *  - `upload`   the file is stored in Sanity and served from its CDN. This is
 *               how every Kalpataru form should be published — it removes the
 *               dependency on any one server staying online, which is exactly
 *               what broke these links during the domain cutover.
 *  - `external` the item lives on someone else's site. Used for third-party
 *               software so the client always gets the vendor's current build
 *               rather than a stale copy we happen to be hosting.
 */

export const DOWNLOAD_CATEGORIES = [
  'Account Opening & KYC',
  'Demat & DP Forms',
  'Nomination & Transmission',
  'Pledge & Margin',
  'Guides & Demos',
  'Software & Utilities',
] as const;

export default defineType({
  name: 'download',
  title: 'Download',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Title',
      type: 'string',
      description: 'Shown on the card, e.g. "Account Closure Request Form".',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: DOWNLOAD_CATEGORIES.map((c) => ({ title: c, value: c })) },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'source',
      title: 'Where does this come from?',
      type: 'string',
      initialValue: 'upload',
      options: {
        layout: 'radio',
        list: [
          { title: 'Upload a file (hosted by us)', value: 'upload' },
          { title: 'Link to another site', value: 'external' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      description: 'PDF, DOCX, ZIP — whatever the client needs to download.',
      hidden: ({ parent }) => parent?.source !== 'upload',
      validation: (r) =>
        r.custom((value, ctx) => {
          const parent = ctx.parent as { source?: string } | undefined;
          if (parent?.source === 'upload' && !value) return 'Upload a file, or switch to a link.';
          return true;
        }),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'The vendor’s own download page — not a direct link to an installer we host.',
      hidden: ({ parent }) => parent?.source !== 'external',
      validation: (r) =>
        r.custom((value, ctx) => {
          const parent = ctx.parent as { source?: string } | undefined;
          if (parent?.source === 'external' && !value) return 'Add a link, or switch to an upload.';
          return true;
        }),
    }),
    defineField({
      name: 'kind',
      title: 'Badge',
      type: 'string',
      description:
        'The small label on the card (PDF, DOCX, LINK…). Left blank, it is worked out from the file.',
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers first. Items without one fall back to alphabetical.',
    }),
  ],

  orderings: [
    { title: 'Category, then order', name: 'byCategory', by: [
      { field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }, { field: 'label', direction: 'asc' },
    ] },
    { title: 'Title A–Z', name: 'byLabel', by: [{ field: 'label', direction: 'asc' }] },
  ],

  preview: {
    select: { title: 'label', subtitle: 'category', source: 'source', url: 'url', file: 'file.asset' },
    prepare({ title, subtitle, source, url, file }) {
      // Surface a broken entry in the list itself — a download with neither a
      // file nor a link renders nothing on the site and is easy to miss.
      const missing = source === 'upload' ? !file : !url;
      return {
        title: missing ? `⚠ ${title}` : title,
        subtitle: missing
          ? `${subtitle} — no ${source === 'upload' ? 'file uploaded' : 'link set'}`
          : `${subtitle} · ${source === 'external' ? new URL(url).hostname : 'hosted'}`,
      };
    },
  },
});
