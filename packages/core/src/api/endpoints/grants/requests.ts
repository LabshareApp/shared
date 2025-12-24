import type { ApiClient } from '../../ApiClient';
import type {
  Grant,
  GrantTransaction,
  ListGrantsResponse,
  ListGrantTransactionsResponse,
  ListGrantItemsResponse,
} from '../../../types/grants';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

type NormalizedGrant = Omit<Grant, 'id'> & { _id?: string; id?: string };
type NormalizedGrantTransaction = Omit<GrantTransaction, 'id'> & { _id?: string; id?: string };

function normalizeGrant(grant: NormalizedGrant): Grant {
  const idValue = (grant as any)?._id || (grant as any)?.id;
  if (!idValue) return grant as any as Grant;
  return { ...(grant as any), _id: idValue, id: idValue } as Grant;
}

function normalizeGrantTransaction(transaction: NormalizedGrantTransaction): GrantTransaction {
  const idValue = (transaction as any)?._id || (transaction as any)?.id;
  if (!idValue) return transaction as any as GrantTransaction;
  return { ...(transaction as any), _id: idValue, id: idValue } as GrantTransaction;
}

export async function fetchGrants(
  client: ApiClient,
  params?: { status?: string; page?: number; limit?: number }
): Promise<ListGrantsResponse> {
  const response = await client.request<NormalizedGrant[] | { grants: NormalizedGrant[]; totalCount: number }>({
    method: 'GET',
    path: '/grants',
    query: {
      status: params?.status ?? null,
      page: params?.page ?? null,
      limit: params?.limit ?? null,
    },
  });

  // Handle both response formats: array directly or object with grants array
  let grants: NormalizedGrant[];
  let totalCount: number;

  if (Array.isArray(response)) {
    // Response is directly an array
    grants = response;
    totalCount = response.length;
  } else {
    // Response is an object with grants and totalCount
    const validated = validateObjectResponse(response, 'fetchGrants', ['grants'] as any) as any;
    grants = validateArrayResponse<NormalizedGrant>(validated.grants, 'fetchGrants.grants');
    totalCount = validated.totalCount ?? grants.length;
  }

  return { grants: grants.map(normalizeGrant), totalCount };
}

export async function fetchGrant(
  client: ApiClient,
  grantId: string
): Promise<Grant> {
  const response = await client.request<{ grant: NormalizedGrant }>({
    method: 'GET',
    path: '/get-grant',
    query: { grantId },
  });

  const validated = validateObjectResponse(response, 'fetchGrant', ['grant'] as any) as any;
  return normalizeGrant(validated.grant);
}

export async function fetchGrantTransactions(
  client: ApiClient,
  grantId: string,
  params?: { page?: number; limit?: number; type?: string }
): Promise<ListGrantTransactionsResponse> {
  // Build query object, only including defined values
  const query: Record<string, string | number> = {
    grantId,
  };
  
  if (params?.page !== undefined) {
    query.page = params.page;
  }
  if (params?.limit !== undefined) {
    query.limit = params.limit;
  }
  if (params?.type !== undefined && params.type !== null) {
    query.type = params.type;
  }

  const response = await client.request<{ transactions: NormalizedGrantTransaction[] | null; totalCount: number }>({
    method: 'GET',
    path: '/get-grant-transactions',
    query,
  });

  // Response should always be an object with transactions and totalCount
  const validated = validateObjectResponse(response, 'fetchGrantTransactions', ['transactions'] as any) as any;
  
  // Handle null transactions (backend might return null for empty arrays)
  const transactionsArray = validated.transactions === null || validated.transactions === undefined 
    ? [] 
    : validated.transactions;
  
  const transactions = validateArrayResponse<NormalizedGrantTransaction>(
    transactionsArray,
    'fetchGrantTransactions.transactions'
  );
  const totalCount = validated.totalCount ?? transactions.length;

  return { transactions: transactions.map(normalizeGrantTransaction), totalCount };
}

export async function fetchGrantItems(
  client: ApiClient,
  grantId: string,
  params?: { page?: number; limit?: number }
): Promise<ListGrantItemsResponse> {
  const response = await client.request<{ items: any[]; totalCount: number }>({
    method: 'GET',
    path: '/get-grant-items',
    query: {
      grantId,
      page: params?.page ?? null,
      limit: params?.limit ?? null,
    },
  });

  const validated = validateObjectResponse(response, 'fetchGrantItems', ['items', 'totalCount'] as any) as any;
  const items = validateArrayResponse<any>(validated.items, 'fetchGrantItems.items');

  return { items, totalCount: validated.totalCount };
}


