import type { ApiClient } from '../../ApiClient';
import type {
  CreateGrantRequest,
  CreateGrantTransactionRequest,
  Grant,
  GrantListResponse,
  GrantTransactionsResponse,
  MoveGrantTransactionRequest,
  UpdateGrantRequest,
  UpdateGrantData,
  ShippingEstimateRequest,
  ShippingEstimateResponse,
  OdcCategoriesResponse,
  ListGrantItemsResponse,
} from '../../../types/grants';
import { validateObjectResponse } from '../../responseValidation';

export async function createGrant(client: ApiClient, payload: CreateGrantRequest): Promise<Grant> {
  const response = await client.request<Grant>({
    method: 'POST',
    path: '/grants',
    body: payload,
  });
  return validateObjectResponse(response, 'createGrant', ['_id']) as Grant;
}

export async function listGrants(
  client: ApiClient,
  params: { status?: string; page?: number; limit?: number } = {}
): Promise<GrantListResponse> {
  const response = await client.request<GrantListResponse>({
    method: 'GET',
    path: '/grants',
    query: {
      ...(params.status ? { status: params.status } : {}),
      ...(params.page ? { page: String(params.page) } : {}),
      ...(params.limit ? { limit: String(params.limit) } : {}),
    },
  });
  return validateObjectResponse(response, 'listGrants', ['grants', 'totalCount']) as GrantListResponse;
}

export async function getGrant(client: ApiClient, grantId: string): Promise<Grant> {
  if (!grantId) {
    throw new Error('Grant ID is required');
  }
  const response = await client.request<Grant>({
    method: 'GET',
    path: '/get-grant',
    query: { id: String(grantId) },
  });
  return validateObjectResponse(response, 'getGrant', ['_id']) as Grant;
}

export async function getGrantTransactions(
  client: ApiClient,
  params: { grantId: string; type?: string; page?: number; limit?: number }
): Promise<GrantTransactionsResponse> {
  const response = await client.request<GrantTransactionsResponse>({
    method: 'GET',
    path: '/get-grant-transactions',
    query: {
      grantId: params.grantId,
      ...(params.type ? { type: params.type } : {}),
      ...(params.page ? { page: String(params.page) } : {}),
      ...(params.limit ? { limit: String(params.limit) } : {}),
    },
  });
  return validateObjectResponse(
    response,
    'getGrantTransactions',
    ['transactions', 'totalCount']
  ) as GrantTransactionsResponse;
}

export async function createGrantTransaction(
  client: ApiClient,
  params: { grantId: string; payload: CreateGrantTransactionRequest }
): Promise<unknown> {
  const response = await client.request<any>({
    method: 'POST',
    path: '/create-grant-transaction',
    query: { grantId: params.grantId },
    body: params.payload,
  });
  // Response is the created transaction
  return validateObjectResponse(response, 'createGrantTransaction', ['_id']);
}

export async function moveGrantTransaction(
  client: ApiClient,
  payload: MoveGrantTransactionRequest
): Promise<{
  message: string;
  transactionId: string;
  fromGrantId: string;
  toGrantId: string;
}> {
  const response = await client.request<{
    message: string;
    transactionId: string;
    fromGrantId: string;
    toGrantId: string;
  }>({
    method: 'POST',
    path: '/move-grant-transaction',
    body: payload,
  });

  return validateObjectResponse(
    response,
    'moveGrantTransaction',
    ['message', 'transactionId', 'fromGrantId', 'toGrantId']
  ) as {
    message: string;
    transactionId: string;
    fromGrantId: string;
    toGrantId: string;
  };
}

export async function updateGrant(
  client: ApiClient,
  grantId: string,
  grantData: UpdateGrantData
): Promise<Grant> {
  if (!grantId) {
    throw new Error('Grant ID is required');
  }
  // Server returns the grant object directly (not wrapped in { grant: ... })
  const response = await client.request<Grant>({
    method: 'PUT',
    path: '/update-grant',
    query: { id: String(grantId) },
    body: grantData,
  });
  
  // Validate that we have a grant object with _id
  return validateObjectResponse(response, 'updateGrant', ['_id']) as Grant;
}

export async function deleteGrant(client: ApiClient, grantId: string): Promise<void> {
  if (!grantId) {
    throw new Error('Grant ID is required');
  }
  await client.request({
    method: 'DELETE',
    path: '/delete-grant',
    query: { id: String(grantId) },
  });
}

export async function estimateShipping(
  client: ApiClient,
  estimateRequest: ShippingEstimateRequest
): Promise<ShippingEstimateResponse> {
  const response = await client.request<ShippingEstimateResponse>({
    method: 'POST',
    path: '/grants/estimate-shipping',
    body: estimateRequest,
  });
  return validateObjectResponse(response, 'estimateShipping', ['estimates']) as ShippingEstimateResponse;
}

export async function fetchOdcCategories(client: ApiClient): Promise<OdcCategoriesResponse> {
  const response = await client.request<OdcCategoriesResponse>({
    method: 'GET',
    path: '/grants/odc-categories',
  });
  return validateObjectResponse(response, 'fetchOdcCategories', ['categories']) as OdcCategoriesResponse;
}

export async function linkGrantTag(
  client: ApiClient,
  grantId: string,
  tagId: string
): Promise<Grant> {
  if (!grantId) {
    throw new Error('Grant ID is required');
  }
  if (!tagId) {
    throw new Error('Tag ID is required');
  }
  const response = await client.request<{ grant: Grant }>({
    method: 'POST',
    path: '/link-grant-tag',
    query: { grantId },
    body: { tagId },
  });
  const validated = validateObjectResponse(response, 'linkGrantTag', ['grant']) as { grant: Grant };
  return validated.grant;
}

export async function getGrantItems(
  client: ApiClient,
  grantId: string,
  params?: { page?: number; limit?: number }
): Promise<ListGrantItemsResponse> {
  if (!grantId) {
    throw new Error('Grant ID is required');
  }
  const response = await client.request<ListGrantItemsResponse>({
    method: 'GET',
    path: '/get-grant-items',
    query: {
      grantId,
      ...(params?.page ? { page: String(params.page) } : {}),
      ...(params?.limit ? { limit: String(params.limit) } : {}),
    },
  });
  return validateObjectResponse(response, 'getGrantItems', ['items', 'totalCount']) as ListGrantItemsResponse;
}
