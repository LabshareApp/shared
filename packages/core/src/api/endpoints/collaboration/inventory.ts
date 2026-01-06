import type { ApiClient } from '../../ApiClient';
import type {
  CollaboratorFilterRequest,
  CollaboratorFilterResponse,
  CollaboratorSearchParams,
  CollaboratorSearchResponse,
} from '../../../types/collaboration';
import type { SearchRequest } from '../../../types/inventory';
import { validateObjectResponse } from '../../responseValidation';

// Check if we're in development mode
// @ts-ignore - __DEV__ is a global defined by React Native/Metro bundler
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');

// Legacy GET endpoint (backward compatibility)
export async function searchCollaboratorItems(
  client: ApiClient,
  params: CollaboratorSearchParams,
  signal?: AbortSignal
): Promise<CollaboratorSearchResponse> {
  const query: Record<string, any> = {};
  if (params.term) query.term = params.term;
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.labId) query.labId = params.labId;

  // Multi-valued query params: pass as a comma-separated string since ApiClient's query map
  // is a simple Record and Metro clients already support this pattern elsewhere.
  if (params.labIds && params.labIds.length > 0) query.labIds = params.labIds.join(',');

  const response = await client.request<CollaboratorSearchResponse>({
    method: 'GET',
    path: '/search-collaborator-items',
    query,
    signal, // Add signal support
  });

  if (isDev) {
    console.log('[searchCollaboratorItems] Raw response:', response);
  }

  // Ensure items is always an array, even if backend returns null
  const validated = validateObjectResponse(response, 'searchCollaboratorItems', ['items', 'totalCount'] as any) as any;
  
  // Handle null items array
  if (!validated.items || !Array.isArray(validated.items)) {
    if (isDev) {
      console.warn('[searchCollaboratorItems] Items is not an array, defaulting to empty array:', validated.items);
    }
    validated.items = [];
  }
  
  // Ensure totalCount is a number
  if (typeof validated.totalCount !== 'number') {
    validated.totalCount = validated.items.length;
  }
  
  return validated as CollaboratorSearchResponse;
}

// New POST endpoint with SearchRequest
export async function searchCollaboratorItemsWithFilters(
  client: ApiClient,
  searchRequest: SearchRequest,
  page: number = 1,
  limit: number = 20,
  sortBy: 'name' | 'date' | 'updatedAt' | string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc',
  signal?: AbortSignal
): Promise<CollaboratorSearchResponse> {
  const queryParams = {
    page,
    limit,
    sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
    sortDirection,
  };

  const response = await client.request<CollaboratorSearchResponse>({
    method: 'POST',
    path: '/search-collaborator-items',
    body: searchRequest,
    query: queryParams,
    signal,
  });

  if (isDev) {
    console.log('[searchCollaboratorItemsWithFilters] Raw response:', response);
  }

  // Ensure items is always an array
  const validated = validateObjectResponse(response, 'searchCollaboratorItemsWithFilters', ['items', 'totalCount'] as any) as any;
  
  if (!validated.items || !Array.isArray(validated.items)) {
    validated.items = [];
  }
  
  if (typeof validated.totalCount !== 'number') {
    validated.totalCount = validated.items.length;
  }
  
  return validated as CollaboratorSearchResponse;
}

export async function filterCollaboratorItems(
  client: ApiClient,
  request: CollaboratorFilterRequest
): Promise<CollaboratorFilterResponse> {
  const response = await client.request<CollaboratorFilterResponse>({
    method: 'POST',
    path: '/filter-collaborator-items',
    body: request,
  });
  return validateObjectResponse(response, 'filterCollaboratorItems', ['items'] as any) as any;
}




