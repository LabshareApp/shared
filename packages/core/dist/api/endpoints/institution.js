"use strict";
/**
 * Institution Management API Endpoints
 *
 * Provides API client functions for institution management operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserInstitutions = listUserInstitutions;
exports.listPendingInstitutions = listPendingInstitutions;
exports.getInstitution = getInstitution;
exports.getInstitutionByCode = getInstitutionByCode;
exports.getInstitutionLabs = getInstitutionLabs;
exports.getInstitutionMembers = getInstitutionMembers;
exports.getMyInstitutionMembership = getMyInstitutionMembership;
exports.getPendingMembers = getPendingMembers;
exports.approvePendingMember = approvePendingMember;
exports.rejectPendingMember = rejectPendingMember;
exports.listDepartments = listDepartments;
exports.createDepartment = createDepartment;
exports.updateDepartment = updateDepartment;
exports.deleteDepartment = deleteDepartment;
exports.addLabToDepartment = addLabToDepartment;
exports.removeLabFromDepartment = removeLabFromDepartment;
exports.listInstitutionCollaborations = listInstitutionCollaborations;
exports.requestInstitutionCollaboration = requestInstitutionCollaboration;
exports.approveInstitutionCollaboration = approveInstitutionCollaboration;
exports.rejectInstitutionCollaboration = rejectInstitutionCollaboration;
exports.registerUserWithInstitutions = registerUserWithInstitutions;
exports.validateInstitutionCodes = validateInstitutionCodes;
exports.getCollaborationHistory = getCollaborationHistory;
exports.searchInstitutionOrderRequests = searchInstitutionOrderRequests;
exports.searchInstitutionInventory = searchInstitutionInventory;
exports.joinLab = joinLab;
exports.getInstitutionRoles = getInstitutionRoles;
exports.getInstitutionAvailablePermissions = getInstitutionAvailablePermissions;
exports.createInstitutionRole = createInstitutionRole;
exports.updateInstitutionRole = updateInstitutionRole;
exports.deleteInstitutionRole = deleteInstitutionRole;
exports.updateInstitutionProfile = updateInstitutionProfile;
exports.updateInstitutionMemberRole = updateInstitutionMemberRole;
exports.createInstitutionInvitation = createInstitutionInvitation;
exports.listInstitutionInvitations = listInstitutionInvitations;
exports.cancelInstitutionInvitation = cancelInstitutionInvitation;
exports.resendInstitutionInvitation = resendInstitutionInvitation;
exports.getInstitutionInvitationByCode = getInstitutionInvitationByCode;
exports.claimInstitutionInvitation = claimInstitutionInvitation;
// --- Institution Endpoints ---
/**
 * Get all institutions the current user belongs to
 */
async function listUserInstitutions(client) {
    const request = {
        method: 'GET',
        path: '/institutions',
    };
    return client.request(request);
}
/**
 * Get institutions where user has pending membership
 */
async function listPendingInstitutions(client) {
    const request = {
        method: 'GET',
        path: '/institutions/pending',
    };
    return client.request(request);
}
/**
 * Get a single institution by ID
 */
async function getInstitution(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution',
        query: { id: institutionId },
    };
    return client.request(request);
}
/**
 * Get institution by code (public endpoint for sign-up)
 * This is a standalone function that doesn't require authentication.
 */
async function getInstitutionByCode(baseUrl, code) {
    const response = await fetch(`${baseUrl}/repository/institution/by-code?code=${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to get institution: ${response.status}`);
    }
    return response.json();
}
/**
 * Get all labs belonging to an institution
 */
