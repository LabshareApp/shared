/**
 * Query keys for RBAC (Role-Based Access Control)
 */

export const rbacKeys = {
  all: ['rbac'] as const,

  // Roles
  roles: () => [...rbacKeys.all, 'roles'] as const,
  rolesList: (labId: string | null) => [...rbacKeys.roles(), 'list', labId] as const,

  // Memberships
  memberships: () => [...rbacKeys.all, 'memberships'] as const,
  membershipsList: (labId: string | null) => [...rbacKeys.memberships(), 'list', labId] as const,

  // Invitations
  invitations: () => [...rbacKeys.all, 'invitations'] as const,
  invitationsList: (labId: string | null, includeExpired: boolean) =>
    [...rbacKeys.invitations(), 'list', labId, includeExpired] as const,
  invitationByCode: (code: string | null) =>
    [...rbacKeys.invitations(), 'byCode', code] as const,

  // Current user
  currentUserRole: (labId: string | null) =>
    [...rbacKeys.all, 'currentUser', labId] as const,

  // Permissions
  availablePermissions: () => [...rbacKeys.all, 'permissions'] as const,
  displayRoleOptions: () => [...rbacKeys.all, 'displayRoleOptions'] as const,
};

// Convenience exports for individual keys
export const rolesList = rbacKeys.rolesList;
export const membershipsList = rbacKeys.membershipsList;
export const invitationsList = rbacKeys.invitationsList;
export const invitationByCode = rbacKeys.invitationByCode;
export const currentUserRole = rbacKeys.currentUserRole;
export const availablePermissions = rbacKeys.availablePermissions;
export const displayRoleOptions = rbacKeys.displayRoleOptions;
