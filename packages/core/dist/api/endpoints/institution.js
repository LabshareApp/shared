"use strict";
/**
 * Institution Management API Endpoints
 *
 * Provides API client functions for institution management operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserInstitutions = listUserInstitutions;
exports.getInstitution = getInstitution;
exports.getInstitutionByCode = getInstitutionByCode;
exports.getInstitutionLabs = getInstitutionLabs;
exports.getInstitutionMembers = getInstitutionMembers;
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
//# sourceMappingURL=institution.js.map