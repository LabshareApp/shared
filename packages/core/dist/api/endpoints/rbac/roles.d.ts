import type { ApiClient } from '../../ApiClient';
import type { Role, CreateRoleRequest, UpdateRoleRequest, DeleteRoleRequest, PermissionsByResource, CurrentUserRoleResponse, InitializeLabWithAdminResponse, CreateSelfMembershipResponse } from '../../../types/rbac';
/**
 * Get all roles for the current lab
 */
export declare function getRoles(client: ApiClient): Promise<Role[]>;
/**
 * Create a new custom role
 */
export declare function createRole(client: ApiClient, data: CreateRoleRequest): Promise<Role>;
/**
 * Update an existing role
 */
export declare function updateRole(client: ApiClient, data: UpdateRoleRequest): Promise<Role>;
/**
 * Delete a custom role
 */
export declare function deleteRole(client: ApiClient, data: DeleteRoleRequest): Promise<{
    message: string;
}>;
/**
 * Get all available permissions grouped by resource
 */
export declare function getAvailablePermissions(client: ApiClient): Promise<PermissionsByResource>;
/**
 * Get available display role (title) options
 */
export declare function getDisplayRoleOptions(client: ApiClient): Promise<string[]>;
/**
 * Get the current user's role and permissions for the lab
 */
export declare function getCurrentUserRole(client: ApiClient): Promise<CurrentUserRoleResponse>;
/**
 * Initialize default roles for a lab (called during lab setup)
 */
export declare function initializeLabRoles(client: ApiClient): Promise<Role[]>;
/**
 * Initialize a lab with default roles AND create an Admin membership for the caller.
 * This should be called after a user creates a new lab (setupLab flow).
 */
export declare function initializeLabWithAdmin(client: ApiClient): Promise<InitializeLabWithAdminResponse>;
/**
 * Create a default Member membership for the calling user.
 * This should be called when a user joins an existing lab via lab code (joinLab flow).
 */
export declare function createSelfMembership(client: ApiClient): Promise<CreateSelfMembershipResponse>;
//# sourceMappingURL=roles.d.ts.map