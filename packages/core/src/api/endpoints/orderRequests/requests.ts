import type { ApiClient } from '../../ApiClient';
import type { OrderRequestItem, ReRequestOrderPayload } from '../../../types/orderRequests';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

export async function fetchOrderRequests(
  client: ApiClient,
  labId: string,
  view?: 'current' | 'approved' | 'placed' | 'archived'
): Promise<{ orderRequests: OrderRequestItem[]; totalCount: number }> {
  const response = await client.request<{ orderRequests: OrderRequestItem[]; totalCount: number }>({
    method: 'GET',
    path: '/list-requests',
    query: { labId, view: view ?? null },
  });

  const validated = validateObjectResponse(response, 'fetchOrderRequests', ['orderRequests', 'totalCount']) as any;
  const items = validateArrayResponse<OrderRequestItem>(validated.orderRequests, 'fetchOrderRequests.orderRequests');

  return { orderRequests: items, totalCount: validated.totalCount };
}

export async function fetchOrderRequest(
  client: ApiClient,
  orderRequestId: string
): Promise<{ orderRequest: OrderRequestItem }> {
  const response = await client.request<{ orderRequest: OrderRequestItem }>({
    method: 'GET',
    path: '/get-request',
    query: { id: orderRequestId },
  });

  const validated = validateObjectResponse(response, 'fetchOrderRequest', ['orderRequest']) as any;
  return { orderRequest: validated.orderRequest };
}

export async function fetchArchivedOrderRequest(
  client: ApiClient,
  archivedOrderRequestId: string
): Promise<{ orderRequest: OrderRequestItem }> {
  const response = await client.request<{ orderRequest: OrderRequestItem }>({
    method: 'GET',
    path: '/get-archived-request',
    query: { id: archivedOrderRequestId },
  });

  const validated = validateObjectResponse(response, 'fetchArchivedOrderRequest', ['orderRequest']) as any;
  return { orderRequest: validated.orderRequest };
}

export async function fetchArchivedOrderRequests(
  client: ApiClient,
  labId: string
): Promise<OrderRequestItem[]> {
  const response = await client.request<OrderRequestItem[]>({
    method: 'GET',
    path: '/list-all-archived-order-requests',
    query: { lab_id: labId },
  });

  return validateArrayResponse<OrderRequestItem>(response, 'fetchArchivedOrderRequests');
}

export async function reRequestArchivedOrder(
  client: ApiClient,
  payload: ReRequestOrderPayload
): Promise<{ id: string }> {
  const response = await client.request<{ id: string; message?: string }>({
    method: 'POST',
    path: '/re-request-order',
    body: payload,
  });
  return validateObjectResponse(response, 'reRequestArchivedOrder', ['id']) as { id: string };
}

/**
 * Generate a presigned URL for uploading a quote PDF to S3.
 * This uses the OCR server (port 8080) endpoint.
 */
export async function generateQuotePresignedUrl(
  client: ApiClient,
  itemType: 'order-request' | 'placed-order' = 'order-request'
): Promise<{ url: string; object_key: string }> {
  const response = await client.request<{ url: string; object_key: string }>({
    method: 'GET',
    path: '/generate-presigned-url/quote',
    query: { itemType },
  });
  return validateObjectResponse(response, 'generateQuotePresignedUrl', ['url', 'object_key']) as { url: string; object_key: string };
}

/**
 * Update an order request with a quote URL after uploading the PDF to S3.
 */
export async function updateOrderRequestQuote(
  client: ApiClient,
  orderRequestId: string,
  quoteUrl: string
): Promise<{ message: string; id: string }> {
  const response = await client.request<{ message: string; id: string }>({
    method: 'POST',
    path: '/update-order-request-quote',
    body: { orderRequestId, quoteUrl },
  });
  return validateObjectResponse(response, 'updateOrderRequestQuote', ['message', 'id']) as { message: string; id: string };
}

/**
 * Get a presigned URL for viewing/downloading a quote PDF from S3.
 * The returned URL is valid for 15 minutes.
 */
export async function getQuoteViewUrl(
  client: ApiClient,
  s3Url: string
): Promise<{ url: string; expiresAt: number }> {
  const response = await client.request<{ url: string; expiresAt: number }>({
    method: 'POST',
    path: '/get-quote-view-url',
    body: { s3Url },
  });
  return validateObjectResponse(response, 'getQuoteViewUrl', ['url', 'expiresAt']) as { url: string; expiresAt: number };
}

export type OrderRequestCounts = {
  current: number;
  approved: number;
  placed: number;
  archived: number;
};

/**
 * Fetch counts of order requests for each view (current, approved, placed, archived).
 * Uses the dedicated /count-requests endpoint which is much cheaper than
 * fetching all orders just to count them.
 */
export async function fetchOrderRequestCounts(
  client: ApiClient
): Promise<OrderRequestCounts> {
  const response = await client.request<OrderRequestCounts>({
    method: 'GET',
    path: '/count-requests',
  });

  return validateObjectResponse(response, 'fetchOrderRequestCounts', ['current', 'approved', 'placed', 'archived']) as OrderRequestCounts;
}
