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
exports.isInstitutionAdmin = isInstitutionAdmin;
exports.isDepartmentHead = isDepartmentHead;
exports.canApproveOrders = canApproveOrders;
/**
 * Human-readable labels for institution permissions
 */
exports.INSTITUTION_PERMISSION_LABELS = {
    'institution:view': 'View Institution',
    'institution:edit': 'Edit Institution Settings',
    'institution:admin': 'Full Admin Access',
    'members:view': 'View Members',
    'members:invite': 'Invite Members',
    'members:edit_roles': 'Edit Member Roles',
    'members:remove': 'Remove Members',
    'department:view': 'View Departments',
    'department:admin': 'Manage Departments',
    'orders:view': 'View All Orders',
    'orders:approve': 'Approve Orders',
    'inventory:view': 'View All Inventory',
    'collaborations:view': 'View Collaborations',
    'collaborations:manage': 'Manage Collaborations',
    'sharing:view': 'View Sharing History',
};
/**
 * Permission check for institution-level operations
 */
function hasInstitutionPermission(membership, role, permission) {
    if (!membership || !role) {
        return false;
    }
    if (membership.status !== 'active') {
        return false;
    }
    return role.permissions.includes(permission);
}
/**
 * Check if user is institution admin
 */
function isInstitutionAdmin(membership, role) {
    return hasInstitutionPermission(membership, role, 'institution:admin');
}
/**
 * Check if user is department head
 */
function isDepartmentHead(membership, role) {
    return hasInstitutionPermission(membership, role, 'department:admin');
}
/**
 * Check if user can approve orders for a department
 */
function canApproveOrders(membership, role) {
    return hasInstitutionPermission(membership, role, 'orders:approve');
}
//# sourceMappingURL=institution.js.map