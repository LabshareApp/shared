import type { ApiClient } from '../../ApiClient';
import type { InventoryItem, SearchRequest } from '../../../types/inventory';
export declare function searchInventory(client: ApiClient, searchRequest: SearchRequest, page?: number, limit?: number, sortBy?: 'name' | 'date' | string, sortDirection?: 'asc' | 'desc'): Promise<{
    items: InventoryItem[];
    totalCount: number;
}>;
//# sourceMappingURL=search.d.ts.map