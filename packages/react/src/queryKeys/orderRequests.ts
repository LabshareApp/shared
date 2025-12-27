import { stableStringify } from '@labshare/shared-core';

// Keep keys backwards-compatible with the existing mobile app query keys.
export const orderRequestKeys = {
  root: ['orderRequest'] as const,
  searchRoot: () => ['orderRequestSemanticSearch'] as const,

  tags: ['orderRequestTags'] as const,

  tagsAll: () => ['orderRequestTags', 'all'] as const,
  tagsByCategory: (category: string | null, labId: string | null | undefined) =>
    ['orderRequestTags', 'category', category, labId ?? null] as const,

  listAll: (labId: string | null | undefined) => ['orderRequests', 'all', labId ?? null] as const,

  orderRequestItem: (orderRequestId: string | null) => ['orderRequest', 'item', orderRequestId] as const,
  archivedOrderRequest: (archivedOrderRequestId: string | null) =>
    ['archivedOrderRequest', archivedOrderRequestId] as const,

  // Matches the existing mobile key shape:
  // ['orderRequestSemanticSearch', currentLabId, stableStringify(activeFilters), sortBy, sortDirection, limit, view]
  search: (params: {
    labId: string | null | undefined;
    activeFiltersKey?: unknown;
    sortBy?: string | null;
    sortDirection?: string | null;
    limit?: number | null;
    view?: string | null;
  }) =>
    [
      'orderRequestSemanticSearch',
      params.labId ?? null,
      stableStringify(params.activeFiltersKey ?? null),
      params.sortBy ?? null,
      params.sortDirection ?? null,
      params.limit ?? null,
      params.view ?? null,
    ] as const,
};



