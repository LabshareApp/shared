import type { ApiClient } from '../../ApiClient';
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  DeleteRoleRequest,
  PermissionsByResource,
  CurrentUserRoleResponse,
  InitializeLabWithAdminResponse,
  CreateSelfMembershipResponse,
} from '../../../types/rbac';
import { validateArrayResponse, normalizeMongoId } from '../../responseValidation';

/**
 * Get all roles for the current lab
 */
export async function getRoles(client: ApiClient): Promise<Role[]> {
  const res = await client.request<Role[]>({
    method: 'GET',
    path: '/get-roles',
  });
  return validateArrayResponse<Role>(res, 'getRoles').map(normalizeMongoId);
}

/**
 * Create a new custom role
 */
export async function createRole(
  client: ApiClient,
  data: CreateRoleRequest
): Promise<Role> {
  return client.request<Role>({
    method: 'POST',
    path: '/create-role',
    body: data,
  });
}

/**
 * Update an existing role
 */
export async function updateRole(
  client: ApiClient,
  data: UpdateRoleRequest
): Promise<Role> {
  return client.request<Role>({
    method: 'PUT',
    path: '/update-role',
    body: data,
  });
}

/**
 * Delete a custom role
 */
export async function deleteRole(
  client: ApiClient,
  data: DeleteRoleRequest
): Promise<{ message: string }> {
  return client.request<{ message: string }>({
    method: 'POST',
    path: '/delete-role',
    body: data,
  });
}

/**
 * Get all available permissions grouped by resource
 */
export async function getAvailablePermissions(
  client: ApiClient
): Promise<PermissionsByResource> {
  return client.request<PermissionsByResource>({
    method: 'GET',
    path: '/get-available-permissions',
  });
}

/**
 * Get available display role (title) options
 */
export async function getDisplayRoleOptions(
  client: ApiClient
): Promise<string[]> {
  return client.request<string[]>({
    method: 'GET',
    path: '/get-display-role-options',
  });
}

/**
 * Get the current user's role and permissions for the lab
 */
export async function getCurrentUserRole(
  client: ApiClient
): Promise<CurrentUserRoleResponse> {
  return client.request<CurrentUserRoleResponse>({
    method: 'GET',
    path: '/get-current-user-role',
  });
}

/**
 * Initialize default roles for a lab (called during lab setup)
 */
export async function initializeLabRoles(client: ApiClient): Promise<Role[]> {
  const res = await client.request<Role[]>({
    method: 'POST',
    path: '/initialize-lab-roles',
  });
  return validateArrayResponse<Role>(res, 'initializeLabRoles');
}

/**
 * Initialize a lab with default roles AND create an Admin membership for the caller.
 * This should be called after a user creates a new lab (setupLab flow).
 */
export async function initializeLabWithAdmin(
  client: ApiClient
): Promise<InitializeLabWithAdminResponse> {
  return client.request<InitializeLabWithAdminResponse>({
    method: 'POST',
    path: '/initialize-lab-with-admin',
  });
}

/**
 * Create a default Member membership for the calling user.
 * This should be called when a user joins an existing lab via lab code (joinLab flow).
 */
export async function createSelfMembership(
  client: ApiClient
): Promise<CreateSelfMembershipResponse> {
  return client.request<CreateSelfMembershipResponse>({
    method: 'POST',
    path: '/create-self-membership',
  });
}
