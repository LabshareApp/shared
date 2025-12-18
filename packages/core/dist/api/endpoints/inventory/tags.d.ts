import type { ApiClient } from '../../ApiClient';
import { type BackendTag, type CreateSublocationData, type CreateTagData, type TagCategory as TagCategoryType } from '../../../types/inventory';
export declare function createTag(client: ApiClient, tagData: CreateTagData): Promise<BackendTag>;
export declare function createSublocation(client: ApiClient, sublocationData: CreateSublocationData): Promise<BackendTag>;
export declare function fetchTags(client: ApiClient): Promise<BackendTag[]>;
export declare function deleteTag(client: ApiClient, tagId: string): Promise<void>;
export declare function fetchTagsByCategory(client: ApiClient, category: TagCategoryType, labId: string): Promise<BackendTag[]>;
export declare function fetchSublocations(client: ApiClient, parentLocationId: string): Promise<BackendTag[]>;
//# sourceMappingURL=tags.d.ts.map