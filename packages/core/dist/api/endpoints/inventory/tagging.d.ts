import type { ApiClient } from '../../ApiClient';
import type { BulkTagResponse, TagCategory } from '../../../types/inventory';
export declare function addTagToItem(client: ApiClient, itemId: string, tagId: string, category: TagCategory): Promise<void>;
export declare function removeTagFromItem(client: ApiClient, itemId: string, tagId: string, category: TagCategory): Promise<void>;
export declare function bulkAddTagsToItems(client: ApiClient, itemIds: string[], tagIds: string[], category: TagCategory): Promise<BulkTagResponse>;
export declare function bulkRemoveTagsFromItems(client: ApiClient, itemIds: string[], tagIds: string[], category: TagCategory): Promise<BulkTagResponse>;
//# sourceMappingURL=tagging.d.ts.map