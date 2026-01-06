import type { ApiClient, CreateGrantRequest, CreateGrantTransactionRequest, Grant, GrantListResponse, GrantTransactionsResponse, MoveGrantTransactionRequest, UpdateGrantData } from '@labshare/shared-core';
export declare function useGrantsList(client: ApiClient, params: {
    labId: string | null | undefined;
    status?: string | null;
    enabled?: boolean;
    page?: number;
    limit?: number;
}): import("@tanstack/react-query").UseQueryResult<GrantListResponse, Error>;
export declare function useGrantItem(client: ApiClient, params: {
    grantId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Grant | null, Error>;
export declare function useGrantTransactions(client: ApiClient, params: {
    grantId: string | null | undefined;
    type?: string | null;
    page?: number;
    limit?: number;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<GrantTransactionsResponse, Error>;
export declare function useGrantMutations(client: ApiClient): {
    createGrantMutation: import("@tanstack/react-query").UseMutationResult<Grant, Error, CreateGrantRequest, unknown>;
    updateGrantMutation: import("@tanstack/react-query").UseMutationResult<Grant, Error, {
        grantId: string;
        grantData: UpdateGrantData;
    }, unknown>;
    deleteGrantMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    createGrantTransactionMutation: import("@tanstack/react-query").UseMutationResult<unknown, Error, {
        grantId: string;
        payload: CreateGrantTransactionRequest;
    }, unknown>;
    moveGrantTransactionMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
        transactionId: string;
        fromGrantId: string;
        toGrantId: string;
    }, Error, MoveGrantTransactionRequest, unknown>;
};
//# sourceMappingURL=grants.d.ts.map