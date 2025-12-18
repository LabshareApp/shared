import type { ApiClient, CreateOrderRequestData, OrderRequestItem, ReRequestOrderPayload, SearchRequest, TagCategory } from '@labshare/shared-core';
export declare function useOrderRequestsList(client: ApiClient, params: {
    labId: string | null | undefined;
    view?: 'current' | 'placed' | 'archived';
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<{
    orderRequests: OrderRequestItem[];
    totalCount: number;
}, Error>;
export declare function useOrderRequestItem(client: ApiClient, params: {
    orderRequestId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<OrderRequestItem | null, Error>;
export declare function useArchivedOrderRequestItem(client: ApiClient, params: {
    archivedOrderRequestId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<OrderRequestItem | null, Error>;
export declare function useArchivedOrderRequests(client: ApiClient, params: {
    labId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<OrderRequestItem[], Error>;
export declare function useOrderRequestSearch(client: ApiClient, params: {
    searchRequest: SearchRequest;
    queryKeyArgs: {
        labId: string | null | undefined;
        activeFiltersKey?: unknown;
        sortBy?: string | null;
        sortDirection?: string | null;
        limit?: number | null;
        view?: 'current' | 'placed' | 'archived' | null;
    };
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    enabled?: boolean;
}): import("@tanstack/react-query").UseInfiniteQueryResult<import("@tanstack/react-query").InfiniteData<{
    items: OrderRequestItem[];
    totalCount: number;
}, unknown>, Error>;
export declare function useOrderRequestMutations(client: ApiClient): {
    createOrderRequestMutation: import("@tanstack/react-query").UseMutationResult<{
        id: string;
    }, Error, CreateOrderRequestData, unknown>;
    updateOrderRequestMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
        orderRequest: OrderRequestItem;
    }, Error, {
        orderRequestId: string;
        data: Partial<Pick<OrderRequestItem, "name" | "description" | "brand" | "quantity" | "units" | "notes" | "attributes" | "customFields" | "locationTags" | "grantTags" | "labelTags" | "uploadedByTags">>;
    }, unknown>;
    placeOrderRequestMutation: import("@tanstack/react-query").UseMutationResult<{
        id: string;
    }, Error, {
        orderRequestId: string;
    }, unknown>;
    revertPlacedOrderRequestMutation: import("@tanstack/react-query").UseMutationResult<{
        id: string;
    }, Error, {
        orderRequestId: string;
    }, unknown>;
    moveToInventoryMutation: import("@tanstack/react-query").UseMutationResult<{
        id: string;
    }, Error, {
        orderRequestId: string;
        quantity: number;
        locationId?: string;
    }, unknown>;
    bulkMoveToInventoryMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").BulkOperationResult, Error, {
        orderRequestIds: string[];
        locationId?: string;
    }, unknown>;
    bulkPlaceOrderRequestsMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").BulkOperationResult, Error, {
        orderRequestIds: string[];
    }, unknown>;
    deleteOrderRequestMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    bulkDeleteOrderRequestsMutation: import("@tanstack/react-query").UseMutationResult<{
        deletedCount: number;
    }, Error, {
        orderRequestIds: string[];
    }, unknown>;
    bulkAddTagsMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").BulkTagResponse, Error, {
        orderRequestIds: string[];
        tagIds: string[];
        category: TagCategory;
    }, unknown>;
    bulkRemoveTagsMutation: import("@tanstack/react-query").UseMutationResult<import("@labshare/shared-core").BulkTagResponse, Error, {
        orderRequestIds: string[];
        tagIds: string[];
        category: TagCategory;
    }, unknown>;
    reRequestArchivedOrderMutation: import("@tanstack/react-query").UseMutationResult<{
        id: string;
    }, Error, ReRequestOrderPayload, unknown>;
};
//# sourceMappingURL=orderRequests.d.ts.map