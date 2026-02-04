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
exports.hasInstitutionPermission = hasInstitutionPermission;
exports.isInstitutionAdmin = isInstitutionAdmin;
exports.isDepartmentHead = isDepartmentHead;
exports.canApproveOrders = canApproveOrders;
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
    return hasInstitutionPermission(membership, role, 'department:approve_orders');
}
//# sourceMappingURL=institution.js.map