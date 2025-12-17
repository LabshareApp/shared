import { stableStringify } from '@labshare/shared-core';

// Keep keys backwards-compatible with the existing mobile app query keys so
// wiring shared-react hooks does not force screen changes or cross-module cache churn.
export const inventoryKeys = {
  inventory: ['inventory'] as const,
  tags: ['tags'] as const,
  customGroups: ['customGroups'] as const,

  tagsAll: () => ['tags', 'all'] as const,
  tagsByCategory: (category: string | null, labId: string | null | undefined) =>
    ['tags', 'category', category, labId ?? null] as const,

  customGroupsAll: (labId?: string | null) => ['customGroups', 'all', labId ?? null] as const,
  customGroupDetail: (groupId: string | null) => ['customGroups', 'detail', groupId] as const,

  inventoryItem: (itemId: string | null) => ['inventoryItem', itemId] as const,

  // Matches the existing `useInventorySearch` queryKey shape:
  // ['inventory', appliedGroupId, stableStringify(activeFilters), sortBy, sortDirection, limit]
  search: (params: {
    appliedGroupId?: string | null;
    activeFiltersKey?: unknown;
    sortBy?: string | null;
    sortDirection?: string | null;
    limit?: number | null;
  }) =>
    [
      'inventory',
      params.appliedGroupId ?? null,
      stableStringify(params.activeFiltersKey ?? null),
      params.sortBy ?? null,
      params.sortDirection ?? null,
      params.limit ?? null,
    ] as const,
};

