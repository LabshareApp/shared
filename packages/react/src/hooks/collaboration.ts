import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  Collaborator,
  CollaboratorSearchResponse,
  CollaboratorSearchParams,
  LabInfo,
  SearchRequest,
  TagCategory,
  AttributeFilter,
} from '@labshare/shared-core';
import {
  acceptCollaboratorRequest,
  createCollaboratorRequest,
  deleteCollaborator,
  getAvailableLabs,
  listCollaborators,
  searchCollaboratorItems,
  searchCollaboratorItemsWithFilters,
  FilterOperation,
} from '@labshare/shared-core';

import { collaborationKeys } from '../queryKeys/collaboration';

export function useCollaborators(client: ApiClient, options?: { enabled?: boolean }) {
  return useQuery<Collaborator[], Error>({
    queryKey: collaborationKeys.collaborators(),
    queryFn: () => listCollaborators(client),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAvailableLabs(client: ApiClient, options?: { enabled?: boolean }) {
  return useQuery<LabInfo[], Error>({
    queryKey: collaborationKeys.availableLabs(),
    queryFn: () => getAvailableLabs(client),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollaborationMutations(client: ApiClient) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: collaborationKeys.collaborators() });

  const createRequestMutation = useMutation({
    mutationFn: (targetLabId: string) => createCollaboratorRequest(client, targetLabId),
    onSuccess: invalidate,
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (requestingLabId: string) => acceptCollaboratorRequest(client, requestingLabId),
    onSuccess: invalidate,
  });

  const deleteCollaboratorMutation = useMutation({
    mutationFn: (collaboratorLabId: string) => deleteCollaborator(client, collaboratorLabId),
    onSuccess: invalidate,
  });

  return { createRequestMutation, acceptRequestMutation, deleteCollaboratorMutation };
}

export function useCollaboratorInventorySearch(
  client: ApiClient,
  params: {
    activeFilters: { 
      searchText: string; 
      selectedLabIds: string[];
      tags?: Partial<Record<TagCategory, string[]>>;
      attributes?: AttributeFilter[];
      filterOperation?: FilterOperation;
    };
    sortingState: { sortBy: 'name' | 'date' | 'updatedAt'; sortDirection: 'asc' | 'desc' };
    limit: number;
    enabled?: boolean;
  }
) {
  // Check if we have filters (tags or attributes) - if so, use new SearchRequest endpoint
  const hasFilters = params.activeFilters.tags && Object.values(params.activeFilters.tags).some(ids => ids && ids.length > 0) ||
                     (params.activeFilters.attributes && params.activeFilters.attributes.length > 0);

  return useInfiniteQuery<CollaboratorSearchResponse, Error>({
    queryKey: collaborationKeys.collaboratorInventorySearch({
      labId: null,
      searchText: params.activeFilters.searchText,
      selectedLabIds: params.activeFilters.selectedLabIds,
      sortBy: params.sortingState.sortBy,
      sortDirection: params.sortingState.sortDirection,
      limit: params.limit,
      tags: params.activeFilters.tags,
      attributes: params.activeFilters.attributes,
      filterOperation: params.activeFilters.filterOperation,
    }),
    queryFn: async ({ pageParam = 1, signal }) => {
      if (hasFilters) {
        // Use new SearchRequest endpoint
        const searchRequest: SearchRequest = {
          useCustomGroup: false,
          query: {
            operation: params.activeFilters.filterOperation || FilterOperation.AND,
            filters: params.activeFilters.tags ? Object.entries(params.activeFilters.tags)
              .filter(([_, ids]) => ids && ids.length > 0)
              .map(([category, tagIds]) => ({
                category: category as TagCategory,
                tagIds: tagIds,
                operator: FilterOperation.OR,
              })) : [],
            attributeFilters: params.activeFilters.attributes || [],
          },
          globalSearchTerm: params.activeFilters.searchText.trim() || '',
          selectedLabIds: params.activeFilters.selectedLabIds.length > 0 ? params.activeFilters.selectedLabIds : undefined,
        };

        // Clean up empty arrays
        if (searchRequest.query.filters?.length === 0) delete searchRequest.query.filters;
        if (searchRequest.query.attributeFilters?.length === 0) delete searchRequest.query.attributeFilters;

        return searchCollaboratorItemsWithFilters(
          client,
          searchRequest,
          pageParam as number,
          params.limit,
          params.sortingState.sortBy === 'date' ? 'updatedAt' : params.sortingState.sortBy,
          params.sortingState.sortDirection,
          signal
        );
      } else {
        // Use legacy GET endpoint for backward compatibility
        const searchParams: CollaboratorSearchParams = {
          term: params.activeFilters.searchText.trim() || undefined,
          page: pageParam as number,
          limit: params.limit,
          labIds: params.activeFilters.selectedLabIds.length > 0 ? params.activeFilters.selectedLabIds : undefined,
        };
        return searchCollaboratorItems(client, searchParams, signal);
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage && lastPage.nextPage > 0 ? lastPage.nextPage : undefined,
    enabled: params.enabled ?? true,
    staleTime: 30 * 1000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh
  });
}





