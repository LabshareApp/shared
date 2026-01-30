"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGrantsList = useGrantsList;
exports.useGrantItem = useGrantItem;
exports.useGrantTransactions = useGrantTransactions;
exports.useGrantMutations = useGrantMutations;
exports.useOdcCategories = useOdcCategories;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const grants_1 = require("../queryKeys/grants");
function useGrantsList(client, params) {
    var _a, _b;
    return (0, react_query_1.useQuery)({
        queryKey: (0, grants_1.grantsList)(params.labId, (_a = params.status) !== null && _a !== void 0 ? _a : null),
        queryFn: async () => {
            var _a;
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.listGrants)(client, {
                status: (_a = params.status) !== null && _a !== void 0 ? _a : undefined,
                page: params.page,
                limit: params.limit,
            });
        },
        enabled: (_b = params.enabled) !== null && _b !== void 0 ? _b : !!params.labId,
        staleTime: 30000,
    });
}
function useGrantItem(client, params) {
    var _a;
    const normalizedId = params.grantId ? String(params.grantId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: (0, grants_1.grantItem)(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            return (0, shared_core_1.getGrant)(client, normalizedId);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 30000,
    });
}
function useGrantTransactions(client, params) {
    var _a, _b, _c, _d;
    const normalizedId = params.grantId ? String(params.grantId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: (0, grants_1.grantTransactions)({
            grantId: normalizedId,
            type: (_a = params.type) !== null && _a !== void 0 ? _a : null,
            page: (_b = params.page) !== null && _b !== void 0 ? _b : null,
            limit: (_c = params.limit) !== null && _c !== void 0 ? _c : null,
        }),
        queryFn: async () => {
            var _a;
            if (!normalizedId)
                throw new Error('grantId required');
            return (0, shared_core_1.getGrantTransactions)(client, {
                grantId: normalizedId,
                type: (_a = params.type) !== null && _a !== void 0 ? _a : undefined,
                page: params.page,
                limit: params.limit,
            });
        },
        enabled: (_d = params.enabled) !== null && _d !== void 0 ? _d : !!normalizedId,
        staleTime: 30000,
    });
}
function useGrantMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createGrantMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.createGrant)(client, payload),
        onSuccess: () => {
            // Invalidate grants list to show the new grant
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantsList)(null, null) });
        },
    });
    const updateGrantMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ grantId, grantData }) => (0, shared_core_1.updateGrant)(client, grantId, grantData),
        onSuccess: (_data, variables) => {
            // Invalidate the specific grant item and grants list
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantItem)(variables.grantId) });
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantsList)(null, null) });
        },
    });
    const deleteGrantMutation = (0, react_query_1.useMutation)({
        mutationFn: (grantId) => (0, shared_core_1.deleteGrant)(client, grantId),
        onSuccess: (_data, grantId) => {
            // Remove the deleted grant from cache and invalidate grants list
            queryClient.removeQueries({ queryKey: (0, grants_1.grantItem)(grantId) });
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantsList)(null, null) });
            // Also invalidate any transactions for this grant
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantTransactions)({ grantId, type: null, page: null, limit: null }) });
        },
    });
    const createGrantTransactionMutation = (0, react_query_1.useMutation)({
        mutationFn: (args) => (0, shared_core_1.createGrantTransaction)(client, args),
        onSuccess: (_data, variables) => {
            // Invalidate grant transactions and grant item (to update spent amount)
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantTransactions)({ grantId: variables.grantId, type: null, page: null, limit: null }) });
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantItem)(variables.grantId) });
        },
    });
    const moveGrantTransactionMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.moveGrantTransaction)(client, payload),
        onSuccess: (data, variables) => {
            // Invalidate transactions for both old and new grants, and the grant items themselves
            // data contains fromGrantId and toGrantId from the response
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantTransactions)({ grantId: data.fromGrantId, type: null, page: null, limit: null }) });
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantTransactions)({ grantId: data.toGrantId, type: null, page: null, limit: null }) });
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantItem)(data.fromGrantId) });
            queryClient.invalidateQueries({ queryKey: (0, grants_1.grantItem)(data.toGrantId) });
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
function useOdcCategories(client, params = {}) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: (0, grants_1.odcCategories)(),
        queryFn: () => (0, shared_core_1.fetchOdcCategories)(client),
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 5 * 60 * 1000, // 5 minutes - categories rarely change
    });
}
//# sourceMappingURL=grants.js.map