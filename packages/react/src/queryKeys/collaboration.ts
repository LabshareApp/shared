export const collaborationKeys = {
  collaborators: () => ['collaborators'] as const,
  availableLabs: () => ['availableLabs'] as const,

  collaboratorLabs: () => ['collaboratorLabs'] as const,

  collaboratorInventorySearch: (params: {
    labId?: string | null;
    searchText?: string | null;
    selectedLabIds?: string[] | null;
    sortBy?: string | null;
    sortDirection?: string | null;
    limit?: number | null;
  }) =>
    [
      'collaboratorInventorySearch',
      params.labId ?? null,
      params.searchText ?? '',
      (params.selectedLabIds ?? []).join(','),
      params.sortBy ?? null,
      params.sortDirection ?? null,
      params.limit ?? null,
    ] as const,

  collaboratorInventorySemanticSearch: (params: {
    labId?: string | null;
    searchText?: string | null;
    selectedLabIds?: string[] | null;
    sortBy?: string | null;
    sortDirection?: string | null;
    limit?: number | null;
  }) =>
    [
      'collaboratorInventorySemanticSearch',
      params.labId ?? null,
      params.searchText ?? '',
      (params.selectedLabIds ?? []).join(','),
      params.sortBy ?? null,
      params.sortDirection ?? null,
      params.limit ?? null,
    ] as const,
};

