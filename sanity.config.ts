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
  plugins: [
    structureTool({
      // Group downloads by category. Eighty items in one flat list is
      // unmanageable; this matches how they appear on the site.
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
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
