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

  console.log('[searchInventory] Request:', {
    path: '/search',
    body: JSON.stringify(searchRequest, null, 2),
    query: queryParams,
    hasGlobalSearchTerm: !!searchRequest.globalSearchTerm,
    globalSearchTerm: searchRequest.globalSearchTerm,
  });

  try {
    const response = await client.request<any>({
      method: 'POST',
      path: '/search',
      body: searchRequest,
      query: queryParams,
    });

    console.log('[searchInventory] Raw response:', {
      type: typeof response,
      keys: response ? Object.keys(response) : [],
      hasItems: !!(response?.items || response?.Items),
      itemsLength: (response?.items || response?.Items || []).length,
      totalCount: response?.totalCount ?? response?.TotalCount,
      fullResponse: JSON.stringify(response, null, 2).substring(0, 500),
    });

    // Handle both possible response formats
    // Backend might return { items, totalCount } or { Items, TotalCount }
    const items = response.items || response.Items || [];
    const totalCount = response.totalCount ?? response.TotalCount ?? 0;

    if (!Array.isArray(items)) {
      console.error('[searchInventory] Invalid items format:', {
        items,
        itemsType: typeof items,
        responseKeys: Object.keys(response || {}),
      });
      throw new Error(`Unexpected response format from searchInventory: items is not an array. Got: ${typeof items}. Response: ${JSON.stringify(response).substring(0, 200)}`);
    }

    const mappedItems = mapInventoryItems(items);
    console.log('[searchInventory] Success - Mapped items:', mappedItems.length, 'totalCount:', totalCount);
    
    return { items: mappedItems, totalCount };
  } catch (error: any) {
    console.error('[searchInventory] Error details:', {
      message: error?.message,
      status: error?.status,
      response: error?.response,
      stack: error?.stack,
    });
    throw error;
  }
}

