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
    // Check if we have filters (tags or attributes) - if so, use new SearchRequest endpoint
    const hasFilters = params.activeFilters.tags && Object.values(params.activeFilters.tags).some(ids => ids && ids.length > 0) ||
        (params.activeFilters.attributes && params.activeFilters.attributes.length > 0);
    return (0, react_query_1.useInfiniteQuery)({
        queryKey: collaboration_1.collaborationKeys.collaboratorInventorySearch({
            labId: null,
            searchText: params.activeFilters.searchText,
            selectedLabIds: params.activeFilters.selectedLabIds,
            sortBy: params.sortingState.sortBy,
            sortDirection: params.sortingState.sortDirection,
            limit: params.limit,
            tags: params.activeFilters.tags,
            attributes: params.activeFilters.attributes,
            filterOperation: params.activeFilters.filterOperation,
        }),
        queryFn: async ({ pageParam = 1, signal }) => {
            var _a, _b;
            if (hasFilters) {
                // Use new SearchRequest endpoint
                const searchRequest = {
                    useCustomGroup: false,
                    query: {
                        operation: params.activeFilters.filterOperation || shared_core_1.FilterOperation.AND,
                        filters: params.activeFilters.tags ? Object.entries(params.activeFilters.tags)
                            .filter(([_, ids]) => ids && ids.length > 0)
                            .map(([category, tagIds]) => ({
                            category: category,
                            tagIds: tagIds,
                            operator: shared_core_1.FilterOperation.OR,
                        })) : [],
                        attributeFilters: params.activeFilters.attributes || [],
                    },
                    globalSearchTerm: params.activeFilters.searchText.trim() || '',
                    selectedLabIds: params.activeFilters.selectedLabIds.length > 0 ? params.activeFilters.selectedLabIds : undefined,
                };
                // Clean up empty arrays
                if (((_a = searchRequest.query.filters) === null || _a === void 0 ? void 0 : _a.length) === 0)
                    delete searchRequest.query.filters;
                if (((_b = searchRequest.query.attributeFilters) === null || _b === void 0 ? void 0 : _b.length) === 0)
                    delete searchRequest.query.attributeFilters;
                return (0, shared_core_1.searchCollaboratorItemsWithFilters)(client, searchRequest, pageParam, params.limit, params.sortingState.sortBy === 'date' ? 'updatedAt' : params.sortingState.sortBy, params.sortingState.sortDirection, signal);
            }
            else {
                // Use legacy GET endpoint for backward compatibility
                const searchParams = {
                    term: params.activeFilters.searchText.trim() || undefined,
                    page: pageParam,
                    limit: params.limit,
                    labIds: params.activeFilters.selectedLabIds.length > 0 ? params.activeFilters.selectedLabIds : undefined,
                };
                return (0, shared_core_1.searchCollaboratorItems)(client, searchParams, signal);
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage > 0 ? lastPage.nextPage : undefined,
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 30 * 1000, // Cache for 30 seconds
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on mount if data is fresh
    });
}
//# sourceMappingURL=collaboration.js.map