"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListItemRequestsShared = useListItemRequestsShared;
exports.useItemRequestMutations = useItemRequestMutations;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const itemRequests_1 = require("../queryKeys/itemRequests");
function useListItemRequestsShared(client, params) {
    const { enabled, ...queryParams } = params;
    return (0, react_query_1.useQuery)({
        queryKey: itemRequests_1.itemRequestKeys.list(queryParams),
        queryFn: () => (0, shared_core_1.listItemRequests)(client, queryParams),
        enabled: enabled !== null && enabled !== void 0 ? enabled : true,
        staleTime: 15000,
        placeholderData: (previousData) => previousData,
    });
}
function useItemRequestMutations(client) {
    const qc = (0, react_query_1.useQueryClient)();
    const invalidate = () => qc.invalidateQueries({ queryKey: ['itemRequests'] });
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: (body) => (0, shared_core_1.createItemRequest)(client, body),
        onSuccess: invalidate,
    });
    const acceptMutation = (0, react_query_1.useMutation)({
        mutationFn: (requestId) => (0, shared_core_1.acceptItemRequest)(client, requestId),
        onSuccess: invalidate,
    });
    const denyMutation = (0, react_query_1.useMutation)({
        mutationFn: (requestId) => (0, shared_core_1.denyItemRequest)(client, requestId),
        onSuccess: invalidate,
    });
    const fulfillMutation = (0, react_query_1.useMutation)({
        mutationFn: (requestId) => (0, shared_core_1.fulfillItemRequest)(client, requestId),
        onSuccess: invalidate,
    });
    const cancelMutation = (0, react_query_1.useMutation)({
        mutationFn: (requestId) => (0, shared_core_1.cancelItemRequest)(client, requestId),
        onSuccess: invalidate,
    });
    return { createMutation, acceptMutation, denyMutation, fulfillMutation, cancelMutation };
}
//# sourceMappingURL=itemRequests.js.map