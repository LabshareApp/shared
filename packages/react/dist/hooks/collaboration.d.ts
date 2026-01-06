import type { ApiClient, Collaborator, CollaboratorSearchResponse, LabInfo, TagCategory, AttributeFilter, FilterOperation } from '@labshare/shared-core';
export declare function useCollaborators(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Collaborator[], Error>;
export declare function useAvailableLabs(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<LabInfo[], Error>;
export declare function useCollaborationMutations(client: ApiClient): {
    createRequestMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").CollaborationResponse, Error, string, unknown>;
    acceptRequestMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").CollaborationResponse, Error, string, unknown>;
    deleteCollaboratorMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").CollaborationResponse, Error, string, unknown>;
};
export declare function useCollaboratorInventorySearch(client: ApiClient, params: {
    activeFilters: {
        searchText: string;
        selectedLabIds: string[];
        tags?: Partial<Record<TagCategory, string[]>>;
        attributes?: AttributeFilter[];
        filterOperation?: FilterOperation;
    };
    sortingState: {
        sortBy: 'name' | 'date' | 'updatedAt';
        sortDirection: 'asc' | 'desc';
    };
    limit: number;
    enabled?: boolean;
}): import("@tanstack/react-query").UseInfiniteQueryResult<import("@tanstack/react-query").InfiniteData<CollaboratorSearchResponse, unknown>, Error>;
//# sourceMappingURL=collaboration.d.ts.map