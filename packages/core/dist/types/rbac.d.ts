/**
 * RBAC (Role-Based Access Control) Types
 *
 * These types define the permission model for Labshare, including:
 * - Roles with granular permissions
 * - Lab memberships connecting users to labs with roles
 * - Invitations for adding new users
 */
/**
 * All available permissions in the system.
 * Format: "resource:action"
 */
export type Permission = 'inventory:view' | 'inventory:edit' | 'inventory:delete' | 'inventory:export' | 'orders:view' | 'orders:create' | 'orders:edit' | 'orders:approve' | 'orders:delete' | 'grants:view' | 'grants:edit' | 'grants:delete' | 'tags:view' | 'tags:edit' | 'tags:delete' | 'groups:view' | 'groups:create_public' | 'groups:edit_all' | 'groups:delete_all' | 'settings:view' | 'settings:edit' | 'members:view' | 'members:invite' | 'members:edit_roles' | 'members:remove';
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
}
/**
 * Human-readable permission labels for UI
 */
export declare const PERMISSION_LABELS: Record<Permission, string>;
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
    isDefault: boolean;
    defaultRoleType?: DefaultRoleType;
    isAdmin: boolean;
    permissions: Permission[];
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
    displayRole: string;
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
    firstName?: string;
    lastName?: string;
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
    firstName?: string;
    lastName?: string;
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
/**
 * Available display role (title) options
 */
export declare const DISPLAY_ROLE_OPTIONS: readonly ["Principal Investigator (PI)", "Associate Professor", "Assistant Professor", "Postdoc", "PhD Student", "Master's Student", "Undergraduate Researcher", "Lab Manager", "Research Scientist", "Visiting Scholar", "Technician", "Research Assistant", "Other"];
export type DisplayRole = typeof DISPLAY_ROLE_OPTIONS[number];
/**
 * Check if a role has a specific permission
 */
export declare function hasPermission(role: Role, permission: Permission): boolean;
/**
 * Check if a role has any of the specified permissions
 */
export declare function hasAnyPermission(role: Role, permissions: Permission[]): boolean;
/**
 * Check if a role has all of the specified permissions
 */
export declare function hasAllPermissions(role: Role, permissions: Permission[]): boolean;
//# sourceMappingURL=rbac.d.ts.map