import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiClient, CreateItemRequestRequest, CreateItemRequestResponse, ListItemRequestsResponse } from '@labshare/shared-core';
import {
  acceptItemRequest,
  cancelItemRequest,
  createItemRequest,
  denyItemRequest,
  fulfillItemRequest,
  listItemRequests,
} from '@labshare/shared-core';

import { itemRequestKeys } from '../queryKeys/itemRequests';

export function useListItemRequestsShared(
  client: ApiClient,
  params: { q?: string; direction?: string; status?: string; page?: number; limit?: number; enabled?: boolean }
) {
  const { enabled, ...queryParams } = params;
  return useQuery<ListItemRequestsResponse, Error>({
    queryKey: itemRequestKeys.list(queryParams),
    queryFn: () => listItemRequests(client, queryParams),
    enabled: enabled ?? true,
    staleTime: 15_000,
    placeholderData: (previousData) => previousData,
  });
}

export function useItemRequestMutations(client: ApiClient) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['itemRequests'] });

  const createMutation = useMutation<CreateItemRequestResponse, Error, CreateItemRequestRequest>({
    mutationFn: (body) => createItemRequest(client, body),
    onSuccess: invalidate,
  });

  const acceptMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (requestId) => acceptItemRequest(client, requestId),
    onSuccess: invalidate,
  });

  const denyMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (requestId) => denyItemRequest(client, requestId),
    onSuccess: invalidate,
  });

  const fulfillMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (requestId) => fulfillItemRequest(client, requestId),
    onSuccess: invalidate,
  });

  const cancelMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (requestId) => cancelItemRequest(client, requestId),
    onSuccess: invalidate,
  });

  return { createMutation, acceptMutation, denyMutation, fulfillMutation, cancelMutation };
}



