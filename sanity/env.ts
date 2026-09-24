/**
 * Sanity connection details.
 *
 * `projectId` is deliberately public — it ships in the browser bundle and is
 * not a secret. Only the write token (used by the migration script) is, and
 * that lives in SANITY_API_WRITE_TOKEN, never in client code.
 *
 * Everything degrades gracefully: with no project configured the site falls
 * back to lib/downloads.json, so the Downloads page keeps working.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-16';

/** True once a project is wired up; the studio and queries stay dormant until then. */
export const sanityConfigured = Boolean(projectId);
