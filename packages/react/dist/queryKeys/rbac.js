"use strict";
/**
 * Query keys for RBAC (Role-Based Access Control)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayRoleOptions = exports.availablePermissions = exports.currentUserRole = exports.invitationByCode = exports.invitationsList = exports.membershipsList = exports.rolesList = exports.rbacKeys = void 0;
exports.rbacKeys = {
    all: ['rbac'],
    // Roles
    roles: () => [...exports.rbacKeys.all, 'roles'],
    rolesList: (labId) => [...exports.rbacKeys.roles(), 'list', labId],
    // Memberships
    memberships: () => [...exports.rbacKeys.all, 'memberships'],
    membershipsList: (labId) => [...exports.rbacKeys.memberships(), 'list', labId],
    // Invitations
    invitations: () => [...exports.rbacKeys.all, 'invitations'],
    invitationsList: (labId, includeExpired) => [...exports.rbacKeys.invitations(), 'list', labId, includeExpired],
    invitationByCode: (code) => [...exports.rbacKeys.invitations(), 'byCode', code],
    // Current user
    currentUserRole: (labId) => [...exports.rbacKeys.all, 'currentUser', labId],
    // Permissions
    availablePermissions: () => [...exports.rbacKeys.all, 'permissions'],
    displayRoleOptions: () => [...exports.rbacKeys.all, 'displayRoleOptions'],
};
// Convenience exports for individual keys
exports.rolesList = exports.rbacKeys.rolesList;
exports.membershipsList = exports.rbacKeys.membershipsList;
exports.invitationsList = exports.rbacKeys.invitationsList;
exports.invitationByCode = exports.rbacKeys.invitationByCode;
exports.currentUserRole = exports.rbacKeys.currentUserRole;
exports.availablePermissions = exports.rbacKeys.availablePermissions;
exports.displayRoleOptions = exports.rbacKeys.displayRoleOptions;
//# sourceMappingURL=rbac.js.map