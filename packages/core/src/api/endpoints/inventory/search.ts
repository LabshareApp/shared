import type { ApiClient } from '../../ApiClient';
import type { InventoryItem, SearchRequest } from '../../../types/inventory';
import { mapInventoryItems, validatePaginatedResponse } from '../../responseValidation';

// Check if we're in development mode (works in both Node and browser environments)
// @ts-ignore - __DEV__ is a global defined by React Native/Metro bundler
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');

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
    page: validatedPage,
    limit: validatedLimit,
    sortBy: validatedSortBy,
    sortDirection: validatedSortDirection,
  };

  // Ensure numeric filter values are actual numbers (not strings) before sending
  if (searchRequest.query?.attributeFilters) {
    searchRequest.query.attributeFilters = searchRequest.query.attributeFilters.map((filter: any) => {
      const numericFields = ['totalQuantity', 'attributes.price.amount'];
      if (numericFields.includes(filter.field) && filter.value !== undefined && filter.value !== null) {
        if (typeof filter.value === 'string' && filter.value !== '') {
          const num = parseFloat(filter.value);
          if (!isNaN(num)) {
            return { ...filter, value: num };
          }
        }
      }
      return filter;
    });
  }

  if (isDev) {
    console.log('[searchInventory] Request:', {
      path: '/search',
      body: JSON.stringify(searchRequest, null, 2),
      query: queryParams,
      hasGlobalSearchTerm: !!searchRequest.globalSearchTerm,
      globalSearchTerm: searchRequest.globalSearchTerm,
      attributeFilters: searchRequest.query?.attributeFilters?.map((f: any) => ({
        field: f.field,
        operator: f.operator,
        value: f.value,
        valueType: typeof f.value,
      })),
    });
  }

  try {
    const response = await client.request<any>({
      method: 'POST',
      path: '/search',
      body: searchRequest,
      query: queryParams,
      signal, // Pass signal to request
    });

    if (isDev) {
      console.log('[searchInventory] Raw response:', {
        type: typeof response,
        keys: response ? Object.keys(response) : [],
        hasItems: !!(response?.items || response?.Items),
        itemsLength: (response?.items || response?.Items || []).length,
        totalCount: response?.totalCount ?? response?.TotalCount,
        fullResponse: JSON.stringify(response, null, 2).substring(0, 500),
      });
    }

    // Handle both possible response formats
    // Backend might return { items, totalCount } or { Items, TotalCount }
    const items = response.items || response.Items || [];
    const totalCount = response.totalCount ?? response.TotalCount ?? 0;

    if (!Array.isArray(items)) {
      if (isDev) {
        console.error('[searchInventory] Invalid items format:', {
          items,
          itemsType: typeof items,
          responseKeys: Object.keys(response || {}),
        });
      }
      throw new Error(`Unexpected response format from searchInventory: items is not an array. Got: ${typeof items}. Response: ${JSON.stringify(response).substring(0, 200)}`);
    }

    const mappedItems = mapInventoryItems(items);
    if (isDev) {
      console.log('[searchInventory] Success - Mapped items:', mappedItems.length, 'totalCount:', totalCount);
    }
    
    return { items: mappedItems, totalCount };
  } catch (error: any) {
    // Don't log cancellation errors
    if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
      throw error;
    }

    if (isDev) {
      console.error('[searchInventory] Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response,
        stack: error?.stack,
      });
    }
    throw error;
  }
}

