/**
 * Institution Management API Endpoints
 *
 * Provides API client functions for institution management operations.
 */
import { ApiClient } from '../ApiClient';
import type { Institution, InstitutionPublicInfo, Department, CreateDepartmentRequest, UpdateDepartmentRequest, LabDepartmentRequest, InstitutionMembership, AllowedCollaboration, InstitutionCollaborationRequest, InstitutionCollaborationActionRequest, InstitutionLabInfo } from '../../types/institution';
/**
 * Get all institutions the current user belongs to
 */
export declare function listUserInstitutions(client: ApiClient): Promise<Institution[]>;
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
export declare function getInstitutionMembers(client: ApiClient, institutionId: string): Promise<InstitutionMembership[]>;
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
//# sourceMappingURL=institution.d.ts.map