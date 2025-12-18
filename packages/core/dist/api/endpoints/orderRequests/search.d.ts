import type { ApiClient } from '../../ApiClient';
import type { SearchRequest } from '../../../types/inventory';
import type { OrderRequestItem } from '../../../types/orderRequests';
export declare function searchOrderRequests(client: ApiClient, searchRequest: SearchRequest, page?: number, limit?: number, sortBy?: 'name' | 'date' | string, sortDirection?: 'asc' | 'desc'): Promise<{
    items: OrderRequestItem[];
    totalCount: number;
}>;
//# sourceMappingURL=search.d.ts.map