"use strict";
/**
 * Institution Management Types
 *
 * Represents the hierarchical institution management system where:
 * - Institutions contain departments (optional) and labs
 * - Labs can belong to multiple institutions
 * - Users can be in multiple labs with different roles
 * - Institution admins have view-only access to all labs
 * - Department heads can edit orders and configure approval flows
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSTITUTION_PERMISSION_LABELS = void 0;
exports.hasInstitutionPermission = hasInstitutionPermission;
exports.getAggregatedPermissions = getAggregatedPermissions;
exports.isInstitutionAdmin = isInstitutionAdmin;
exports.isDepartmentHead = isDepartmentHead;
exports.canApproveOrders = canApproveOrders;
/**
 * Human-readable labels for institution permissions
 */
exports.INSTITUTION_PERMISSION_LABELS = {
    'institution:view': 'View Institution',
    'institution:edit': 'Edit Institution Settings',
    'institution:admin': 'Institution Admin',
    'members:view': 'View Members',
    'members:invite': 'Invite Members',
    'members:edit_roles': 'Edit Member Roles',
    'members:remove': 'Remove Members',
    'department:view': 'View Departments',
    'department:admin': 'Manage Departments',
    'department:approve_orders': 'Approve Department Orders',
    'inventory:view': 'View Inventory',
    'orders:view': 'View Orders',
    'orders:approve': 'Approve Orders',
    'sharing:view': 'View Sharing History',
};
/**
 * Permission check for institution-level operations.
 * Supports multi-role: checks if ANY of the user's roles has the permission.
 */
function hasInstitutionPermission(membership, role, permission, roles) {
    if (!membership) {
        return false;
    }
    if (membership.status !== 'active') {
        return false;
    }
    // Multi-role: check all roles
    if (roles && roles.length > 0) {
        return roles.some(r => r.permissions.includes(permission));
    }
    // Fallback: single role
    if (!role) {
        return false;
    }
    return role.permissions.includes(permission);
}
/**
 * Get aggregated permissions from all roles.
 */
function getAggregatedPermissions(roles) {
    const perms = new Set();
    for (const role of roles) {
        for (const p of role.permissions) {
            perms.add(p);
        }
    }
    return perms;
}
/**
 * Check if user is institution admin (any of their roles)
 */
function isInstitutionAdmin(membership, role, roles) {
    if (roles && roles.length > 0) {
        return roles.some(r => r.name === 'institution_admin');
    }
    return hasInstitutionPermission(membership, role, 'institution:admin');
}
/**
 * Check if user is department head (any of their roles)
 */
function isDepartmentHead(membership, role, roles) {
    if (roles && roles.length > 0) {
        return roles.some(r => r.name === 'department_head');
    }
    return hasInstitutionPermission(membership, role, 'department:admin');
}
/**
 * Check if user can approve orders for a department
 */
function canApproveOrders(membership, role, roles) {
    return hasInstitutionPermission(membership, role, 'department:approve_orders', roles);
}
//# sourceMappingURL=institution.js.map