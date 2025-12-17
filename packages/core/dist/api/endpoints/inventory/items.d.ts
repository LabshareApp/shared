import type { ApiClient } from '../../ApiClient';
import type { CreateItemData, InventoryItem } from '../../../types/inventory';
export declare function createInventoryItem(client: ApiClient, itemData: CreateItemData): Promise<{
    id: string;
}>;
export declare function fetchInventoryItem(client: ApiClient, itemId: string): Promise<InventoryItem>;
export declare function updateInventoryItem(client: ApiClient, itemId: string, itemUpdateData: Partial<Pick<InventoryItem, 'name' | 'brands' | 'totalQuantity' | 'units' | 'notes' | 'attributes' | 'customFields' | 'vendorTags' | 'locationTags' | 'grantTags' | 'labelTags'>>): Promise<void>;
export declare function deleteInventoryItem(client: ApiClient, itemId: string): Promise<void>;
export declare function bulkDeleteInventoryItems(client: ApiClient, itemIds: string[]): Promise<{
    deletedCount: number;
}>;
//# sourceMappingURL=items.d.ts.map