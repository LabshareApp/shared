import type { ApiClient } from '../../ApiClient';
import type { CollaboratorFilterRequest, CollaboratorFilterResponse, CollaboratorSearchParams, CollaboratorSearchResponse } from '../../../types/collaboration';
export declare function searchCollaboratorItems(client: ApiClient, params: CollaboratorSearchParams): Promise<CollaboratorSearchResponse>;
export declare function filterCollaboratorItems(client: ApiClient, request: CollaboratorFilterRequest): Promise<CollaboratorFilterResponse>;
//# sourceMappingURL=inventory.d.ts.map