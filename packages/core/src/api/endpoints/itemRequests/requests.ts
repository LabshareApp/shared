import type { ApiClient } from '../../ApiClient';
import type {
  CreateItemRequestRequest,
  CreateItemRequestResponse,
  ListItemRequestsResponse,
} from '../../../types/itemRequests';
import { validateObjectResponse } from '../../responseValidation';

export async function listItemRequests(
  client: ApiClient,
  params: { q?: string; direction?: string; status?: string; page?: number; limit?: number }
): Promise<ListItemRequestsResponse> {
  const query: any = {};
  if (params.q) query.q = params.q;
  if (params.direction) query.direction = params.direction;
  if (params.status) query.status = params.status;
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;

  const response = await client.request<ListItemRequestsResponse>({
    method: 'GET',
    path: '/list-item-requests',
    query,
  });

  return validateObjectResponse(response, 'listItemRequests', ['requests', 'total'] as any) as any;
}

export async function createItemRequest(
  client: ApiClient,
  body: CreateItemRequestRequest
): Promise<CreateItemRequestResponse> {
  const response = await client.request<CreateItemRequestResponse>({
    method: 'POST',
    path: '/create-item-request',
    body,
  });
  return validateObjectResponse(response, 'createItemRequest', ['id'] as any) as any;
}

export async function acceptItemRequest(client: ApiClient, requestId: string): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/accept-item-request',
    body: { requestId },
  });
  return validateObjectResponse(response, 'acceptItemRequest', ['message'] as any) as any;
}

export async function denyItemRequest(client: ApiClient, requestId: string): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/deny-item-request',
    body: { requestId },
  });
  return validateObjectResponse(response, 'denyItemRequest', ['message'] as any) as any;
}

export async function fulfillItemRequest(client: ApiClient, requestId: string): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/fulfill-item-request',
    body: { requestId },
  });
  return validateObjectResponse(response, 'fulfillItemRequest', ['message'] as any) as any;
}

export async function cancelItemRequest(client: ApiClient, requestId: string): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/cancel-item-request',
    body: { requestId },
  });
  return validateObjectResponse(response, 'cancelItemRequest', ['message'] as any) as any;
}



