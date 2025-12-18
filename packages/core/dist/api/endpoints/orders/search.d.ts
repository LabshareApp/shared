import type { ApiClient } from '../../ApiClient';
import type { OrderRequest, OrderSearchRequest } from '../../../types/orders';
export declare function searchOrderRequests(client: ApiClient, searchRequest: OrderSearchRequest, page?: number, limit?: number, sortBy?: 'name' | 'date' | string, sortDirection?: 'asc' | 'desc'): Promise<{
    items: OrderRequest[];
    totalCount: number;
}>;
//# sourceMappingURL=search.d.ts.map