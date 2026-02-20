import type { ApiClient, BackendCustomGroup, BackendTag, CreateCustomGroupData, CreateItemData, InventoryItem, SearchRequest, TagCategory, UpdateCustomGroupData } from '@labshare/shared-core';
import { type ApiError } from '@labshare/shared-core';
export declare function useAllTags(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<BackendTag[], Error>;
export declare function useTagsByCategory(client: ApiClient, params: {
    category: TagCategory | null;
    labId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<BackendTag[], Error>;
export declare function useCustomGroups(client: ApiClient, options?: {
    enabled?: boolean;
    labId?: string | null;
}): import("@tanstack/react-query").UseQueryResult<BackendCustomGroup[], Error>;
export declare function useSpecificCustomGroup(client: ApiClient, params: {
    groupId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<BackendCustomGroup | null, Error | ApiError<unknown>>;
export declare function useInventoryItem(client: ApiClient, params: {
    itemId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InventoryItem | null, Error | ApiError<unknown>>;
export declare function useInventorySearch(client: ApiClient, params: {
    searchRequest: SearchRequest;
    queryKeyArgs: {
        appliedGroupId?: string | null;
        activeFiltersKey?: unknown;
        sortBy?: string | null;
        sortDirection?: string | null;
        limit?: number | null;
    };
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    enabled?: boolean;
}): import("@tanstack/react-query").UseInfiniteQueryResult<import("@tanstack/react-query").InfiniteData<{
    items: InventoryItem[];
    totalCount: number;
}, unknown>, Error>;
export declare function useInventoryMutations(client: ApiClient): {
    createGroupMutation: import("@tanstack/react-query").UseMutationResult<{
        id: string;
    }, Error, CreateCustomGroupData, unknown>;
    updateGroupMutation: import("@tanstack/react-query").UseMutationResult<void, Error, UpdateCustomGroupData, unknown>;
    deleteGroupMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    updateItemMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        itemId: string;
        data: Partial<Pick<InventoryItem, "name" | "units" | "notes" | "attributes" | "customFields" | "locationTags" | "grantTags" | "labelTags" | "brands" | "totalQuantity" | "vendorTags" | "quotes" | "images">> & {
            catalog?: string;
        };
    }, unknown>;
    deleteItemMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, {
        previousData: [readonly unknown[], any][];
    }>;
    bulkDeleteItemsMutation: import("@tanstack/react-query").UseMutationResult<{
        deletedCount: number;
    }, Error, {
        itemIds: string[];
    }, unknown>;
    bulkAddTagsMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").BulkTagResponse, Error, {
        itemIds: string[];
        tagIds: string[];
        category: TagCategory;
    }, unknown>;
    bulkRemoveTagsMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").BulkTagResponse, Error, {
        itemIds: string[];
        tagIds: string[];
        category: TagCategory;
    }, unknown>;
    addTagMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        itemId: string;
        tagId: string;
        category: TagCategory;
    }, unknown>;
    removeTagMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        itemId: string;
        tagId: string;
        category: TagCategory;
    }, unknown>;
    createItemMutation: import("@tanstack/react-query").UseMutationResult<{
        id: string;
    }, Error, {
        data: CreateItemData;
    }, unknown>;
};
//# sourceMappingURL=inventory.d.ts.map