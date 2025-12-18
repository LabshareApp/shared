import type { ApiClient, CreateItemRequestRequest, CreateItemRequestResponse, ListItemRequestsResponse } from '@labshare/shared-core';
export declare function useListItemRequestsShared(client: ApiClient, params: {
    q?: string;
    direction?: string;
    status?: string;
    page?: number;
    limit?: number;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<ListItemRequestsResponse, Error>;
export declare function useItemRequestMutations(client: ApiClient): {
    createMutation: import("@tanstack/react-query").UseMutationResult<CreateItemRequestResponse, Error, CreateItemRequestRequest, unknown>;
    acceptMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, string, unknown>;
    denyMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, string, unknown>;
    fulfillMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, string, unknown>;
    cancelMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, string, unknown>;
};
//# sourceMappingURL=itemRequests.d.ts.map