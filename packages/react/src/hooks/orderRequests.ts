import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  CreateOrderRequestData,
  OrderRequestItem,
  ReRequestOrderPayload,
  SearchRequest,
  TagCategory,
} from '@labshare/shared-core';
import {
  bulkAddTagsToOrderRequests,
  bulkDeleteOrderRequests,
  bulkMoveOrderRequestsToInventory,
  bulkPlaceOrderRequests,
  bulkRemoveTagsFromOrderRequests,
  createOrderRequest,
  deleteOrderRequest,
  fetchArchivedOrderRequest,
  fetchArchivedOrderRequests,
  fetchOrderRequest,
  fetchOrderRequests,
  moveOrderRequestToInventory,
  placeOrderRequest,
  reRequestArchivedOrder,
  revertPlacedOrderRequest,
  searchOrderRequests,
  updateOrderRequest,
} from '@labshare/shared-core';

import { orderRequestKeys } from '../queryKeys/orderRequests';

export function useOrderRequestsList(
  client: ApiClient,
  params: { labId: string | null | undefined; view?: 'current' | 'placed' | 'archived'; enabled?: boolean }
) {
  return useQuery<{ orderRequests: OrderRequestItem[]; totalCount: number }, Error>({
    queryKey: orderRequestKeys.listAll(params.labId),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return fetchOrderRequests(client, params.labId, params.view);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30 * 1000,
  });
}

