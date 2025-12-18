import type { ApiClient } from '../../ApiClient';
import type {
  AcceptCollaborationRequest,
  CollaborationRequest,
  CollaborationResponse,
  Collaborator,
  DeleteCollaborationRequest,
  LabInfo,
} from '../../../types/collaboration';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

export async function createCollaboratorRequest(
  client: ApiClient,
  targetLabId: string
): Promise<CollaborationResponse> {
  const request: CollaborationRequest = { target_lab_id: targetLabId };
  const response = await client.request<CollaborationResponse>({
    method: 'POST',
    path: '/create-collaborator-request',
    body: request,
  });
  return validateObjectResponse(response, 'createCollaboratorRequest', ['message'] as any);
}

export async function acceptCollaboratorRequest(
  client: ApiClient,
  requestingLabId: string
): Promise<CollaborationResponse> {
  const request: AcceptCollaborationRequest = { requesting_lab_id: requestingLabId };
  const response = await client.request<CollaborationResponse>({
    method: 'POST',
    path: '/accept-collaborator-request',
    body: request,
  });
  return validateObjectResponse(response, 'acceptCollaboratorRequest', ['message'] as any);
}

export async function deleteCollaborator(
  client: ApiClient,
  collaboratorLabId: string
): Promise<CollaborationResponse> {
  const request: DeleteCollaborationRequest = { collaborator_lab_id: collaboratorLabId };
  const response = await client.request<CollaborationResponse>({
    method: 'DELETE',
    path: '/delete-collaborator',
    body: request,
  });
  return validateObjectResponse(response, 'deleteCollaborator', ['message'] as any);
}

export async function listCollaborators(client: ApiClient): Promise<Collaborator[]> {
  const response = await client.request<Collaborator[]>({
    method: 'GET',
    path: '/list-collaborators',
  });
  return validateArrayResponse<Collaborator>(response, 'listCollaborators');
}

export async function getAvailableLabs(client: ApiClient): Promise<LabInfo[]> {
  const response = await client.request<LabInfo[]>({
    method: 'GET',
    path: '/available-labs',
  });
  return validateArrayResponse<LabInfo>(response, 'getAvailableLabs');
}