async function getInstitutionLabs(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/labs',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Get all members of an institution (admin only)
 */
async function getInstitutionMembers(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/members',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Get the current user's membership for an institution
 */
async function getMyInstitutionMembership(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/my-membership',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Get pending members awaiting approval (admin only)
 */
async function getPendingMembers(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/pending-members',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Approve a pending institution member (admin only)
 */
async function approvePendingMember(client, institutionId, data) {
    const request = {
        method: 'POST',
        path: '/institution/approve-member',
        query: { institutionId },
        body: data,
    };
    return client.request(request);
}
/**
 * Reject a pending institution member (admin only)
 */
async function rejectPendingMember(client, institutionId, data) {
    const request = {
        method: 'POST',
        path: '/institution/reject-member',
        query: { institutionId },
        body: data,
    };
    return client.request(request);
}
// --- Department Endpoints ---
/**
 * Get all departments for an institution
 */
async function listDepartments(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/departments',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Create a new department (admin only)
 */
async function createDepartment(client, data) {
    const request = {
        method: 'POST',
        path: '/create-department',
        body: data,
    };
    return client.request(request);
}
/**
 * Update a department (admin only)
 */
async function updateDepartment(client, departmentId, data) {
    const request = {
        method: 'PUT',
        path: '/update-department',
        query: { id: departmentId },
        body: data,
    };
    return client.request(request);
}
/**
 * Delete a department (admin only)
 */
async function deleteDepartment(client, departmentId) {
    const request = {
        method: 'DELETE',
        path: '/delete-department',
        query: { id: departmentId },
    };
    return client.request(request);
}
/**
 * Add a lab to a department (admin only)
 */
async function addLabToDepartment(client, data) {
    const request = {
        method: 'POST',
        path: '/department/add-lab',
        body: data,
    };
    return client.request(request);
}
/**
 * Remove a lab from a department (admin only)
 */
async function removeLabFromDepartment(client, data) {
    const request = {
        method: 'POST',
        path: '/department/remove-lab',
        body: data,
    };
    return client.request(request);
}
// --- Collaboration Endpoints ---
/**
 * Get all collaborations for an institution
 */
async function listInstitutionCollaborations(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/collaborations',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Request a collaboration with another institution (admin only)
 */
async function requestInstitutionCollaboration(client, institutionId, data) {
    const request = {
        method: 'POST',
        path: '/institution/request-collaboration',
        query: { institutionId },
        body: data,
    };
    return client.request(request);
}
/**
 * Approve a collaboration request (admin only)
 */
async function approveInstitutionCollaboration(client, institutionId, data) {
    const request = {
        method: 'POST',
        path: '/institution/approve-collaboration',
        query: { institutionId },
        body: data,
    };
    return client.request(request);
}
/**
 * Reject a collaboration request (admin only)
 */
async function rejectInstitutionCollaboration(client, institutionId, data) {
    const request = {
        method: 'POST',
        path: '/institution/reject-collaboration',
        query: { institutionId },
        body: data,
    };
    return client.request(request);
}
/**
 * Register a new user with institution codes.
 * This endpoint creates the auth user, profile, lab, and institution memberships.
 * If any step fails, all previous steps are rolled back.
 *
 * @param baseUrl - The base URL of the API server (e.g., 'http://localhost:8082')
 * @param data - The registration data including institution codes
 * @returns The registration response with userId, labId, email, and institutionIds
 */
async function registerUserWithInstitutions(baseUrl, data) {
    const response = await fetch(`${baseUrl}/repository/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Registration failed with status ${response.status}`);
    }
    return response.json();
}
/**
 * Validate institution codes before registration
 * Returns an array of institution public info for each valid code
 */
async function validateInstitutionCodes(baseUrl, codes) {
    const results = [];
    for (const code of codes) {
        try {
            const institution = await getInstitutionByCode(baseUrl, code);
            results.push(institution);
        }
        catch (error) {
            throw new Error(`Invalid institution code: ${code}`);
        }
    }
    return results;
}
// --- Institution Admin Dashboard Endpoints ---
/**
 * Get collaboration history with statistics (admin only)
 */
async function getCollaborationHistory(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/collaboration-history',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Search order requests across all institution labs (admin only)
 */
async function searchInstitutionOrderRequests(client, institutionId, params) {
    var _a, _b;
    const request = {
        method: 'POST',
        path: '/institution/search-requests',
        query: { institutionId },
        body: {
            view: params.view,
            labIds: params.labIds,
            query: params.query,
            page: (_a = params.page) !== null && _a !== void 0 ? _a : 1,
            limit: (_b = params.limit) !== null && _b !== void 0 ? _b : 50,
        },
    };
    return client.request(request);
}
/**
 * Search inventory across all institution labs (admin only)
 */
async function searchInstitutionInventory(client, institutionId, params) {
    var _a, _b;
    const request = {
        method: 'POST',
        path: '/institution/search-inventory',
        query: { institutionId },
        body: {
            labIds: params.labIds,
            query: params.query,
            page: (_a = params.page) !== null && _a !== void 0 ? _a : 1,
            limit: (_b = params.limit) !== null && _b !== void 0 ? _b : 50,
        },
    };
    return client.request(request);
}
/**
 * Join an existing lab (for institution-only users)
 */
async function joinLab(client, data) {
    const request = {
        method: 'POST',
        path: '/join-lab',
        body: data,
    };
    return client.request(request);
}
// --- Institution Role CRUD ---
/**
 * Get all roles for an institution
 */
async function getInstitutionRoles(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/roles',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Get available institution permissions grouped by resource
 */
async function getInstitutionAvailablePermissions(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/available-permissions',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Create a custom institution role (admin only)
 */
async function createInstitutionRole(client, data) {
    const request = {
        method: 'POST',
        path: '/institution/create-role',
        body: data,
    };
    return client.request(request);
}
/**
 * Update an institution role (admin only)
 */
async function updateInstitutionRole(client, data) {
    const request = {
        method: 'PUT',
        path: '/institution/update-role',
        body: data,
    };
    return client.request(request);
}
/**
 * Delete an institution role (admin only, non-default only)
 */
async function deleteInstitutionRole(client, data) {
    const request = {
        method: 'POST',
        path: '/institution/delete-role',
        body: data,
    };
    return client.request(request);
}
/**
 * Update institution profile (admin only)
 */
async function updateInstitutionProfile(client, institutionId, data) {
    const request = {
        method: 'PUT',
        path: '/institution/update-profile',
        query: { institutionId },
        body: data,
    };
    return client.request(request);
}
// --- Institution Member Role Update ---
/**
 * Update an institution member's role (admin only)
 */
async function updateInstitutionMemberRole(client, data) {
    const request = {
        method: 'POST',
        path: '/institution/update-member-role',
        body: data,
    };
    return client.request(request);
}
// --- Institution Invitations ---
/**
 * Create an institution invitation (admin only)
 */
async function createInstitutionInvitation(client, data) {
    const request = {
        method: 'POST',
        path: '/institution/create-invitation',
        body: data,
    };
    return client.request(request);
}
/**
 * List institution invitations (admin only)
 */
async function listInstitutionInvitations(client, institutionId) {
    const request = {
        method: 'GET',
        path: '/institution/invitations',
        query: { institutionId },
    };
    return client.request(request);
}
/**
 * Cancel an institution invitation (admin only)
 */
async function cancelInstitutionInvitation(client, data) {
    const request = {
        method: 'POST',
        path: '/institution/cancel-invitation',
        body: data,
    };
    return client.request(request);
}
/**
 * Resend an institution invitation email (admin only)
 */
async function resendInstitutionInvitation(client, data) {
    const request = {
        method: 'POST',
        path: '/institution/resend-invitation',
        body: data,
    };
    return client.request(request);
}
/**
 * Get institution invitation details by code (PUBLIC - for signup flow)
 */
async function getInstitutionInvitationByCode(baseUrl, code) {
    const response = await fetch(`${baseUrl}/repository/institution-invitation-by-code?code=${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to get invitation: ${response.status}`);
    }
    return response.json();
}
/**
 * Claim an institution invitation (creates membership)
 */
async function claimInstitutionInvitation(client, data) {
    const request = {
        method: 'POST',
        path: '/institution/claim-invitation',
        body: data,
    };
    return client.request(request);
}
//# sourceMappingURL=institution.js.map