export function useOrderRequestItem(
  client: ApiClient,
  params: { orderRequestId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.orderRequestId ? String(params.orderRequestId) : null;
  return useQuery<OrderRequestItem | null, Error>({
    queryKey: orderRequestKeys.orderRequestItem(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      const res = await fetchOrderRequest(client, normalizedId);
      return res.orderRequest;
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 30 * 1000,
  });
}

export function useArchivedOrderRequestItem(
  client: ApiClient,
  params: { archivedOrderRequestId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.archivedOrderRequestId ? String(params.archivedOrderRequestId) : null;
  return useQuery<OrderRequestItem | null, Error>({
    queryKey: orderRequestKeys.archivedOrderRequest(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      const res = await fetchArchivedOrderRequest(client, normalizedId);
      return res.orderRequest;
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 30 * 1000,
  });
}

export function useArchivedOrderRequests(
  client: ApiClient,
  params: { labId: string | null | undefined; enabled?: boolean }
) {
  return useQuery<OrderRequestItem[], Error>({
    queryKey: ['archivedOrderRequests', 'all', params.labId ?? null],
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return fetchArchivedOrderRequests(client, params.labId);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30 * 1000,
  });
}

export function useOrderRequestSearch(
  client: ApiClient,
  params: {
    searchRequest: SearchRequest;
    queryKeyArgs: {
      labId: string | null | undefined;
      activeFiltersKey?: unknown;
      sortBy?: string | null;
      sortDirection?: string | null;
      limit?: number | null;
      view?: 'current' | 'placed' | 'archived' | null;
    };
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    enabled?: boolean;
  }
) {
  return useInfiniteQuery<{ items: OrderRequestItem[]; totalCount: number }, Error>({
    queryKey: orderRequestKeys.search({
      labId: params.queryKeyArgs.labId,
      activeFiltersKey: params.queryKeyArgs.activeFiltersKey,
      sortBy: params.queryKeyArgs.sortBy,
      sortDirection: params.queryKeyArgs.sortDirection,
      limit: params.queryKeyArgs.limit,
      view: params.queryKeyArgs.view ?? null,
    }),
    queryFn: async ({ pageParam = 1 }) =>
      searchOrderRequests(
        client,
        params.searchRequest,
        pageParam as number,
        params.pageSize,
        params.sortBy,
        params.sortDirection
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + (page.items?.length || 0), 0);
      if (lastPage?.totalCount !== undefined && totalFetched < lastPage.totalCount) {
        return allPages.length + 1;
      }
      return undefined;
    },
    placeholderData: undefined,
    enabled: params.enabled ?? true,
    staleTime: 0,
  });
}

export function useOrderRequestMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const invalidateSearch = () => {
    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === orderRequestKeys.searchRoot()[0],
    });
    queryClient.invalidateQueries({ queryKey: ['orderRequests', 'all'] });
  };

  const createOrderRequestMutation = useMutation({
    mutationFn: (data: CreateOrderRequestData) => createOrderRequest(client, data),
    onSuccess: invalidateSearch,
  });

  type OrderRequestUpdatePayload = Parameters<typeof updateOrderRequest>[2];
  const updateOrderRequestMutation = useMutation({
    mutationFn: ({ orderRequestId, data }: { orderRequestId: string; data: OrderRequestUpdatePayload }) =>
      updateOrderRequest(client, orderRequestId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderRequestKeys.orderRequestItem(variables.orderRequestId) });
      invalidateSearch();
    },
  });

  const placeOrderRequestMutation = useMutation({
    mutationFn: ({ orderRequestId }: { orderRequestId: string }) => placeOrderRequest(client, orderRequestId),
    onSuccess: invalidateSearch,
  });

  const revertPlacedOrderRequestMutation = useMutation({
    mutationFn: ({ orderRequestId }: { orderRequestId: string }) => revertPlacedOrderRequest(client, orderRequestId),
    onSuccess: invalidateSearch,
  });

  const moveToInventoryMutation = useMutation({
    mutationFn: ({
      orderRequestId,
      quantity,
      locationId,
    }: {
      orderRequestId: string;
      quantity: number;
      locationId?: string;
    }) => moveOrderRequestToInventory(client, orderRequestId, quantity, locationId),
    onSuccess: invalidateSearch,
  });

  const bulkMoveToInventoryMutation = useMutation({
    mutationFn: ({ orderRequestIds, locationId }: { orderRequestIds: string[]; locationId?: string }) =>
      bulkMoveOrderRequestsToInventory(client, orderRequestIds, locationId),
    onSuccess: invalidateSearch,
  });

  const bulkPlaceOrderRequestsMutation = useMutation({
    mutationFn: ({ orderRequestIds }: { orderRequestIds: string[] }) => bulkPlaceOrderRequests(client, orderRequestIds),
    onSuccess: invalidateSearch,
  });

  const deleteOrderRequestMutation = useMutation({
    mutationFn: (orderRequestId: string) => deleteOrderRequest(client, orderRequestId),
    onSuccess: invalidateSearch,
  });

  const bulkDeleteOrderRequestsMutation = useMutation({
    mutationFn: ({ orderRequestIds }: { orderRequestIds: string[] }) => bulkDeleteOrderRequests(client, orderRequestIds),
    onSuccess: invalidateSearch,
  });

  const bulkAddTagsMutation = useMutation({
    mutationFn: (payload: { orderRequestIds: string[]; tagIds: string[]; category: TagCategory }) =>
      bulkAddTagsToOrderRequests(client, payload.orderRequestIds, payload.tagIds, payload.category),
    onSuccess: invalidateSearch,
  });

  const bulkRemoveTagsMutation = useMutation({
    mutationFn: (payload: { orderRequestIds: string[]; tagIds: string[]; category: TagCategory }) =>
      bulkRemoveTagsFromOrderRequests(client, payload.orderRequestIds, payload.tagIds, payload.category),
    onSuccess: invalidateSearch,
  });

  const reRequestArchivedOrderMutation = useMutation({
    mutationFn: (payload: ReRequestOrderPayload) => reRequestArchivedOrder(client, payload),
    onSuccess: invalidateSearch,
  });

  return {
    createOrderRequestMutation,
    updateOrderRequestMutation,
    placeOrderRequestMutation,
    revertPlacedOrderRequestMutation,
    moveToInventoryMutation,
    bulkMoveToInventoryMutation,
    bulkPlaceOrderRequestsMutation,
    deleteOrderRequestMutation,
    bulkDeleteOrderRequestsMutation,
    bulkAddTagsMutation,
    bulkRemoveTagsMutation,
    reRequestArchivedOrderMutation,
  };
}

