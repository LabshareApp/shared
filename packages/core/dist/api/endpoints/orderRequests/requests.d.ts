import type { ApiClient } from '../../ApiClient';
import type { OrderRequestItem, ReRequestOrderPayload } from '../../../types/orderRequests';
export declare function fetchOrderRequests(client: ApiClient, labId: string, view?: 'current' | 'placed' | 'archived'): Promise<{
    orderRequests: OrderRequestItem[];
    totalCount: number;
}>;
export declare function fetchOrderRequest(client: ApiClient, orderRequestId: string): Promise<{
    orderRequest: OrderRequestItem;
}>;
export declare function fetchArchivedOrderRequest(client: ApiClient, archivedOrderRequestId: string): Promise<{
    orderRequest: OrderRequestItem;
}>;
export declare function fetchArchivedOrderRequests(client: ApiClient, labId: string): Promise<OrderRequestItem[]>;
export declare function reRequestArchivedOrder(client: ApiClient, payload: ReRequestOrderPayload): Promise<{
    id: string;
}>;
//# sourceMappingURL=requests.d.ts.map