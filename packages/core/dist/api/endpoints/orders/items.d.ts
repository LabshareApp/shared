import type { ApiClient } from '../../ApiClient';
import type { CreateOrderRequestData, OrderRequest } from '../../../types/orders';
export declare function createOrderRequest(client: ApiClient, orderData: CreateOrderRequestData): Promise<{
    id: string;
}>;
export declare function fetchOrderRequest(client: ApiClient, orderId: string): Promise<OrderRequest>;
export declare function updateOrderRequest(client: ApiClient, orderId: string, orderUpdateData: Partial<CreateOrderRequestData>): Promise<void>;
export declare function deleteOrderRequest(client: ApiClient, orderId: string): Promise<void>;
export declare function bulkDeleteOrderRequests(client: ApiClient, orderIds: string[]): Promise<{
    deletedCount: number;
}>;
export declare function placeOrderRequest(client: ApiClient, orderId: string): Promise<void>;
export declare function bulkPlaceOrderRequests(client: ApiClient, orderIds: string[]): Promise<void>;
export declare function fulfillOrderRequest(client: ApiClient, orderId: string): Promise<void>;
export declare function bulkFulfillOrderRequests(client: ApiClient, orderIds: string[]): Promise<void>;
//# sourceMappingURL=items.d.ts.map