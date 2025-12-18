import type { ApiClient } from '../../ApiClient';
import type { OrderRequestItem, ReRequestOrderPayload } from '../../../types/orderRequests';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

type NormalizedOrderRequest = Omit<OrderRequestItem, 'id'> & { _id?: string; id?: string };

function normalizeOrderRequest(item: NormalizedOrderRequest): OrderRequestItem {
  const idValue = (item as any)?._id || (item as any)?.id;
  if (!idValue) return item as any as OrderRequestItem;
  return { ...(item as any), _id: idValue, id: idValue } as OrderRequestItem;
}

export async function fetchOrderRequests(
  client: ApiClient,
  labId: string,
  view?: 'current' | 'placed' | 'archived'
): Promise<{ orderRequests: OrderRequestItem[]; totalCount: number }> {
  const response = await client.request<{ orderRequests: NormalizedOrderRequest[]; totalCount: number }>({
    method: 'GET',
    path: '/list-requests',
    query: { labId, view: view ?? null },
  });

  const validated = validateObjectResponse(response, 'fetchOrderRequests', ['orderRequests', 'totalCount'] as any) as any;
  const items = validateArrayResponse<NormalizedOrderRequest>(validated.orderRequests, 'fetchOrderRequests.orderRequests');

  return { orderRequests: items.map(normalizeOrderRequest), totalCount: validated.totalCount };
}

export async function fetchOrderRequest(
  client: ApiClient,
  orderRequestId: string
): Promise<{ orderRequest: OrderRequestItem }> {
  const response = await client.request<{ orderRequest: NormalizedOrderRequest }>({
    method: 'GET',
    path: '/get-request',
    query: { id: orderRequestId },
  });

  const validated = validateObjectResponse(response, 'fetchOrderRequest', ['orderRequest'] as any) as any;
  return { orderRequest: normalizeOrderRequest(validated.orderRequest) };
}

export async function fetchArchivedOrderRequest(
  client: ApiClient,
  archivedOrderRequestId: string
): Promise<{ orderRequest: OrderRequestItem }> {
  const response = await client.request<{ orderRequest: NormalizedOrderRequest }>({
    method: 'GET',
    path: '/get-archived-request',
    query: { id: archivedOrderRequestId },
  });

  const validated = validateObjectResponse(response, 'fetchArchivedOrderRequest', ['orderRequest'] as any) as any;
  return { orderRequest: normalizeOrderRequest(validated.orderRequest) };
}

export async function fetchArchivedOrderRequests(
  client: ApiClient,
  labId: string
): Promise<OrderRequestItem[]> {
  const response = await client.request<NormalizedOrderRequest[]>({
    method: 'GET',
    path: '/list-all-archived-order-requests',
    query: { lab_id: labId },
  });

  const items = validateArrayResponse<NormalizedOrderRequest>(response, 'fetchArchivedOrderRequests');
  return items.map(normalizeOrderRequest);
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
  return validateObjectResponse(response, 'reRequestArchivedOrder', ['id'] as any) as { id: string };
}


