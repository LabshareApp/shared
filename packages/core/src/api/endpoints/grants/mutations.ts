import type { ApiClient } from '../../ApiClient';
import type {
  Grant,
  GrantTransaction,
  CreateGrantData,
  UpdateGrantData,
  CreateGrantTransactionData,
  ShippingEstimateRequest,
  ShippingEstimateResponse,
} from '../../../types/grants';
import { validateObjectResponse } from '../../responseValidation';

type NormalizedGrant = Omit<Grant, 'id'> & { _id?: string; id?: string };

function normalizeGrant(grant: NormalizedGrant): Grant {
  const idValue = (grant as any)?._id || (grant as any)?.id;
  if (!idValue) return grant as any as Grant;
  return { ...(grant as any), _id: idValue, id: idValue } as Grant;
}

export async function createGrant(
  client: ApiClient,
  grantData: CreateGrantData
): Promise<Grant> {
  // Backend returns the grant object directly, not wrapped in { grant: ... }
  const response = await client.request<NormalizedGrant>({
    method: 'POST',
    path: '/grants',
    body: grantData,
  });

  // Response is the grant object directly
  return normalizeGrant(response);
}

export async function updateGrant(
  client: ApiClient,
  grantId: string,
  grantData: UpdateGrantData
): Promise<Grant> {
  if (!grantId) {
    throw new Error('Grant ID is required');
  }
  const response = await client.request<{ grant: NormalizedGrant }>({
    method: 'PUT',
    path: '/update-grant',
    query: { id: String(grantId) },
    body: grantData,
  });

  const validated = validateObjectResponse(response, 'updateGrant', ['grant'] as any) as any;
  return normalizeGrant(validated.grant);
}

export async function deleteGrant(
  client: ApiClient,
  grantId: string
): Promise<void> {
  if (!grantId) {
    throw new Error('Grant ID is required');
  }
  await client.request({
    method: 'DELETE',
    path: '/delete-grant',
    query: { id: String(grantId) },
  });
}

export async function createGrantTransaction(
  client: ApiClient,
  grantId: string,
  transactionData: CreateGrantTransactionData
): Promise<GrantTransaction> {
  const response = await client.request<{ transaction: GrantTransaction }>({
    method: 'POST',
    path: '/create-grant-transaction',
    query: { grantId },
    body: transactionData,
  });

  const validated = validateObjectResponse(response, 'createGrantTransaction', ['transaction'] as any) as any;
  return validated.transaction;
}

export async function linkGrantTag(
  client: ApiClient,
  grantId: string,
  tagId: string
): Promise<Grant> {
  const response = await client.request<{ grant: NormalizedGrant }>({
    method: 'POST',
    path: '/link-grant-tag',
    query: { grantId },
    body: { tagId },
  });

  const validated = validateObjectResponse(response, 'linkGrantTag', ['grant'] as any) as any;
  return normalizeGrant(validated.grant);
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


