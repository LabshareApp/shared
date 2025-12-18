import type { ApiClient } from '../../ApiClient';
import type { BulkTagResponse, TagCategory } from '../../../types/inventory';
export declare function bulkAddTagsToOrderRequests(client: ApiClient, orderRequestIds: string[], tagIds: string[], category: TagCategory): Promise<BulkTagResponse>;
export declare function bulkRemoveTagsFromOrderRequests(client: ApiClient, orderRequestIds: string[], tagIds: string[], category: TagCategory): Promise<BulkTagResponse>;
//# sourceMappingURL=tagging.d.ts.map