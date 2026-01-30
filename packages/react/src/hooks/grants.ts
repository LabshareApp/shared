import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  CreateGrantRequest,
  CreateGrantTransactionRequest,
  Grant,
  GrantListResponse,
  GrantTransactionsResponse,
  MoveGrantTransactionRequest,
  OdcCategoriesResponse,
  UpdateGrantData,
} from '@labshare/shared-core';
import {
  createGrant,
  createGrantTransaction,
  deleteGrant,
  fetchOdcCategories,
  getGrant,
  getGrantTransactions,
  listGrants,
  moveGrantTransaction,
  updateGrant,
} from '@labshare/shared-core';

import { grantsList, grantItem, grantTransactions, odcCategories } from '../queryKeys/grants';

export function useGrantsList(
  client: ApiClient,
  params: { labId: string | null | undefined; status?: string | null; enabled?: boolean; page?: number; limit?: number }
) {
  return useQuery<GrantListResponse, Error>({
    queryKey: grantsList(params.labId, params.status ?? null),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return listGrants(client, {
        status: params.status ?? undefined,
        page: params.page,
        limit: params.limit,
      });
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30_000,
  });
}

export function useGrantItem(
  client: ApiClient,
  params: { grantId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.grantId ? String(params.grantId) : null;
  return useQuery<Grant | null, Error>({
    queryKey: grantItem(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      return getGrant(client, normalizedId);
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 30_000,
  });
}

export function useGrantTransactions(
  client: ApiClient,
  params: {
    grantId: string | null | undefined;
    type?: string | null;
    page?: number;
    limit?: number;
    enabled?: boolean;
  }
) {
  const normalizedId = params.grantId ? String(params.grantId) : null;
  return useQuery<GrantTransactionsResponse, Error>({
    queryKey: grantTransactions({
      grantId: normalizedId,
      type: params.type ?? null,
      page: params.page ?? null,
      limit: params.limit ?? null,
    }),
    queryFn: async () => {
      if (!normalizedId) throw new Error('grantId required');
      return getGrantTransactions(client, {
        grantId: normalizedId,
        type: params.type ?? undefined,
        page: params.page,
        limit: params.limit,
      });
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 30_000,
  });
}

export function useGrantMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createGrantMutation = useMutation({
    mutationFn: (payload: CreateGrantRequest) => createGrant(client, payload),
    onSuccess: () => {
      // Invalidate grants list to show the new grant
      queryClient.invalidateQueries({ queryKey: grantsList(null, null) });
    },
  });

  const updateGrantMutation = useMutation({
    mutationFn: ({ grantId, grantData }: { grantId: string; grantData: UpdateGrantData }) =>
      updateGrant(client, grantId, grantData),
    onSuccess: (_data, variables) => {
      // Invalidate the specific grant item and grants list
      queryClient.invalidateQueries({ queryKey: grantItem(variables.grantId) });
      queryClient.invalidateQueries({ queryKey: grantsList(null, null) });
    },
  });

  const deleteGrantMutation = useMutation({
    mutationFn: (grantId: string) => deleteGrant(client, grantId),
    onSuccess: (_data, grantId) => {
      // Remove the deleted grant from cache and invalidate grants list
      queryClient.removeQueries({ queryKey: grantItem(grantId) });
      queryClient.invalidateQueries({ queryKey: grantsList(null, null) });
      // Also invalidate any transactions for this grant
      queryClient.invalidateQueries({ queryKey: grantTransactions({ grantId, type: null, page: null, limit: null }) });
    },
  });

  const createGrantTransactionMutation = useMutation({
    mutationFn: (args: { grantId: string; payload: CreateGrantTransactionRequest }) =>
      createGrantTransaction(client, args),
    onSuccess: (_data, variables) => {
      // Invalidate grant transactions and grant item (to update spent amount)
      queryClient.invalidateQueries({ queryKey: grantTransactions({ grantId: variables.grantId, type: null, page: null, limit: null }) });
      queryClient.invalidateQueries({ queryKey: grantItem(variables.grantId) });
    },
  });

  const moveGrantTransactionMutation = useMutation({
    mutationFn: (payload: MoveGrantTransactionRequest) => moveGrantTransaction(client, payload),
    onSuccess: (data, variables) => {
      // Invalidate transactions for both old and new grants, and the grant items themselves
      // data contains fromGrantId and toGrantId from the response
      queryClient.invalidateQueries({ queryKey: grantTransactions({ grantId: data.fromGrantId, type: null, page: null, limit: null }) });
      queryClient.invalidateQueries({ queryKey: grantTransactions({ grantId: data.toGrantId, type: null, page: null, limit: null }) });
      queryClient.invalidateQueries({ queryKey: grantItem(data.fromGrantId) });
      queryClient.invalidateQueries({ queryKey: grantItem(data.toGrantId) });
    },
  });

  return {
    createGrantMutation,
    updateGrantMutation,
    deleteGrantMutation,
    createGrantTransactionMutation,
    moveGrantTransactionMutation,
  };
}

export function useOdcCategories(
  client: ApiClient,
  params: { enabled?: boolean } = {}
) {
  return useQuery<OdcCategoriesResponse, Error>({
    queryKey: odcCategories(),
    queryFn: () => fetchOdcCategories(client),
    enabled: params.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes - categories rarely change
  });
}




