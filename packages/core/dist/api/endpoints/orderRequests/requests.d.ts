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
/**
 * Generate a presigned URL for uploading a quote PDF to S3.
 * This uses the OCR server (port 8080) endpoint.
 */
export declare function generateQuotePresignedUrl(client: ApiClient, itemType?: 'order-request' | 'placed-order'): Promise<{
    url: string;
    object_key: string;
}>;
/**
 * Update an order request with a quote URL after uploading the PDF to S3.
 */
export declare function updateOrderRequestQuote(client: ApiClient, orderRequestId: string, quoteUrl: string): Promise<{
    message: string;
    id: string;
}>;
/**
 * Get a presigned URL for viewing/downloading a quote PDF from S3.
 * The returned URL is valid for 15 minutes.
 */
export declare function getQuoteViewUrl(client: ApiClient, s3Url: string): Promise<{
    url: string;
    expiresAt: number;
}>;
export type OrderRequestCounts = {
    current: number;
    placed: number;
    archived: number;
};
/**
 * Fetch counts of order requests for each view (current, placed, archived).
 * Uses the dedicated /count-requests endpoint which is much cheaper than
 * fetching all orders just to count them.
 */
export declare function fetchOrderRequestCounts(client: ApiClient): Promise<OrderRequestCounts>;
//# sourceMappingURL=requests.d.ts.map