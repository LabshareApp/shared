/**
 * Institution Management API Endpoints
 *
 * Provides API client functions for institution management operations.
 */

import { ApiClient, ApiRequest } from '../ApiClient';
import type {
  Institution,
  InstitutionPublicInfo,
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  LabDepartmentRequest,
  InstitutionMembership,
  InstitutionMemberInfo,
  InstitutionRole,
  AllowedCollaboration,
  InstitutionCollaborationRequest,
  InstitutionCollaborationActionRequest,
  InstitutionLabInfo,
  CollaborationHistoryResponse,
  InstitutionOrderRequestsParams,
  InstitutionOrderRequestsResponse,
  InstitutionInventoryParams,
  InstitutionInventoryResponse,
} from '../../types/institution';

// --- Institution Endpoints ---

/**
 * Get all institutions the current user belongs to
 */
export async function listUserInstitutions(
  client: ApiClient
): Promise<Institution[]> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institutions',
  };
  return client.request(request);
}

/**
 * Get a single institution by ID
 */
export async function getInstitution(
  client: ApiClient,
  institutionId: string
): Promise<Institution> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institution',
    query: { id: institutionId },
  };
  return client.request(request);
}

/**
 * Get institution by code (public endpoint for sign-up)
 * This is a standalone function that doesn't require authentication.
 */
export async function getInstitutionByCode(
  baseUrl: string,
  code: string
): Promise<InstitutionPublicInfo> {
  const response = await fetch(`${baseUrl}/repository/institution/by-code?code=${encodeURIComponent(code)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to get institution: ${response.status}`);
  }

  return response.json();
}

/**
 * Get all labs belonging to an institution
 */
export async function getInstitutionLabs(
  client: ApiClient,
  institutionId: string
): Promise<InstitutionLabInfo[]> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institution/labs',
    query: { institutionId },
  };
  return client.request(request);
}

/**
 * Get all members of an institution (admin only)
 */
export async function getInstitutionMembers(
  client: ApiClient,
  institutionId: string
): Promise<InstitutionMemberInfo[]> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institution/members',
    query: { institutionId },
  };
  return client.request(request);
}

/**
 * Response from getMyInstitutionMembership
 */
export interface MyMembershipResponse extends InstitutionMembership {
  role?: InstitutionRole;
}

/**
 * Get the current user's membership for an institution
 */
export async function getMyInstitutionMembership(
  client: ApiClient,
  institutionId: string
): Promise<MyMembershipResponse> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institution/my-membership',
    query: { institutionId },
  };
  return client.request(request);
}

/**
 * Pending member type (alias for clarity)
 */
export type PendingMember = InstitutionMemberInfo;

/**
 * Get pending members awaiting approval (admin only)
 */
export async function getPendingMembers(
  client: ApiClient,
  institutionId: string
): Promise<PendingMember[]> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institution/pending-members',
    query: { institutionId },
  };
  return client.request(request);
}

/**
 * Request to approve/reject a pending member
 */
export interface MemberActionRequest {
  membershipId: string;
}

/**
 * Approve a pending institution member (admin only)
 */
export async function approvePendingMember(
  client: ApiClient,
  institutionId: string,
  data: MemberActionRequest
): Promise<void> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/institution/approve-member',
    query: { institutionId },
    body: data,
  };
  return client.request(request);
}

/**
 * Reject a pending institution member (admin only)
 */
export async function rejectPendingMember(
  client: ApiClient,
  institutionId: string,
  data: MemberActionRequest
): Promise<void> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/institution/reject-member',
    query: { institutionId },
    body: data,
  };
  return client.request(request);
}

// --- Department Endpoints ---

/**
 * Get all departments for an institution
 */
export async function listDepartments(
  client: ApiClient,
  institutionId: string
): Promise<Department[]> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/departments',
    query: { institutionId },
  };
  return client.request(request);
}

/**
 * Create a new department (admin only)
 */
export async function createDepartment(
  client: ApiClient,
  data: CreateDepartmentRequest
): Promise<Department> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/create-department',
    body: data,
  };
  return client.request(request);
}

/**
 * Update a department (admin only)
 */
export async function updateDepartment(
  client: ApiClient,
  departmentId: string,
  data: UpdateDepartmentRequest
): Promise<void> {
  const request: ApiRequest = {
    method: 'PUT',
    path: '/update-department',
    query: { id: departmentId },
    body: data,
  };
  return client.request(request);
}

/**
 * Delete a department (admin only)
 */
export async function deleteDepartment(
  client: ApiClient,
  departmentId: string
): Promise<void> {
  const request: ApiRequest = {
    method: 'DELETE',
    path: '/delete-department',
    query: { id: departmentId },
  };
  return client.request(request);
}

/**
 * Add a lab to a department (admin only)
 */
export async function addLabToDepartment(
  client: ApiClient,
  data: LabDepartmentRequest
): Promise<void> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/department/add-lab',
    body: data,
  };
  return client.request(request);
}

