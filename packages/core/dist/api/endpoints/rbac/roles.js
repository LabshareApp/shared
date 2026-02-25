"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = getRoles;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
exports.getAvailablePermissions = getAvailablePermissions;
exports.getDisplayRoleOptions = getDisplayRoleOptions;
exports.getCurrentUserRole = getCurrentUserRole;
exports.initializeLabRoles = initializeLabRoles;
exports.initializeLabWithAdmin = initializeLabWithAdmin;
exports.createSelfMembership = createSelfMembership;
const responseValidation_1 = require("../../responseValidation");
/**
 * Get all roles for the current lab
 */
async function getRoles(client) {
    const res = await client.request({
        method: 'GET',
        path: '/get-roles',
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'getRoles').map(responseValidation_1.normalizeMongoId);
}
/**
 * Create a new custom role
 */
async function createRole(client, data) {
    return client.request({
        method: 'POST',
        path: '/create-role',
        body: data,
    });
}
/**
 * Update an existing role
 */
async function updateRole(client, data) {
    return client.request({
        method: 'PUT',
        path: '/update-role',
        body: data,
    });
}
/**
 * Delete a custom role
 */
async function deleteRole(client, data) {
    return client.request({
        method: 'POST',
        path: '/delete-role',
        body: data,
    });
}
/**
 * Get all available permissions grouped by resource
 */
async function getAvailablePermissions(client) {
    return client.request({
        method: 'GET',
        path: '/get-available-permissions',
    });
}
/**
 * Get available display role (title) options
 */
async function getDisplayRoleOptions(client) {
    return client.request({
        method: 'GET',
        path: '/get-display-role-options',
    });
}
/**
 * Get the current user's role and permissions for the lab
 */
async function getCurrentUserRole(client) {
    return client.request({
        method: 'GET',
        path: '/get-current-user-role',
    });
}
/**
 * Initialize default roles for a lab (called during lab setup)
 */
async function initializeLabRoles(client) {
    const res = await client.request({
        method: 'POST',
        path: '/initialize-lab-roles',
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'initializeLabRoles');
}
/**
 * Initialize a lab with default roles AND create an Admin membership for the caller.
 * This should be called after a user creates a new lab (setupLab flow).
 */
async function initializeLabWithAdmin(client) {
    return client.request({
        method: 'POST',
        path: '/initialize-lab-with-admin',
    });
}
/**
 * Create a default Member membership for the calling user.
 * This should be called when a user joins an existing lab via lab code (joinLab flow).
 */
async function createSelfMembership(client) {
    return client.request({
        method: 'POST',
        path: '/create-self-membership',
    });
}
//# sourceMappingURL=roles.js.map