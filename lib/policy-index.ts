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

/**
 * Re-filing for pages whose generated `group` puts them in the wrong place.
 *
 * Applied here rather than in policies.ts because that file is generated from
 * the previous site and is not hand-edited — an edit there would be lost the
 * next time it is regenerated. This map survives.
 *
 * RMS and GTT arrived under "Legal & Governance". Both describe how we
 * actually operate an account — risk limits and square-offs, and how a
 * good-till-triggered order behaves — so they belong with the operating
 * policies a client reads before trading, not with the site's legal notices.
 */
const GROUP_OVERRIDES: Record<string, PolicyPage['group']> = {
  'rms-policy': 'compliance',
  'gtt-policy': 'compliance',
};

export const ALL_POLICIES: IndexedPolicy[] = [...POLICY_PAGES, ...DRAFTED_POLICIES].map((p) =>
  GROUP_OVERRIDES[p.slug] ? { ...p, group: GROUP_OVERRIDES[p.slug] } : p,
);

export const getPolicyPage = (slug: string) => ALL_POLICIES.find((p) => p.slug === slug);

/** Pages the previous site presented as tabs under a single heading. */
const CHARTER_TABS = [
  { label: 'Stock Broker', slug: 'investor-charter' },
  { label: 'Depository Participant', slug: 'investor-charter-depository' },
] as const;

const TAB_GROUPS: Record<string, readonly { label: string; slug: string }[]> = {
  'investor-charter': CHARTER_TABS,
  'investor-charter-depository': CHARTER_TABS,
};

export const policyTabs = (slug: string) => TAB_GROUPS[slug];

export const policiesInGroup = (group: string) =>
  ALL_POLICIES.filter((p) => p.group === group);
