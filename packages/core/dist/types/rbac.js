"use strict";
/**
 * RBAC (Role-Based Access Control) Types
 *
 * These types define the permission model for Labshare, including:
 * - Roles with granular permissions
 * - Lab memberships connecting users to labs with roles
 * - Invitations for adding new users
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISPLAY_ROLE_OPTIONS = exports.PERMISSION_LABELS = void 0;
exports.hasPermission = hasPermission;
exports.hasAnyPermission = hasAnyPermission;
exports.hasAllPermissions = hasAllPermissions;
/**
 * Human-readable permission labels for UI
 */
exports.PERMISSION_LABELS = {
    'inventory:view': 'View inventory items',
    'inventory:edit': 'Edit inventory items',
    'inventory:delete': 'Delete inventory items',
    'inventory:export': 'Export inventory to Excel',
    'inventory:import': 'Import inventory from Excel',
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
    'tools:view': 'View lab tools',
    'tools:checkout': 'Checkout and return tools',
    'tools:manage': 'Create and manage tools',
    'sharing:view': 'View sharing requests',
    'sharing:create': 'Create sharing requests',
    'sharing:edit': 'Edit sharing requests',
    'sharing:approve': 'Approve/reject sharing requests',
    'invoices:view': 'View invoices',
    'invoices:create': 'Create invoices',
    'invoices:send': 'Send invoices',
    'invoices:delete': 'Delete invoices',
};
// ============================================================================
// Display Role Options
// ============================================================================
/**
 * Available display role (title) options
 */
exports.DISPLAY_ROLE_OPTIONS = [
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
];
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Check if a role has a specific permission
 */
function hasPermission(role, permission) {
    if (role.isAdmin)
        return true;
    return role.permissions.includes(permission);
}
/**
 * Check if a role has any of the specified permissions
 */
function hasAnyPermission(role, permissions) {
    if (role.isAdmin)
        return true;
    return permissions.some(p => role.permissions.includes(p));
}
/**
 * Check if a role has all of the specified permissions
 */
function hasAllPermissions(role, permissions) {
    if (role.isAdmin)
        return true;
    return permissions.every(p => role.permissions.includes(p));
}
//# sourceMappingURL=rbac.js.map