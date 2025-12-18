import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  Collaborator,
  CollaboratorSearchResponse,
  CollaboratorSearchParams,
  LabInfo,
} from '@labshare/shared-core';
import {
  acceptCollaboratorRequest,
  createCollaboratorRequest,
  deleteCollaborator,
  getAvailableLabs,
  listCollaborators,
  searchCollaboratorItems,
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
    activeFilters: { searchText: string; selectedLabIds: string[] };
    sortingState: { sortBy: 'name' | 'date' | 'updatedAt'; sortDirection: 'asc' | 'desc' };
    limit: number;
    enabled?: boolean;
  }
) {
  return useInfiniteQuery<CollaboratorSearchResponse, Error>({
    queryKey: collaborationKeys.collaboratorInventorySearch({
      labId: null,
      searchText: params.activeFilters.searchText,
      selectedLabIds: params.activeFilters.selectedLabIds,
      sortBy: params.sortingState.sortBy,
      sortDirection: params.sortingState.sortDirection,
      limit: params.limit,
    }),
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams: CollaboratorSearchParams = {
        term: params.activeFilters.searchText.trim() || undefined,
        page: pageParam as number,
        limit: params.limit,
        labIds: params.activeFilters.selectedLabIds.length > 0 ? params.activeFilters.selectedLabIds : undefined,
      };
      return searchCollaboratorItems(client, searchParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage && lastPage.nextPage > 0 ? lastPage.nextPage : undefined,
    enabled: params.enabled ?? true,
    staleTime: 0,
  });
}

