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
} from '../../../types/grants';
import { validateObjectResponse } from '../../responseValidation';

export async function createGrant(client: ApiClient, payload: CreateGrantRequest): Promise<Grant> {
  const response = await client.request<Grant>({
    method: 'POST',
    path: '/grants',
    body: payload,
  });
  return validateObjectResponse(response, 'createGrant', ['_id'] as any) as Grant;
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
  return validateObjectResponse(response, 'listGrants', ['grants', 'totalCount'] as any) as GrantListResponse;
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
  return validateObjectResponse(response, 'getGrant', ['_id'] as any) as Grant;
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
    ['transactions', 'totalCount'] as any
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
  return validateObjectResponse(response, 'createGrantTransaction', ['_id'] as any);
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
    ['message', 'transactionId', 'fromGrantId', 'toGrantId'] as any
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
  return validateObjectResponse(response, 'updateGrant', ['_id'] as any) as Grant;
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
  return validateObjectResponse(response, 'estimateShipping', ['estimates'] as any) as ShippingEstimateResponse;
}


