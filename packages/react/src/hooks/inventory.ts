import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  BackendCustomGroup,
  BackendTag,
  CreateCustomGroupData,
  CreateItemData,
  InventoryItem,
  SearchRequest,
  TagCategory,
  UpdateCustomGroupData,
} from '@labshare/shared-core';
import {
  addTagToItem,
  bulkAddTagsToItems,
  bulkDeleteInventoryItems,
  bulkRemoveTagsFromItems,
  createCustomGroup,
  createInventoryItem,
  deleteCustomGroup,
  deleteInventoryItem,
  fetchCustomGroup,
  fetchCustomGroups,
  fetchInventoryItem,
  fetchTags,
  fetchTagsByCategory,
  removeTagFromItem,
  searchInventory,
  updateCustomGroup,
  updateInventoryItem,
  type ApiError,
} from '@labshare/shared-core';

import { inventoryKeys } from '../queryKeys/inventory';

export function useAllTags(client: ApiClient, options?: { enabled?: boolean }) {
  return useQuery<BackendTag[], Error>({
    queryKey: inventoryKeys.tagsAll(),
    queryFn: async () => fetchTags(client),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 60 * 1000, // 30 minutes (tags change infrequently)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useTagsByCategory(
  client: ApiClient,
  params: { category: TagCategory | null; labId: string | null | undefined; enabled?: boolean }
) {
  return useQuery<BackendTag[], Error>({
    queryKey: inventoryKeys.tagsByCategory(params.category as any, params.labId),
    queryFn: async () => {
      if (!params.category || !params.labId) throw new Error('Category and labId required');
      return fetchTagsByCategory(client, params.category, params.labId);
    },
    enabled: params.enabled ?? (!!params.category && !!params.labId),
    staleTime: 15 * 60 * 1000, // 15 minutes (tags change infrequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCustomGroups(client: ApiClient, options?: { enabled?: boolean; labId?: string | null }) {
  return useQuery<BackendCustomGroup[], Error>({
    queryKey: inventoryKeys.customGroupsAll(options?.labId),
    queryFn: async () => fetchCustomGroups(client),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 60 * 1000, // 30 minutes (custom groups change infrequently)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useSpecificCustomGroup(
  client: ApiClient,
  params: { groupId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.groupId ? String(params.groupId) : null;
  const isDefaultGroup = !!normalizedId && normalizedId.startsWith('default-');

  return useQuery<BackendCustomGroup | null, ApiError | Error>({
    queryKey: inventoryKeys.customGroupDetail(normalizedId),
    queryFn: async () => {
      if (!normalizedId || isDefaultGroup) return null;
      try {
        return await fetchCustomGroup(client, normalizedId);
      } catch (e: any) {
        if (e?.status === 404) return null;
        throw e;
      }
    },
    enabled: params.enabled ?? (!!normalizedId && !isDefaultGroup),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useInventoryItem(
  client: ApiClient,
  params: { itemId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.itemId ? String(params.itemId) : null;

  return useQuery<InventoryItem | null, ApiError | Error>({
    queryKey: inventoryKeys.inventoryItem(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      try {
        return await fetchInventoryItem(client, normalizedId);
      } catch (e: any) {
        if (e?.status === 404) return null;
        throw e;
      }
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 60 * 1000,
  });
}

export function useInventorySearch(
  client: ApiClient,
  params: {
    searchRequest: SearchRequest;
    queryKeyArgs: {
      appliedGroupId?: string | null;
      activeFiltersKey?: unknown;
      sortBy?: string | null;
      sortDirection?: string | null;
      limit?: number | null;
    };
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    enabled?: boolean;
  }
) {
  return useInfiniteQuery<{ items: InventoryItem[]; totalCount: number }, Error>({
    queryKey: inventoryKeys.search(params.queryKeyArgs),
    queryFn: async ({ pageParam = 1, signal }) =>
      searchInventory(
        client,
        params.searchRequest,
        pageParam as number,
        params.pageSize,
        params.sortBy,
        params.sortDirection,
        signal
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + (page.items?.length || 0), 0);
      if (lastPage?.totalCount !== undefined && totalFetched < lastPage.totalCount) {
        return allPages.length + 1;
      }
      return undefined;
    },
    placeholderData: (previousData) => {
      // Return previous data if it exists and query key structure matches
      // This provides optimistic updates when filters change slightly
      if (previousData && previousData.pages && previousData.pages.length > 0) {
        return previousData;
      }
      return undefined;
    },
    enabled: params.enabled ?? true,
    staleTime: 60 * 1000, // Cache for 1 minute (good balance for inventory data)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh
  });
}

export function useInventoryMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: (groupData: CreateCustomGroupData) => createCustomGroup(client, groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.customGroupsAll() });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: (groupData: UpdateCustomGroupData) => updateCustomGroup(client, groupData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.customGroupsAll() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.customGroupDetail(variables.id) });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: string) => deleteCustomGroup(client, groupId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.customGroupsAll() });
      queryClient.removeQueries({ queryKey: inventoryKeys.customGroupDetail(variables) });
    },
  });

  type ItemUpdatePayload = Parameters<typeof updateInventoryItem>[2];

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: ItemUpdatePayload }) =>
      updateInventoryItem(client, itemId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventoryItem(variables.itemId) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => deleteInventoryItem(client, itemId),
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.inventory });
      const previousData = queryClient.getQueriesData<any>({ queryKey: inventoryKeys.inventory });

      queryClient.setQueriesData({ queryKey: inventoryKeys.inventory }, (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((p: any, idx: number) => {
          const updatedItems = p.items.filter((it: InventoryItem) => it.id !== itemId);
          return idx === 0
            ? { ...p, items: updatedItems, totalCount: p.totalCount - 1 }
            : { ...p, items: updatedItems };
        });
        return { ...oldData, pages: newPages };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]: any) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: (_, __, itemId) => {
      queryClient.removeQueries({ queryKey: inventoryKeys.inventoryItem(itemId) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory, refetchType: 'inactive' });
    },
  });

  const bulkDeleteItemsMutation = useMutation({
    mutationFn: ({ itemIds }: { itemIds: string[] }) => bulkDeleteInventoryItems(client, itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
    },
  });

  const bulkAddTagsMutation = useMutation({
    mutationFn: async (payload: { itemIds: string[]; tagIds: string[]; category: TagCategory }) =>
      bulkAddTagsToItems(client, payload.itemIds, payload.tagIds, payload.category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
    },
  });

  const bulkRemoveTagsMutation = useMutation({
    mutationFn: async (payload: { itemIds: string[]; tagIds: string[]; category: TagCategory }) =>
      bulkRemoveTagsFromItems(client, payload.itemIds, payload.tagIds, payload.category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: ({ itemId, tagId, category }: { itemId: string; tagId: string; category: TagCategory }) =>
      addTagToItem(client, itemId, tagId, category),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventoryItem(variables.itemId) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: ({ itemId, tagId, category }: { itemId: string; tagId: string; category: TagCategory }) =>
      removeTagFromItem(client, itemId, tagId, category),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventoryItem(variables.itemId) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: ({ data }: { data: CreateItemData }) => createInventoryItem(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
    },
  });

  return {
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    updateItemMutation,
    deleteItemMutation,
    bulkDeleteItemsMutation,
    bulkAddTagsMutation,
    bulkRemoveTagsMutation,
    addTagMutation,
    removeTagMutation,
    createItemMutation,
  };
}

