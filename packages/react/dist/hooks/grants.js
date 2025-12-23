"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGrantsList = useGrantsList;
exports.useGrantItem = useGrantItem;
exports.useGrantTransactions = useGrantTransactions;
exports.useGrantMutations = useGrantMutations;
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
    const createGrantMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.createGrant)(client, payload),
    });
    const createGrantTransactionMutation = (0, react_query_1.useMutation)({
        mutationFn: (args) => (0, shared_core_1.createGrantTransaction)(client, args),
    });
    const moveGrantTransactionMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.moveGrantTransaction)(client, payload),
    });
    return {
        createGrantMutation,
        createGrantTransactionMutation,
        moveGrantTransactionMutation,
    };
}
//# sourceMappingURL=grants.js.map