import type { ApiClient } from '../../ApiClient';
import type { InventoryItem, SearchRequest } from '../../../types/inventory';
import { mapInventoryItems, validatePaginatedResponse } from '../../responseValidation';

export async function searchInventory(
  client: ApiClient,
  searchRequest: SearchRequest,
  page: number = 1,
  limit: number = 20,
  sortBy: 'name' | 'date' | string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<{ items: InventoryItem[]; totalCount: number }> {
  const queryParams = {
    page,
    limit,
    sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
    sortDirection,
  };

  const response = await client.request<any>({
    method: 'POST',
    path: '/search',
    body: searchRequest,
    query: queryParams,
  });

  const validatedResponse = validatePaginatedResponse(response, 'searchInventory');
  const items = mapInventoryItems(validatedResponse.items);
  return { items, totalCount: validatedResponse.totalCount };
}

