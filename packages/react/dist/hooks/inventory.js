"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAllTags = useAllTags;
exports.useTagsByCategory = useTagsByCategory;
exports.useCustomGroups = useCustomGroups;
exports.useSpecificCustomGroup = useSpecificCustomGroup;
exports.useInventoryItem = useInventoryItem;
exports.useInventorySearch = useInventorySearch;
exports.useInventoryMutations = useInventoryMutations;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const inventory_1 = require("../queryKeys/inventory");
function useAllTags(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: inventory_1.inventoryKeys.tagsAll(),
        queryFn: async () => (0, shared_core_1.fetchTags)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 15 * 60 * 1000,
    });
}
function useTagsByCategory(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: inventory_1.inventoryKeys.tagsByCategory(params.category, params.labId),
        queryFn: async () => {
            if (!params.category || !params.labId)
                throw new Error('Category and labId required');
            return (0, shared_core_1.fetchTagsByCategory)(client, params.category, params.labId);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : (!!params.category && !!params.labId),
        staleTime: 60 * 1000,
    });
}
function useCustomGroups(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: inventory_1.inventoryKeys.customGroupsAll(options === null || options === void 0 ? void 0 : options.labId),
        queryFn: async () => (0, shared_core_1.fetchCustomGroups)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 10 * 60 * 1000,
    });
}
function useSpecificCustomGroup(client, params) {
    var _a;
    const normalizedId = params.groupId ? String(params.groupId) : null;
    const isDefaultGroup = !!normalizedId && normalizedId.startsWith('default-');
    return (0, react_query_1.useQuery)({
        queryKey: inventory_1.inventoryKeys.customGroupDetail(normalizedId),
        queryFn: async () => {
            if (!normalizedId || isDefaultGroup)
                return null;
            try {
                return await (0, shared_core_1.fetchCustomGroup)(client, normalizedId);
            }
            catch (e) {
                if ((e === null || e === void 0 ? void 0 : e.status) === 404)
                    return null;
                throw e;
            }
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : (!!normalizedId && !isDefaultGroup),
        staleTime: 5 * 60 * 1000,
    });
}
function useInventoryItem(client, params) {
    var _a;
    const normalizedId = params.itemId ? String(params.itemId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: inventory_1.inventoryKeys.inventoryItem(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            try {
                return await (0, shared_core_1.fetchInventoryItem)(client, normalizedId);
            }
            catch (e) {
                if ((e === null || e === void 0 ? void 0 : e.status) === 404)
                    return null;
                throw e;
            }
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 60 * 1000,
    });
}
function useInventorySearch(client, params) {
    var _a;
    return (0, react_query_1.useInfiniteQuery)({
        queryKey: inventory_1.inventoryKeys.search(params.queryKeyArgs),
        queryFn: async ({ pageParam = 1 }) => (0, shared_core_1.searchInventory)(client, params.searchRequest, pageParam, params.pageSize, params.sortBy, params.sortDirection),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => { var _a; return acc + (((_a = page.items) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
            if ((lastPage === null || lastPage === void 0 ? void 0 : lastPage.totalCount) !== undefined && totalFetched < lastPage.totalCount) {
                return allPages.length + 1;
            }
            return undefined;
        },
        placeholderData: (previousData) => previousData,
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : true,
    });
}
function useInventoryMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createGroupMutation = (0, react_query_1.useMutation)({
        mutationFn: (groupData) => (0, shared_core_1.createCustomGroup)(client, groupData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.customGroupsAll() });
        },
    });
    const updateGroupMutation = (0, react_query_1.useMutation)({
        mutationFn: (groupData) => (0, shared_core_1.updateCustomGroup)(client, groupData),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.customGroupsAll() });
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.customGroupDetail(variables.id) });
        },
    });
    const deleteGroupMutation = (0, react_query_1.useMutation)({
        mutationFn: (groupId) => (0, shared_core_1.deleteCustomGroup)(client, groupId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.customGroupsAll() });
            queryClient.removeQueries({ queryKey: inventory_1.inventoryKeys.customGroupDetail(variables) });
        },
    });
    const updateItemMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ itemId, data }) => (0, shared_core_1.updateInventoryItem)(client, itemId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventoryItem(variables.itemId) });
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory });
        },
    });
    const deleteItemMutation = (0, react_query_1.useMutation)({
        mutationFn: (itemId) => (0, shared_core_1.deleteInventoryItem)(client, itemId),
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: inventory_1.inventoryKeys.inventory });
            const previousData = queryClient.getQueriesData({ queryKey: inventory_1.inventoryKeys.inventory });
            queryClient.setQueriesData({ queryKey: inventory_1.inventoryKeys.inventory }, (oldData) => {
                if (!oldData)
                    return oldData;
                const newPages = oldData.pages.map((p, idx) => {
                    const updatedItems = p.items.filter((it) => { var _a; return ((_a = it._id) !== null && _a !== void 0 ? _a : it.id) !== itemId; });
                    return idx === 0
                        ? { ...p, items: updatedItems, totalCount: p.totalCount - 1 }
                        : { ...p, items: updatedItems };
                });
                return { ...oldData, pages: newPages };
            });
            return { previousData };
        },
        onError: (_err, _vars, context) => {
            if (context === null || context === void 0 ? void 0 : context.previousData) {
                context.previousData.forEach(([key, data]) => {
                    queryClient.setQueryData(key, data);
                });
            }
        },
        onSettled: (_, __, itemId) => {
            queryClient.removeQueries({ queryKey: inventory_1.inventoryKeys.inventoryItem(itemId) });
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory, refetchType: 'inactive' });
        },
    });
    const bulkDeleteItemsMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ itemIds }) => (0, shared_core_1.bulkDeleteInventoryItems)(client, itemIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory, refetchType: 'inactive' });
        },
    });
    const bulkAddTagsMutation = (0, react_query_1.useMutation)({
        mutationFn: async (payload) => (0, shared_core_1.bulkAddTagsToItems)(client, payload.itemIds, payload.tagIds, payload.category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory });
        },
    });
    const bulkRemoveTagsMutation = (0, react_query_1.useMutation)({
        mutationFn: async (payload) => (0, shared_core_1.bulkRemoveTagsFromItems)(client, payload.itemIds, payload.tagIds, payload.category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory });
        },
    });
    const addTagMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ itemId, tagId, category }) => (0, shared_core_1.addTagToItem)(client, itemId, tagId, category),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventoryItem(variables.itemId) });
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory });
        },
    });
    const removeTagMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ itemId, tagId, category }) => (0, shared_core_1.removeTagFromItem)(client, itemId, tagId, category),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventoryItem(variables.itemId) });
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory });
        },
    });
    const createItemMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ data }) => (0, shared_core_1.createInventoryItem)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory });
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
//# sourceMappingURL=inventory.js.map