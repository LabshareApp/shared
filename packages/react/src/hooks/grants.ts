import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  ApiClient,
  CreateGrantRequest,
  CreateGrantTransactionRequest,
  Grant,
  GrantListResponse,
  GrantTransactionsResponse,
  MoveGrantTransactionRequest,
  UpdateGrantData,
} from '@labshare/shared-core';
import {
  createGrant,
  createGrantTransaction,
  deleteGrant,
  getGrant,
  getGrantTransactions,
  listGrants,
  moveGrantTransaction,
  updateGrant,
} from '@labshare/shared-core';

import { grantsList, grantItem, grantTransactions } from '../queryKeys/grants';

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
  const createGrantMutation = useMutation({
    mutationFn: (payload: CreateGrantRequest) => createGrant(client, payload),
  });

  const updateGrantMutation = useMutation({
    mutationFn: ({ grantId, grantData }: { grantId: string; grantData: UpdateGrantData }) =>
      updateGrant(client, grantId, grantData),
  });

  const deleteGrantMutation = useMutation({
    mutationFn: (grantId: string) => deleteGrant(client, grantId),
  });

  const createGrantTransactionMutation = useMutation({
    mutationFn: (args: { grantId: string; payload: CreateGrantTransactionRequest }) =>
      createGrantTransaction(client, args),
  });

  const moveGrantTransactionMutation = useMutation({
    mutationFn: (payload: MoveGrantTransactionRequest) => moveGrantTransaction(client, payload),
  });

  return {
    createGrantMutation,
    updateGrantMutation,
    deleteGrantMutation,
    createGrantTransactionMutation,
    moveGrantTransactionMutation,
  };
}




