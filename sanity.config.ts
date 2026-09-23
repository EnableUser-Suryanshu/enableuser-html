'use client';

/**
 * Sanity Studio, served from /studio inside this app.
 *
 * Mirrors the setup already running on indsec.co.in. The studio is only for
 * staff — access is controlled by Sanity project membership, so anyone opening
 * /studio without an invite sees a login screen and nothing else.
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemas';
import { DOWNLOAD_CATEGORIES } from './sanity/schemas/download';

export default defineConfig({
  basePath: '/studio',
  title: 'Kalpataru Studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  document: {
    /*
      The charter documents are singletons the site reads by a fixed id.
      Taking them out of the global "New document" menu is what keeps them
      that way — nothing else prevents a second copy being made by accident.
    */
    newDocumentOptions: (prev) =>
      prev.filter((t) => !['complaintsReport', 'charterTimelines'].includes(t.templateId)),
  },
  plugins: [
    structureTool({
      // Group downloads by category. Eighty items in one flat list is
      // unmanageable; this matches how they appear on the site.
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Client Feedback')
              .child(
                S.list()
                  .title('Client Feedback')
                  .items([
                    S.listItem().title('New').child(
                      S.documentList().title('New')
                        .filter('_type == "feedback" && status == "new"')
                        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])),
                    S.listItem().title('In progress').child(
                      S.documentList().title('In progress')
                        .filter('_type == "feedback" && status == "inProgress"')
                        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])),
                    S.listItem().title('Resolved').child(
                      S.documentList().title('Resolved')
                        .filter('_type == "feedback" && status == "resolved"')
                        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])),
                    S.divider(),
                    S.listItem().title('All submissions').child(
                      S.documentList().title('All submissions')
                        .filter('_type == "feedback"')
                        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])),
                  ]),
              ),
            S.divider(),

            /*
              Investor Charters. Each of these is a single document the site
              reads by a fixed id, so they are opened directly rather than
              listed — a list invites a second copy, and the site's queries
              take the first match, so a duplicate would silently win or lose
              at random. `newDocumentOptions` below stops the global "+"
              offering them for the same reason.
            */
            S.listItem()
              .title('Investor Charters')
              .child(
                S.list()
                  .title('Investor Charters')
                  .items([
                    S.listItem()
                      .title('Investor Complaints Data')
                      .child(
                        S.document()
                          .schemaType('complaintsReport')
                          .documentId('complaintsReport.current')
                          .title('Investor Complaints Data'),
                      ),
                    S.divider(),
                    S.listItem()
                      .title('Timelines — Stock Broker')
                      .child(
                        S.document()
                          .schemaType('charterTimelines')
                          .documentId('charterTimelines.broker')
                          .title('Activities & Timelines — Stock Broker'),
                      ),
                    S.listItem()
                      .title('Timelines — Depository Participant')
                      .child(
                        S.document()
                          .schemaType('charterTimelines')
                          .documentId('charterTimelines.depository')
                          .title('Activities & Timelines — Depository Participant'),
                      ),
                  ]),
              ),

            S.divider(),
            S.listItem()
              .title('Site Documents')
              .child(
                S.documentTypeList('siteDocument').title('Site Documents'),
              ),

            S.divider(),
            S.listItem()
              .title('Downloads')
              .child(
                S.list()
                  .title('Downloads by category')
                  .items([
                    S.listItem()
                      .title('All downloads')
                      .child(S.documentTypeList('download').title('All downloads')),
                    S.divider(),
                    ...DOWNLOAD_CATEGORIES.map((cat) =>
                      S.listItem()
                        .title(cat)
                        .child(
                          S.documentList()
                            .title(cat)
                            .filter('_type == "download" && category == $cat')
                            .params({ cat })
                            // New items created here land in the right category.
                            .initialValueTemplates([]),
                        ),
                    ),
                  ]),
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
