import type { ApiClient } from '../../ApiClient';
import type { SearchRequest } from '../../../types/inventory';
import type { OrderRequestItem } from '../../../types/orderRequests';
import { validatePaginatedResponse } from '../../responseValidation';

type PaginatedOrderRequestResponse = {
  items: (Omit<OrderRequestItem, 'id'> & { _id?: string; id?: string })[];
  totalCount: number;
};

function normalize(item: any): OrderRequestItem {
  const idValue = item?._id || item?.id;
  if (!idValue) return item as OrderRequestItem;
  return { ...item, _id: idValue, id: idValue } as OrderRequestItem;
}

export async function searchOrderRequests(
  client: ApiClient,
  searchRequest: SearchRequest,
  page: number = 1,
  limit: number = 20,
  sortBy: 'name' | 'date' | string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<{ items: OrderRequestItem[]; totalCount: number }> {
  const queryParams = {
    page,
    limit,
    sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
    sortDirection,
  };

  const response = await client.request<PaginatedOrderRequestResponse>({
    method: 'POST',
    path: '/search-requests',
    body: searchRequest,
    query: queryParams,
  });

  const validated = validatePaginatedResponse(response, 'searchOrderRequests') as any;
  return { items: (validated.items ?? []).map(normalize), totalCount: validated.totalCount };
}

