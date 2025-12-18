"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCollaborators = useCollaborators;
exports.useAvailableLabs = useAvailableLabs;
exports.useCollaborationMutations = useCollaborationMutations;
exports.useCollaboratorInventorySearch = useCollaboratorInventorySearch;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const collaboration_1 = require("../queryKeys/collaboration");
function useCollaborators(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: collaboration_1.collaborationKeys.collaborators(),
        queryFn: () => (0, shared_core_1.listCollaborators)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 5 * 60 * 1000,
    });
}
function useAvailableLabs(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: collaboration_1.collaborationKeys.availableLabs(),
        queryFn: () => (0, shared_core_1.getAvailableLabs)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 5 * 60 * 1000,
    });
}
function useCollaborationMutations(client) {
    const qc = (0, react_query_1.useQueryClient)();
    const invalidate = () => qc.invalidateQueries({ queryKey: collaboration_1.collaborationKeys.collaborators() });
    const createRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: (targetLabId) => (0, shared_core_1.createCollaboratorRequest)(client, targetLabId),
        onSuccess: invalidate,
    });
    const acceptRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: (requestingLabId) => (0, shared_core_1.acceptCollaboratorRequest)(client, requestingLabId),
        onSuccess: invalidate,
    });
    const deleteCollaboratorMutation = (0, react_query_1.useMutation)({
        mutationFn: (collaboratorLabId) => (0, shared_core_1.deleteCollaborator)(client, collaboratorLabId),
        onSuccess: invalidate,
    });
    return { createRequestMutation, acceptRequestMutation, deleteCollaboratorMutation };
}
function useCollaboratorInventorySearch(client, params) {
    var _a;
    return (0, react_query_1.useInfiniteQuery)({
        queryKey: collaboration_1.collaborationKeys.collaboratorInventorySearch({
            labId: null,
            searchText: params.activeFilters.searchText,
            selectedLabIds: params.activeFilters.selectedLabIds,
            sortBy: params.sortingState.sortBy,
            sortDirection: params.sortingState.sortDirection,
            limit: params.limit,
        }),
        queryFn: async ({ pageParam = 1 }) => {
            const searchParams = {
                term: params.activeFilters.searchText.trim() || undefined,
                page: pageParam,
                limit: params.limit,
                labIds: params.activeFilters.selectedLabIds.length > 0 ? params.activeFilters.selectedLabIds : undefined,
            };
            return (0, shared_core_1.searchCollaboratorItems)(client, searchParams);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage > 0 ? lastPage.nextPage : undefined,
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 0,
    });
}
//# sourceMappingURL=collaboration.js.map