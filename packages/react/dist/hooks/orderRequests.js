"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrderRequestsList = useOrderRequestsList;
exports.useOrderRequestItem = useOrderRequestItem;
exports.useArchivedOrderRequestItem = useArchivedOrderRequestItem;
exports.useArchivedOrderRequests = useArchivedOrderRequests;
exports.useOrderRequestSearch = useOrderRequestSearch;
exports.useOrderRequestMutations = useOrderRequestMutations;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const orderRequests_1 = require("../queryKeys/orderRequests");
function useOrderRequestsList(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: orderRequests_1.orderRequestKeys.listAll(params.labId),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.fetchOrderRequests)(client, params.labId, params.view);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.labId,
        staleTime: 30 * 1000,
    });
}
function useOrderRequestItem(client, params) {
    var _a;
    const normalizedId = params.orderRequestId ? String(params.orderRequestId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: orderRequests_1.orderRequestKeys.orderRequestItem(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            const res = await (0, shared_core_1.fetchOrderRequest)(client, normalizedId);
            return res.orderRequest;
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 30 * 1000,
    });
}
function useArchivedOrderRequestItem(client, params) {
    var _a;
    const normalizedId = params.archivedOrderRequestId ? String(params.archivedOrderRequestId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: orderRequests_1.orderRequestKeys.archivedOrderRequest(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            const res = await (0, shared_core_1.fetchArchivedOrderRequest)(client, normalizedId);
            return res.orderRequest;
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 30 * 1000,
    });
}
function useArchivedOrderRequests(client, params) {
    var _a, _b;
    return (0, react_query_1.useQuery)({
        queryKey: ['archivedOrderRequests', 'all', (_a = params.labId) !== null && _a !== void 0 ? _a : null],
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.fetchArchivedOrderRequests)(client, params.labId);
        },
        enabled: (_b = params.enabled) !== null && _b !== void 0 ? _b : !!params.labId,
        staleTime: 30 * 1000,
    });
}
function useOrderRequestSearch(client, params) {
    var _a, _b;
    return (0, react_query_1.useInfiniteQuery)({
        queryKey: orderRequests_1.orderRequestKeys.search({
            labId: params.queryKeyArgs.labId,
            activeFiltersKey: params.queryKeyArgs.activeFiltersKey,
            sortBy: params.queryKeyArgs.sortBy,
            sortDirection: params.queryKeyArgs.sortDirection,
            limit: params.queryKeyArgs.limit,
            view: (_a = params.queryKeyArgs.view) !== null && _a !== void 0 ? _a : null,
        }),
        queryFn: async ({ pageParam = 1, signal }) => (0, shared_core_1.searchOrderRequests)(client, params.searchRequest, pageParam, params.pageSize, params.sortBy, params.sortDirection, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => { var _a; return acc + (((_a = page.items) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
            if ((lastPage === null || lastPage === void 0 ? void 0 : lastPage.totalCount) !== undefined && totalFetched < lastPage.totalCount) {
                return allPages.length + 1;
            }
            return undefined;
        },
        placeholderData: undefined,
        enabled: (_b = params.enabled) !== null && _b !== void 0 ? _b : true,
        staleTime: 30 * 1000, // Cache for 30 seconds
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on mount if data is fresh
    });
}
function useOrderRequestMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const invalidateSearch = () => {
        queryClient.invalidateQueries({
            predicate: (q) => q.queryKey[0] === orderRequests_1.orderRequestKeys.searchRoot()[0],
        });
        queryClient.invalidateQueries({ queryKey: ['orderRequests', 'all'] });
    };
    const createOrderRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createOrderRequest)(client, data),
        onSuccess: invalidateSearch,
    });
    const updateOrderRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ orderRequestId, data }) => (0, shared_core_1.updateOrderRequest)(client, orderRequestId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: orderRequests_1.orderRequestKeys.orderRequestItem(variables.orderRequestId) });
            invalidateSearch();
        },
    });
    const placeOrderRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.placeOrderRequest)(client, payload),
        onSuccess: invalidateSearch,
    });
    const revertPlacedOrderRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ orderRequestId }) => (0, shared_core_1.revertPlacedOrderRequest)(client, orderRequestId),
        onSuccess: invalidateSearch,
    });
    const moveToInventoryMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ orderRequestId, quantity, locationId, }) => (0, shared_core_1.moveOrderRequestToInventory)(client, orderRequestId, quantity, locationId),
        onSuccess: invalidateSearch,
    });
    const bulkMoveToInventoryMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ orderRequestIds, locationId }) => (0, shared_core_1.bulkMoveOrderRequestsToInventory)(client, orderRequestIds, locationId),
        onSuccess: invalidateSearch,
    });
    const bulkPlaceOrderRequestsMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.bulkPlaceOrderRequests)(client, payload),
        onSuccess: invalidateSearch,
    });
    const deleteOrderRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: (orderRequestId) => (0, shared_core_1.deleteOrderRequest)(client, orderRequestId),
        onSuccess: invalidateSearch,
    });
    const bulkDeleteOrderRequestsMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ orderRequestIds }) => (0, shared_core_1.bulkDeleteOrderRequests)(client, orderRequestIds),
        onSuccess: invalidateSearch,
    });
    const bulkAddTagsMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.bulkAddTagsToOrderRequests)(client, payload.orderRequestIds, payload.tagIds, payload.category),
        onSuccess: invalidateSearch,
    });
    const bulkRemoveTagsMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.bulkRemoveTagsFromOrderRequests)(client, payload.orderRequestIds, payload.tagIds, payload.category),
        onSuccess: invalidateSearch,
    });
    const reRequestArchivedOrderMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.reRequestArchivedOrder)(client, payload),
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
//# sourceMappingURL=orderRequests.js.map