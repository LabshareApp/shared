import { useQuery } from '@tanstack/react-query';
import type {
  ApiClient,
  CollaborationHistoryResponse,
  InstitutionOrderRequestsResponse,
  InstitutionInventoryResponse,
} from '@labshare/shared-core';
import {
  getCollaborationHistory,
  searchInstitutionOrderRequests,
  searchInstitutionInventory,
} from '@labshare/shared-core';

import {
  institutionCollaborationHistory,
  institutionOrderRequests,
  institutionInventory,
} from '../queryKeys/institution';

/**
 * Hook to fetch collaboration history with statistics (admin only)
 */
export function useCollaborationHistory(
  client: ApiClient,
  params: {
    institutionId: string | null | undefined;
    enabled?: boolean;
  }
) {
  return useQuery<CollaborationHistoryResponse, Error>({
    queryKey: institutionCollaborationHistory(params.institutionId),
    queryFn: async () => {
      if (!params.institutionId) throw new Error('institutionId required');
      return getCollaborationHistory(client, params.institutionId);
    },
    enabled: params.enabled ?? !!params.institutionId,
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to search order requests across all institution labs (admin only)
 */
export function useInstitutionOrderRequests(
  client: ApiClient,
  params: {
    institutionId: string | null | undefined;
    view: 'current' | 'placed' | 'archived';
    labIds?: string[];
    query?: string;
    page?: number;
    limit?: number;
    enabled?: boolean;
  }
) {
  return useQuery<InstitutionOrderRequestsResponse, Error>({
    queryKey: institutionOrderRequests({
      institutionId: params.institutionId,
      view: params.view,
      labIds: params.labIds ?? null,
      query: params.query ?? null,
      page: params.page ?? null,
    }),
    queryFn: async () => {
      if (!params.institutionId) throw new Error('institutionId required');
      return searchInstitutionOrderRequests(client, params.institutionId, {
        view: params.view,
        labIds: params.labIds,
        query: params.query,
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      });
    },
    enabled: params.enabled ?? !!params.institutionId,
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to search inventory across all institution labs (admin only)
 */
export function useInstitutionInventorySearch(
  client: ApiClient,
  params: {
    institutionId: string | null | undefined;
    labIds?: string[];
    query?: string;
    page?: number;
    limit?: number;
    enabled?: boolean;
  }
) {
  return useQuery<InstitutionInventoryResponse, Error>({
    queryKey: institutionInventory({
      institutionId: params.institutionId,
      labIds: params.labIds ?? null,
      query: params.query ?? null,
      page: params.page ?? null,
    }),
    queryFn: async () => {
      if (!params.institutionId) throw new Error('institutionId required');
      return searchInstitutionInventory(client, params.institutionId, {
        labIds: params.labIds,
        query: params.query,
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      });
    },
    enabled: params.enabled ?? !!params.institutionId,
    staleTime: 30_000, // 30 seconds
  });
}
