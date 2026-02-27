/**
 * Institution Management API Endpoints
 *
 * Provides API client functions for institution management operations.
 */
import { ApiClient } from '../ApiClient';
import type { Institution, InstitutionPublicInfo, Department, CreateDepartmentRequest, UpdateDepartmentRequest, LabDepartmentRequest, InstitutionMembership, InstitutionMemberInfo, InstitutionRole, InstitutionPermissionsByResource, AllowedCollaboration, InstitutionCollaborationRequest, InstitutionCollaborationActionRequest, InstitutionLabInfo, InstitutionDirectoryResponse, CollaborationHistoryResponse, InstitutionOrderRequestsParams, InstitutionOrderRequestsResponse, InstitutionInventoryParams, InstitutionInventoryResponse, InstitutionInvitationDetails, CreateInstitutionRoleRequest, UpdateInstitutionRoleRequest, DeleteInstitutionRoleRequest, PlaceInstitutionOrderRequest, PlaceInstitutionOrderResponse, RevertInstitutionOrderRequest, UpdateInstitutionProfileRequest } from '../../types/institution';
/**
 * Get all institutions the current user belongs to
 */
export declare function listUserInstitutions(client: ApiClient): Promise<Institution[]>;
import type { PendingInstitutionInfo } from '../../types/institution';
/**
 * Get institutions where user has pending membership
 */
export declare function listPendingInstitutions(client: ApiClient): Promise<PendingInstitutionInfo[]>;
/**
 * Get a single institution by ID
 */
export declare function getInstitution(client: ApiClient, institutionId: string): Promise<Institution>;
/**
 * Get institution by code (public endpoint for sign-up)
 * This is a standalone function that doesn't require authentication.
 */
export declare function getInstitutionByCode(baseUrl: string, code: string): Promise<InstitutionPublicInfo>;
/**
 * Get all labs belonging to an institution
 */
export declare function getInstitutionLabs(client: ApiClient, institutionId: string): Promise<InstitutionLabInfo[]>;
/**
 * Get all members of an institution (admin only)
 */
export declare function getInstitutionMembers(client: ApiClient, institutionId: string): Promise<InstitutionMemberInfo[]>;
/**
 * Response from getMyInstitutionMembership
 */
export interface MyMembershipResponse extends InstitutionMembership {
    role?: InstitutionRole;
    departmentIds?: string[];
}
/**
 * Get the current user's membership for an institution
 */
export declare function getMyInstitutionMembership(client: ApiClient, institutionId: string): Promise<MyMembershipResponse>;
/**
 * Pending member type (alias for clarity)
 */
export type PendingMember = InstitutionMemberInfo;
/**
 * Get pending members awaiting approval (admin only)
 */
export declare function getPendingMembers(client: ApiClient, institutionId: string): Promise<PendingMember[]>;
/**
 * Request to approve/reject a pending member
 */
export interface MemberActionRequest {
    membershipId: string;
}
/**
 * Approve a pending institution member (admin only)
 */
export declare function approvePendingMember(client: ApiClient, institutionId: string, data: MemberActionRequest): Promise<void>;
/**
 * Reject a pending institution member (admin only)
 */
export declare function rejectPendingMember(client: ApiClient, institutionId: string, data: MemberActionRequest): Promise<void>;
/**
 * Get all departments for an institution
 */
export declare function listDepartments(client: ApiClient, institutionId: string): Promise<Department[]>;
/**
 * Create a new department (admin only)
 */
export declare function createDepartment(client: ApiClient, data: CreateDepartmentRequest): Promise<Department>;
/**
 * Update a department (admin only)
 */
export declare function updateDepartment(client: ApiClient, departmentId: string, data: UpdateDepartmentRequest): Promise<void>;
/**
 * Delete a department (admin only)
 */
export declare function deleteDepartment(client: ApiClient, departmentId: string): Promise<void>;
/**
 * Add a lab to a department (admin only)
 */
export declare function addLabToDepartment(client: ApiClient, data: LabDepartmentRequest): Promise<void>;
/**
 * Remove a lab from a department (admin only)
 */
export declare function removeLabFromDepartment(client: ApiClient, data: LabDepartmentRequest): Promise<void>;
/**
 * Get all collaborations for an institution
 */
export declare function listInstitutionCollaborations(client: ApiClient, institutionId: string): Promise<AllowedCollaboration[]>;
/**
 * Request a collaboration with another institution (admin only)
 */
export declare function requestInstitutionCollaboration(client: ApiClient, institutionId: string, data: InstitutionCollaborationRequest): Promise<AllowedCollaboration>;
/**
 * Approve a collaboration request (admin only)
 */
export declare function approveInstitutionCollaboration(client: ApiClient, institutionId: string, data: InstitutionCollaborationActionRequest): Promise<void>;
/**
 * Reject a collaboration request (admin only)
 */
