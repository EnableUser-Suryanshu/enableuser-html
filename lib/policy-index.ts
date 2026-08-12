// Single entry point for every policy page on the site.
//
// `policies.ts` is generated from the previous site's static pages — do not
// hand-edit it. `policies-drafted.ts` holds pages that never existed there and
// were written fresh; those still carry a `draft` flag pending compliance review.

import { POLICY_PAGES } from './policies';
import { DRAFTED_POLICIES } from './policies-drafted';
import type { PolicyPage } from './policies';

export type { PolicyPage, PolicyBlock } from './policies';

export interface IndexedPolicy extends PolicyPage {
  draft?: boolean;
}

export const POLICY_GROUPS = [
  { key: 'compliance', label: 'Compliance & Policies' },
  { key: 'investor', label: 'Investor Relations' },
  { key: 'legal', label: 'Legal & Governance' },
] as const;

export const ALL_POLICIES: IndexedPolicy[] = [...POLICY_PAGES, ...DRAFTED_POLICIES];

export const getPolicyPage = (slug: string) => ALL_POLICIES.find((p) => p.slug === slug);

export const policiesInGroup = (group: string) =>
  ALL_POLICIES.filter((p) => p.group === group);
