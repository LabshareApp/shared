import type { ApiClient } from '../../ApiClient';
import type { InventoryItem, SearchRequest } from '../../../types/inventory';
import { mapInventoryItems, validatePaginatedResponse } from '../../responseValidation';
import { logger } from '../../../utils/logger';

export async function searchInventory(
  client: ApiClient,
  searchRequest: SearchRequest,
  page: number = 1,
  limit: number = 20,
  sortBy: 'name' | 'date' | string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc',
  signal?: AbortSignal
): Promise<{ items: InventoryItem[]; totalCount: number }> {
  // Validate and normalize pagination parameters
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(100, Math.max(1, limit)); // Server max is 100
  
  // Validate and normalize sort parameters
  const allowedSortFields = ['name', 'updatedAt', 'createdAt', 'expirationDate'];
  let validatedSortBy = sortBy === 'date' ? 'updatedAt' : sortBy;
  if (!allowedSortFields.includes(validatedSortBy)) {
    validatedSortBy = 'name';
  }
  
  const validatedSortDirection = (sortDirection === 'asc' || sortDirection === 'desc') 
    ? sortDirection 
    : 'asc';
  
  const queryParams = {
    page,
    limit,
    sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
    sortDirection,
  };

  logger.debug('searchInventory request', {
    path: '/search',
    query: queryParams,
    hasGlobalSearchTerm: !!searchRequest.globalSearchTerm,
  });

  try {
    const response = await client.request<{ items?: InventoryItem[]; Items?: InventoryItem[]; totalCount?: number; TotalCount?: number }>({
      method: 'POST',
      path: '/search',
      body: searchRequest,
      query: queryParams,
      signal, // Pass signal to request
    });

    // Handle both possible response formats
    // Backend might return { items, totalCount } or { Items, TotalCount }
    const items = response.items || response.Items || [];
    const totalCount = response.totalCount ?? response.TotalCount ?? 0;

    if (!Array.isArray(items)) {
      logger.error('Invalid items format in searchInventory response', {
        itemsType: typeof items,
        responseKeys: Object.keys(response || {}),
      });
      throw new Error(`Unexpected response format from searchInventory: items is not an array. Got: ${typeof items}. Response: ${JSON.stringify(response).substring(0, 200)}`);
    }

    const mappedItems = mapInventoryItems(items);
    logger.debug('searchInventory success', { itemCount: mappedItems.length, totalCount });
    
    return { items: mappedItems, totalCount };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStatus = (error as { status?: number }).status;
    logger.error('searchInventory error', {
      message: errorMessage,
      status: errorStatus,
    });
    throw error;
  }
}

