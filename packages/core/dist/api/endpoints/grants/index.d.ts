import type { ApiClient } from '../../ApiClient';
import type { CreateGrantRequest, CreateGrantTransactionRequest, Grant, GrantListResponse, GrantTransactionsResponse } from '../../../types/grants';
export declare function createGrant(client: ApiClient, payload: CreateGrantRequest): Promise<Grant>;
export declare function listGrants(client: ApiClient, params?: {
    status?: string;
    page?: number;
    limit?: number;
}): Promise<GrantListResponse>;
export declare function getGrant(client: ApiClient, grantId: string): Promise<Grant>;
export declare function getGrantTransactions(client: ApiClient, params: {
    grantId: string;
    type?: string;
    page?: number;
    limit?: number;
}): Promise<GrantTransactionsResponse>;
export declare function createGrantTransaction(client: ApiClient, params: {
    grantId: string;
    payload: CreateGrantTransactionRequest;
}): Promise<unknown>;
//# sourceMappingURL=index.d.ts.map