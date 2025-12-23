import type { ApiClient } from '../../ApiClient';
import type { Grant, ListGrantsResponse, ListGrantTransactionsResponse, ListGrantItemsResponse } from '../../../types/grants';
export declare function fetchGrants(client: ApiClient, params?: {
    status?: string;
    page?: number;
    limit?: number;
}): Promise<ListGrantsResponse>;
export declare function fetchGrant(client: ApiClient, grantId: string): Promise<Grant>;
export declare function fetchGrantTransactions(client: ApiClient, grantId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
}): Promise<ListGrantTransactionsResponse>;
export declare function fetchGrantItems(client: ApiClient, grantId: string, params?: {
    page?: number;
    limit?: number;
}): Promise<ListGrantItemsResponse>;
//# sourceMappingURL=requests.d.ts.map