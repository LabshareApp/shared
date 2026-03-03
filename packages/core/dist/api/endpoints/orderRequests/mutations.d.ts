import type { ApiClient } from '../../ApiClient';
import type { CreateOrderRequestData, OrderRequestItem, BulkOperationResult, PlaceOrderPayload, BulkPlaceOrdersPayload } from '../../../types/orderRequests';
export declare function createOrderRequest(client: ApiClient, orderRequestData: CreateOrderRequestData): Promise<{
    id: string;
}>;
type OrderRequestUpdatePayload = Partial<Pick<OrderRequestItem, 'name' | 'description' | 'brand' | 'quantity' | 'units' | 'notes' | 'attributes' | 'customFields' | 'locationTags' | 'grantTags' | 'labelTags' | 'uploadedByTags'>>;
export declare function updateOrderRequest(client: ApiClient, orderRequestId: string, orderRequestUpdateData: OrderRequestUpdatePayload): Promise<{
    message: string;
    orderRequest: OrderRequestItem;
}>;
export declare function deleteOrderRequest(client: ApiClient, orderRequestId: string, view?: 'current' | 'placed' | 'archived'): Promise<void>;
export declare function bulkDeleteOrderRequests(client: ApiClient, orderRequestIds: string[], view?: 'current' | 'approved' | 'placed' | 'archived'): Promise<{
    deletedCount: number;
}>;
export declare function moveOrderRequestToInventory(client: ApiClient, orderRequestId: string, quantity: number, locationId?: string): Promise<{
    id: string;
}>;
export declare function bulkMoveOrderRequestsToInventory(client: ApiClient, orderRequestIds: string[], locationId?: string): Promise<BulkOperationResult>;
export declare function approveOrderRequest(client: ApiClient, orderRequestId: string): Promise<{
    id: string;
    message: string;
}>;
export declare function unapproveOrderRequest(client: ApiClient, orderRequestId: string): Promise<{
    id: string;
    message: string;
}>;
export declare function placeOrderRequest(client: ApiClient, payload: PlaceOrderPayload): Promise<{
    id: string;
}>;
export declare function revertPlacedOrderRequest(client: ApiClient, orderRequestId: string): Promise<{
    id: string;
}>;
export declare function bulkPlaceOrderRequests(client: ApiClient, payload: BulkPlaceOrdersPayload): Promise<BulkOperationResult>;
export {};
//# sourceMappingURL=mutations.d.ts.map