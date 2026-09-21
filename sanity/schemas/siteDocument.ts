import { defineField, defineType } from 'sanity';

/**
 * A standalone document that the site links to from a fixed place — the
 * footer, a policy page, a contact panel — rather than from the Downloads
 * list.
 *
 * Kept apart from `download` on purpose. Everything of that type appears on
 * the Downloads page, and these are not forms a client goes looking for in
 * that list; they are documents a specific link points at. Filing them there
 * would put them on a page they do not belong on just to make them editable.
 *
 * `key` is the contract between the studio and the code. The site looks a
 * document up by key, so replacing the PDF here — a new version, a corrected
 * file — changes what the link serves with no deployment. Adding a key means
 * adding it to KEYS below and using it in the code that renders the link.
 */

export const SITE_DOCUMENT_KEYS = [
  {
    value: 'investor-complaint-process',
    title: 'Investor / Client Complaint Process',
    hint: 'Linked from the footer under Investor Relations.',
  },
] as const;

export default defineType({
  name: 'siteDocument',
  title: 'Site Document',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Where this is used',
      type: 'string',
      description:
        'Which link on the site serves this file. Each key is used in one place — do not create two documents with the same key.',
      options: {
        list: SITE_DOCUMENT_KEYS.map((k) => ({ title: k.title, value: k.value })),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'For your reference in this list. The link text on the site is set in code.',
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      description: 'Replacing this file changes what the link serves — no deployment needed.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'note',
      title: 'Internal note',
      type: 'string',
      description: 'Optional — e.g. which circular this version implements, or when it was reviewed.',
    }),
  ],

  preview: {
    select: { title: 'title', key: 'key', file: 'file.asset', note: 'note' },
    prepare({ title, key, file, note }) {
      const label = SITE_DOCUMENT_KEYS.find((k) => k.value === key)?.title ?? key;
      // A document with no file renders a dead link, and that is easy to miss
      // in a list — say so here rather than on the live site.
      return {
        title: file ? title : `⚠ ${title}`,
        subtitle: file ? [label, note].filter(Boolean).join(' · ') : `${label} — no file uploaded`,
      };
    },
  },
});
