import type { ApiClient } from '../../ApiClient';
import type { CollaboratorFilterRequest, CollaboratorFilterResponse, CollaboratorSearchParams, CollaboratorSearchResponse } from '../../../types/collaboration';
import type { SearchRequest } from '../../../types/inventory';
export declare function searchCollaboratorItems(client: ApiClient, params: CollaboratorSearchParams, signal?: AbortSignal): Promise<CollaboratorSearchResponse>;
export declare function searchCollaboratorItemsWithFilters(client: ApiClient, searchRequest: SearchRequest, page?: number, limit?: number, sortBy?: 'name' | 'date' | 'updatedAt' | string, sortDirection?: 'asc' | 'desc', signal?: AbortSignal): Promise<CollaboratorSearchResponse>;
export declare function filterCollaboratorItems(client: ApiClient, request: CollaboratorFilterRequest): Promise<CollaboratorFilterResponse>;
//# sourceMappingURL=inventory.d.ts.map