/**
 * Remove a lab from a department (admin only)
 */
export async function removeLabFromDepartment(
  client: ApiClient,
  data: LabDepartmentRequest
): Promise<void> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/department/remove-lab',
    body: data,
  };
  return client.request(request);
}

// --- Collaboration Endpoints ---

/**
 * Get all collaborations for an institution
 */
export async function listInstitutionCollaborations(
  client: ApiClient,
  institutionId: string
): Promise<AllowedCollaboration[]> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institution/collaborations',
    query: { institutionId },
  };
  return client.request(request);
}

/**
 * Request a collaboration with another institution (admin only)
 */
export async function requestInstitutionCollaboration(
  client: ApiClient,
  institutionId: string,
  data: InstitutionCollaborationRequest
): Promise<AllowedCollaboration> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/institution/request-collaboration',
    query: { institutionId },
    body: data,
  };
  return client.request(request);
}

/**
 * Approve a collaboration request (admin only)
 */
export async function approveInstitutionCollaboration(
  client: ApiClient,
  institutionId: string,
  data: InstitutionCollaborationActionRequest
): Promise<void> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/institution/approve-collaboration',
    query: { institutionId },
    body: data,
  };
  return client.request(request);
}

/**
 * Reject a collaboration request (admin only)
 */
export async function rejectInstitutionCollaboration(
  client: ApiClient,
  institutionId: string,
  data: InstitutionCollaborationActionRequest
): Promise<void> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/institution/reject-collaboration',
    query: { institutionId },
    body: data,
  };
  return client.request(request);
}

// --- Extended Registration with Institution Codes ---

// Import types from institution.ts instead of redefining them
import type {
  RegisterUserWithInstitutionsRequest,
  RegisterUserWithInstitutionsResponse,
} from '../../types/institution';

// Re-export for convenience
export type { RegisterUserWithInstitutionsRequest, RegisterUserWithInstitutionsResponse };

/**
 * Register a new user with institution codes.
 * This endpoint creates the auth user, profile, lab, and institution memberships.
 * If any step fails, all previous steps are rolled back.
 *
 * @param baseUrl - The base URL of the API server (e.g., 'http://localhost:8082')
 * @param data - The registration data including institution codes
 * @returns The registration response with userId, labId, email, and institutionIds
 */
export async function registerUserWithInstitutions(
  baseUrl: string,
  data: RegisterUserWithInstitutionsRequest
): Promise<RegisterUserWithInstitutionsResponse> {
  const response = await fetch(`${baseUrl}/repository/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Registration failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Validate institution codes before registration
 * Returns an array of institution public info for each valid code
 */
export async function validateInstitutionCodes(
  baseUrl: string,
  codes: string[]
): Promise<InstitutionPublicInfo[]> {
  const results: InstitutionPublicInfo[] = [];

  for (const code of codes) {
    try {
      const institution = await getInstitutionByCode(baseUrl, code);
      results.push(institution);
    } catch (error) {
      throw new Error(`Invalid institution code: ${code}`);
    }
  }

  return results;
}

// --- Institution Admin Dashboard Endpoints ---

/**
 * Get collaboration history with statistics (admin only)
 */
export async function getCollaborationHistory(
  client: ApiClient,
  institutionId: string
): Promise<CollaborationHistoryResponse> {
  const request: ApiRequest = {
    method: 'GET',
    path: '/institution/collaboration-history',
    query: { institutionId },
  };
  return client.request(request);
}

/**
 * Search order requests across all institution labs (admin only)
 */
export async function searchInstitutionOrderRequests(
  client: ApiClient,
  institutionId: string,
  params: InstitutionOrderRequestsParams
): Promise<InstitutionOrderRequestsResponse> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/institution/search-requests',
    query: { institutionId },
    body: {
      view: params.view,
      labIds: params.labIds,
      query: params.query,
      page: params.page ?? 1,
      limit: params.limit ?? 50,
    },
  };
  return client.request(request);
}

/**
 * Search inventory across all institution labs (admin only)
 */
export async function searchInstitutionInventory(
  client: ApiClient,
  institutionId: string,
  params: InstitutionInventoryParams
): Promise<InstitutionInventoryResponse> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/institution/search-inventory',
    query: { institutionId },
    body: {
      labIds: params.labIds,
      query: params.query,
      page: params.page ?? 1,
      limit: params.limit ?? 50,
    },
  };
  return client.request(request);
}

// --- Lab Join Endpoint (for institution-only users) ---

/**
 * Request to join a lab
 */
export interface JoinLabRequest {
  labId: string;
}

/**
 * Response from joining a lab
 */
export interface JoinLabResponse {
  labId: string;
  labName: string;
}

/**
 * Join an existing lab (for institution-only users)
 */
export async function joinLab(
  client: ApiClient,
  data: JoinLabRequest
): Promise<JoinLabResponse> {
  const request: ApiRequest = {
    method: 'POST',
    path: '/join-lab',
    body: data,
  };
  return client.request(request);
}
