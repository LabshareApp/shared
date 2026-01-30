/**
 * RBAC (Role-Based Access Control) Types
 *
 * These types define the permission model for Labshare, including:
 * - Roles with granular permissions
 * - Lab memberships connecting users to labs with roles
 * - Invitations for adding new users
 */

// ============================================================================
// Permission Types
// ============================================================================

/**
 * All available permissions in the system.
 * Format: "resource:action"
 */
export type Permission =
  // Inventory permissions
  | 'inventory:view'
  | 'inventory:edit'
  | 'inventory:delete'
  | 'inventory:export'
  // Order request permissions
  | 'orders:view'
  | 'orders:create'
  | 'orders:edit'
  | 'orders:approve'
  | 'orders:delete'
  // Grants permissions
  | 'grants:view'
  | 'grants:edit'
  | 'grants:delete'
  // Tags permissions
  | 'tags:view'
  | 'tags:edit'
  | 'tags:delete'
  // Custom groups permissions
  | 'groups:view'
  | 'groups:create_public'
  | 'groups:edit_all'
  | 'groups:delete_all'
  // Lab settings permissions
  | 'settings:view'
  | 'settings:edit'
  // Member management permissions
  | 'members:view'
  | 'members:invite'
  | 'members:edit_roles'
  | 'members:remove'
  // Reservation/machine permissions
  | 'reservations:view'
  | 'reservations:create'
  | 'reservations:edit'
  | 'reservations:delete'
  | 'machines:manage';

/**
 * Permission grouped by resource for UI display
 */
export interface PermissionsByResource {
  inventory: Permission[];
  orders: Permission[];
  grants: Permission[];
  tags: Permission[];
  groups: Permission[];
  settings: Permission[];
  members: Permission[];
  reservations: Permission[];
}

/**
 * Human-readable permission labels for UI
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  'inventory:view': 'View inventory items',
  'inventory:edit': 'Edit inventory items',
  'inventory:delete': 'Delete inventory items',
  'inventory:export': 'Export inventory to Excel',
  'orders:view': 'View order requests',
  'orders:create': 'Create order requests',
  'orders:edit': 'Edit order requests',
  'orders:approve': 'Approve/reject orders',
  'orders:delete': 'Delete order requests',
  'grants:view': 'View grants',
  'grants:edit': 'Edit grants',
  'grants:delete': 'Delete grants',
  'tags:view': 'View tags',
  'tags:edit': 'Edit tags',
  'tags:delete': 'Delete tags',
  'groups:view': 'View saved searches',
  'groups:create_public': 'Create public saved searches',
  'groups:edit_all': 'Edit all saved searches',
  'groups:delete_all': 'Delete any saved search',
  'settings:view': 'View lab settings',
  'settings:edit': 'Edit lab settings',
  'members:view': 'View lab members',
  'members:invite': 'Invite new members',
  'members:edit_roles': 'Change member roles',
  'members:remove': 'Remove members from lab',
  'reservations:view': 'View reservations and machines',
  'reservations:create': 'Create reservations',
  'reservations:edit': 'Edit reservations',
  'reservations:delete': 'Delete/cancel reservations',
  'machines:manage': 'Create and manage machines',
};

// ============================================================================
// Role Types
// ============================================================================

/**
 * Default role types for new labs
 */
export type DefaultRoleType = 'viewer' | 'member' | 'manager' | 'admin';

/**
 * A role defines a set of permissions that can be assigned to users
 */
export interface Role {
  _id: string;
  labId: string;
  name: string;
  description?: string;
  isDefault: boolean;         // System-provided default role (cannot be deleted)
  defaultRoleType?: DefaultRoleType; // Type of default role
  isAdmin: boolean;           // Has all permissions (bypasses permission checks)
  permissions: Permission[];  // List of granted permissions
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating a new custom role
 */
export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: Permission[];
}

/**
 * Request payload for updating a role
 */
export interface UpdateRoleRequest {
  roleId: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

/**
 * Request payload for deleting a role
 */
export interface DeleteRoleRequest {
  roleId: string;
}

// ============================================================================
// Membership Types
// ============================================================================

/**
 * Status of a lab membership
 */
export type MembershipStatus = 'active' | 'pending' | 'suspended';

/**
 * A lab membership connects a user to a lab with a specific role
 */
export interface LabMembership {
  _id: string;
  userId: string;
  labId: string;
  roleId: string;
  displayRole: string;        // Display title (PhD Student, Postdoc, etc.)
  status: MembershipStatus;
  invitedBy?: string;
  invitedAt?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Enriched membership with role details
 */
export interface EnrichedMembership extends LabMembership {
  roleName: string;
  isAdmin: boolean;
}

/**
 * Request payload for updating a member's role
 */
export interface UpdateMemberRoleRequest {
  membershipId: string;
  roleId: string;
  displayRole?: string;
}

/**
 * Request payload for removing a member
 */
export interface RemoveMemberRequest {
  membershipId: string;
}

// ============================================================================
// Invitation Types
// ============================================================================

/**
 * Status of an invitation
 */
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'canceled';

/**
 * An invitation for a user to join a lab
 */
export interface Invitation {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  labId: string;
  roleId: string;
  displayRole: string;
  invitedBy: string;
  inviteCode: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

/**
 * Enriched invitation with role name
 */
export interface EnrichedInvitation extends Invitation {
  roleName: string;
  isValid: boolean;
}

/**
 * Invitation details returned for the signup flow
 */
export interface InvitationDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  labId: string;
  labName: string;
  roleId: string;
  roleName: string;
  displayRole: string;
  invitedBy: string;
  inviterName: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  isValid: boolean;
}

/**
 * Request payload for creating an invitation
 */
export interface CreateInvitationRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  roleId: string;
  displayRole: string;
}

/**
 * Request payload for canceling an invitation
 */
export interface CancelInvitationRequest {
  invitationId: string;
}

/**
 * Request payload for claiming an invitation
 */
export interface ClaimInvitationRequest {
  inviteCode: string;
}

/**
 * Response from creating an invitation
 */
export interface CreateInvitationResponse {
  invitation: Invitation;
  inviteCode: string;
  inviteLink: string;
}

// ============================================================================
// Current User Role Response
// ============================================================================

/**
 * Response from the get-current-user-role endpoint
 */
export interface CurrentUserRoleResponse {
  hasMembership: boolean;
  role?: Role;
  membership?: LabMembership;
  isAdmin?: boolean;
  permissions?: Permission[];
  message?: string;
}

/**
 * Response from the initialize-lab-with-admin endpoint
 */
export interface InitializeLabWithAdminResponse {
  message: string;
  roles: Role[];
  membership: LabMembership;
}

/**
 * Response from the create-self-membership endpoint
 */
export interface CreateSelfMembershipResponse {
  message: string;
  membership: LabMembership;
}

// ============================================================================
// Display Role Options
// ============================================================================

/**
 * Available display role (title) options
 */
export const DISPLAY_ROLE_OPTIONS = [
  'Principal Investigator (PI)',
  'Associate Professor',
  'Assistant Professor',
  'Postdoc',
  'PhD Student',
  "Master's Student",
  'Undergraduate Researcher',
  'Lab Manager',
  'Research Scientist',
  'Visiting Scholar',
  'Technician',
  'Research Assistant',
  'Other',
] as const;

export type DisplayRole = typeof DISPLAY_ROLE_OPTIONS[number];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  if (role.isAdmin) return true;
  return role.permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  if (role.isAdmin) return true;
  return permissions.some(p => role.permissions.includes(p));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  if (role.isAdmin) return true;
  return permissions.every(p => role.permissions.includes(p));
}
