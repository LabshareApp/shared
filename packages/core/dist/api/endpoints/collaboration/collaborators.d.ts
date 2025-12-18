import type { ApiClient } from '../../ApiClient';
import type { CollaborationResponse, Collaborator, LabInfo } from '../../../types/collaboration';
export declare function createCollaboratorRequest(client: ApiClient, targetLabId: string): Promise<CollaborationResponse>;
export declare function acceptCollaboratorRequest(client: ApiClient, requestingLabId: string): Promise<CollaborationResponse>;
export declare function deleteCollaborator(client: ApiClient, collaboratorLabId: string): Promise<CollaborationResponse>;
export declare function listCollaborators(client: ApiClient): Promise<Collaborator[]>;
export declare function getAvailableLabs(client: ApiClient): Promise<LabInfo[]>;
//# sourceMappingURL=collaborators.d.ts.map