"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvitations = getInvitations;
exports.createInvitation = createInvitation;
exports.cancelInvitation = cancelInvitation;
exports.resendInvitation = resendInvitation;
exports.getInvitationByCode = getInvitationByCode;
exports.claimInvitation = claimInvitation;
const responseValidation_1 = require("../../responseValidation");
/**
 * Get all invitations for the current lab
 */
async function getInvitations(client, includeExpired = false) {
    const res = await client.request({
        method: 'GET',
        path: '/get-invitations',
        query: includeExpired ? { includeExpired: 'true' } : undefined,
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'getInvitations').map(responseValidation_1.normalizeMongoId);
}
/**
 * Create a new invitation
 */
async function createInvitation(client, data) {
    return client.request({
        method: 'POST',
        path: '/create-invitation',
        body: data,
    });
}
/**
 * Cancel a pending invitation
 */
async function cancelInvitation(client, data) {
    return client.request({
        method: 'POST',
        path: '/cancel-invitation',
        body: data,
    });
}
/**
 * Resend an invitation email
 */
async function resendInvitation(client, invitationId) {
    return client.request({
        method: 'POST',
        path: '/resend-invitation',
        body: { invitationId },
    });
}
/**
 * Get invitation details by code (PUBLIC - no auth required)
 * This is used during the signup flow to show invitation details
 */
async function getInvitationByCode(client, code) {
    return client.request({
        method: 'GET',
        path: '/get-invitation-by-code',
        query: { code },
    });
}
/**
 * Claim an invitation (creates membership)
 * User must be authenticated
 */
async function claimInvitation(client, data) {
    return client.request({
        method: 'POST',
        path: '/claim-invitation',
        body: data,
    });
}
//# sourceMappingURL=invitations.js.map