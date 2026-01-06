import type { ApiClient } from '../../ApiClient';
import type {
  CreateOrderRequestData,
  OrderRequestItem,
  BulkOperationResult,
  PlaceOrderPayload,
  BulkPlaceOrdersPayload,
} from '../../../types/orderRequests';
import { validateObjectResponse } from '../../responseValidation';

export async function createOrderRequest(
  client: ApiClient,
  orderRequestData: CreateOrderRequestData
): Promise<{ id: string }> {
  const response = await client.request<{ id: string; message?: string }>({
    method: 'POST',
    path: '/create-request',
    body: orderRequestData,
  });
  return validateObjectResponse(response, 'createOrderRequest', ['id'] as any) as { id: string };
}

type OrderRequestUpdatePayload = Partial<
  Pick<
    OrderRequestItem,
    | 'name'
    | 'description'
    | 'brand'
    | 'quantity'
    | 'units'
    | 'notes'
    | 'attributes'
    | 'customFields'
    | 'locationTags'
    | 'grantTags'
    | 'labelTags'
    | 'uploadedByTags'
  >
>;

export async function updateOrderRequest(
  client: ApiClient,
  orderRequestId: string,
  orderRequestUpdateData: OrderRequestUpdatePayload
): Promise<{ message: string; orderRequest: OrderRequestItem }> {
  const response = await client.request<{ message: string; orderRequest: any }>({
    method: 'PUT',
    path: '/update-request',
    query: { id: orderRequestId },
    body: orderRequestUpdateData,
  });
  return validateObjectResponse(response, 'updateOrderRequest', ['orderRequest'] as any) as {
    message: string;
    orderRequest: OrderRequestItem;
  };
}

export async function deleteOrderRequest(client: ApiClient, orderRequestId: string): Promise<void> {
  await client.request<any>({
    method: 'DELETE',
    path: '/delete-request',
    query: { id: orderRequestId },
  });
}

export async function bulkDeleteOrderRequests(
  client: ApiClient,
  orderRequestIds: string[]
): Promise<{ deletedCount: number }> {
  // Backend expects `ItemIDs` (capitalization) for legacy reasons.
  const response = await client.request<{ deletedCount: number }>({
    method: 'POST',
    path: '/bulk-delete-requests',
    body: { ItemIDs: orderRequestIds },
  });
  return validateObjectResponse(response, 'bulkDeleteOrderRequests', ['deletedCount'] as any) as {
    deletedCount: number;
  };
}

export async function moveOrderRequestToInventory(
  client: ApiClient,
  orderRequestId: string,
  quantity: number,
  locationId?: string
): Promise<{ id: string }> {
  const body: any = { orderRequestId, quantity };
  if (locationId) body.locationId = locationId;

  const response = await client.request<{ id: string; message?: string }>({
    method: 'POST',
    path: '/move-request-to-inventory',
    body,
  });
  return validateObjectResponse(response, 'moveOrderRequestToInventory', ['id'] as any) as { id: string };
}

export async function bulkMoveOrderRequestsToInventory(
  client: ApiClient,
  orderRequestIds: string[],
  locationId?: string
): Promise<BulkOperationResult> {
  const body: any = { orderRequestIds };
  if (locationId) body.locationId = locationId;

  const response = await client.request<BulkOperationResult>({
    method: 'POST',
    path: '/bulk-move-requests-to-inventory',
    body,
  });
  return validateObjectResponse(response, 'bulkMoveOrderRequestsToInventory', ['successCount', 'failureCount', 'errors'] as any) as any;
}

export async function placeOrderRequest(
  client: ApiClient,
  payload: PlaceOrderPayload
): Promise<{ id: string }> {
  const { orderRequestId, unitCost, shippingCost, currency } = payload;
  const body: any = { orderRequestId };
  if (typeof unitCost === 'number') body.unitCost = unitCost;
  if (typeof shippingCost === 'number') body.shippingCost = shippingCost;
  if (currency) body.currency = currency;

  const response = await client.request<{ id: string; message?: string }>({
    method: 'POST',
    path: '/place-order',
    body,
  });
  return validateObjectResponse(response, 'placeOrderRequest', ['id'] as any) as { id: string };
}

export async function revertPlacedOrderRequest(
  client: ApiClient,
  orderRequestId: string
): Promise<{ id: string }> {
  const response = await client.request<{ id: string; message?: string }>({
    method: 'POST',
    path: '/revert-placed-order',
    body: { orderRequestId },
  });
  return validateObjectResponse(response, 'revertPlacedOrderRequest', ['id'] as any) as { id: string };
}

export async function bulkPlaceOrderRequests(
  client: ApiClient,
  payload: BulkPlaceOrdersPayload
): Promise<BulkOperationResult> {
  const response = await client.request<BulkOperationResult>({
    method: 'POST',
    path: '/bulk-place-orders',
    body: payload,
  });
  return validateObjectResponse(
    response,
    'bulkPlaceOrderRequests',
    ['successCount', 'failureCount', 'errors'] as any
  ) as any;
}