export declare function rejectInstitutionCollaboration(client: ApiClient, institutionId: string, data: InstitutionCollaborationActionRequest): Promise<void>;
import type { RegisterUserWithInstitutionsRequest, RegisterUserWithInstitutionsResponse } from '../../types/institution';
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
export declare function registerUserWithInstitutions(baseUrl: string, data: RegisterUserWithInstitutionsRequest): Promise<RegisterUserWithInstitutionsResponse>;
/**
 * Validate institution codes before registration
 * Returns an array of institution public info for each valid code
 */
export declare function validateInstitutionCodes(baseUrl: string, codes: string[]): Promise<InstitutionPublicInfo[]>;
/**
 * Request to update an institution member's role
 */
export interface UpdateInstitutionMemberRoleRequest {
    membershipId: string;
    roleName: string;
    departmentId?: string;
    departmentIds?: string[];
}
/**
 * Update an institution member's role (admin only)
 */
export declare function updateInstitutionMemberRole(client: ApiClient, data: UpdateInstitutionMemberRoleRequest): Promise<void>;
/**
 * Get the hierarchical directory of departments, labs, and members
 */
export declare function getInstitutionDirectory(client: ApiClient, institutionId: string): Promise<InstitutionDirectoryResponse>;
/**
 * Search institutions by name or code
 */
export declare function searchInstitutions(client: ApiClient, query?: string, limit?: number): Promise<InstitutionPublicInfo[]>;
/**
 * Get collaboration history with statistics (admin only)
 */
export declare function getCollaborationHistory(client: ApiClient, institutionId: string): Promise<CollaborationHistoryResponse>;
/**
 * Search order requests across all institution labs (admin only)
 */
export declare function searchInstitutionOrderRequests(client: ApiClient, institutionId: string, params: InstitutionOrderRequestsParams): Promise<InstitutionOrderRequestsResponse>;
/**
 * Search inventory across all institution labs (admin only)
 */
export declare function searchInstitutionInventory(client: ApiClient, institutionId: string, params: InstitutionInventoryParams): Promise<InstitutionInventoryResponse>;
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
export declare function joinLab(client: ApiClient, data: JoinLabRequest): Promise<JoinLabResponse>;
/**
 * Get all roles for an institution
 */
export declare function getInstitutionRoles(client: ApiClient, institutionId: string): Promise<InstitutionRole[]>;
/** Alias for getInstitutionRoles */
export declare const listInstitutionRoles: typeof getInstitutionRoles;
/**
 * Get available permissions grouped by resource
 */
export declare function getInstitutionAvailablePermissions(client: ApiClient, institutionId: string): Promise<InstitutionPermissionsByResource>;
/**
 * Create a new institution role (admin only)
 */
export declare function createInstitutionRole(client: ApiClient, data: CreateInstitutionRoleRequest): Promise<InstitutionRole>;
/**
 * Update an institution role (admin only)
 */
export declare function updateInstitutionRole(client: ApiClient, data: UpdateInstitutionRoleRequest): Promise<void>;
/**
 * Delete an institution role (admin only)
 */
export declare function deleteInstitutionRole(client: ApiClient, data: DeleteInstitutionRoleRequest): Promise<void>;
/**
 * Get institution invitation details by invite code (public endpoint)
 */
export declare function getInstitutionInvitationByCode(baseUrl: string, code: string): Promise<InstitutionInvitationDetails>;
/**
 * Claim an institution invitation (authenticated)
 */
export declare function claimInstitutionInvitation(client: ApiClient, data: {
    inviteCode: string;
}): Promise<void>;
/**
 * Request to create an institution invitation
 */
export interface CreateInstitutionInvitationRequest {
    email: string;
    firstName: string;
    lastName: string;
    institutionId: string;
    roleName: string;
    departmentIds?: string[];
}
/**
 * Create a new institution invitation (admin only)
 */
export declare function createInstitutionInvitation(client: ApiClient, data: CreateInstitutionInvitationRequest): Promise<InstitutionInvitationDetails>;
/**
 * List all invitations for an institution (admin only)
 */
export declare function listInstitutionInvitations(client: ApiClient, institutionId: string): Promise<InstitutionInvitationDetails[]>;
/**
 * Cancel an institution invitation (admin only)
 */
export declare function cancelInstitutionInvitation(client: ApiClient, data: {
    inviteCode?: string;
    invitationId?: string;
}): Promise<void>;
/**
 * Resend an institution invitation (admin only)
 */
export declare function resendInstitutionInvitation(client: ApiClient, data: {
    invitationId: string;
}): Promise<void>;
/**
 * Place an institution order (admin only)
 */
export declare function placeInstitutionOrder(client: ApiClient, data: PlaceInstitutionOrderRequest): Promise<PlaceInstitutionOrderResponse>;
/**
 * Revert an institution order back to current (admin only)
 */
export declare function revertInstitutionOrder(client: ApiClient, data: RevertInstitutionOrderRequest): Promise<void>;
/**
 * Update institution profile (admin only)
 */
export declare function updateInstitutionProfile(client: ApiClient, institutionId: string, data: UpdateInstitutionProfileRequest): Promise<void>;
//# sourceMappingURL=institution.d.ts.map