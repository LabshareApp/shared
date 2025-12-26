import type { ApiClient } from '../../ApiClient';
import type {
  CollaboratorFilterRequest,
  CollaboratorFilterResponse,
  CollaboratorSearchParams,
  CollaboratorSearchResponse,
} from '../../../types/collaboration';
import { validateObjectResponse } from '../../responseValidation';

export async function searchCollaboratorItems(
  client: ApiClient,
  params: CollaboratorSearchParams
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
  });

  console.log('[searchCollaboratorItems] Raw response:', response);

  // Ensure items is always an array, even if backend returns null
  const validated = validateObjectResponse(response, 'searchCollaboratorItems', ['items', 'totalCount'] as any) as any;
  
  // Handle null items array
  if (!validated.items || !Array.isArray(validated.items)) {
    console.warn('[searchCollaboratorItems] Items is not an array, defaulting to empty array:', validated.items);
    validated.items = [];
  }
  
  // Ensure totalCount is a number
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



