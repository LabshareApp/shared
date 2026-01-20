"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabMemberships = getLabMemberships;
exports.updateMemberRole = updateMemberRole;
exports.removeMember = removeMember;
const responseValidation_1 = require("../../responseValidation");
/**
 * Get all lab memberships with enriched role information
 */
async function getLabMemberships(client) {
    const res = await client.request({
        method: 'GET',
        path: '/get-lab-memberships',
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'getLabMemberships');
}
/**
 * Update a member's role
 */
async function updateMemberRole(client, data) {
    return client.request({
        method: 'PUT',
        path: '/update-member-role',
        body: data,
    });
}
/**
 * Remove a member from the lab
 */
async function removeMember(client, data) {
    return client.request({
        method: 'POST',
        path: '/remove-member',
        body: data,
    });
}
//# sourceMappingURL=members.js.map