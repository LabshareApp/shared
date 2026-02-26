"use strict";
/**
 * Auth endpoints for user registration.
 * These endpoints don't require authentication since they're used before the user has a token.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.registerInstitutionUser = registerInstitutionUser;
exports.registerWithInvitation = registerWithInvitation;
exports.lookupUsers = lookupUsers;
exports.completeOAuthSignup = completeOAuthSignup;
exports.completeOAuthInstitutionSignup = completeOAuthInstitutionSignup;
/**
 * Register a new user with atomic rollback.
 * This endpoint creates the auth user, profile, and optionally a new lab.
 * If any step fails, all previous steps are rolled back.
 *
 * @param baseUrl - The base URL of the API server (e.g., 'http://localhost:8082')
 * @param data - The registration data
 * @returns The registration response with userId, labId, and email
 */
async function registerUser(baseUrl, data) {
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
 * Register a new institution-only user (no lab).
 * Creates the auth user, profile, and institution membership.
 * If the user is the first to use an institution code, they become admin.
 *
 * @param baseUrl - The base URL of the API server
 * @param data - The registration data
 * @returns The registration response
 */
async function registerInstitutionUser(baseUrl, data) {
    const response = await fetch(`${baseUrl}/repository/register-institution-user`, {
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
 * Register a new user via invitation.
 * Creates the auth user (email auto-confirmed), profile with lab_id,
 * and lab membership with the invitation's role. Marks the invitation as accepted.
 *
 * @param baseUrl - The base URL of the API server
 * @param data - The registration data including invite code
 * @returns The registration response with userId and labId
 */
async function registerWithInvitation(baseUrl, data) {
    const response = await fetch(`${baseUrl}/repository/register-with-invitation`, {
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
 * Look up user names by IDs.
 * This is used for displaying user names in the UI (e.g., "Uploaded By" column).
 *
 * @param client - The API client
 * @param userIds - Array of user IDs to look up
 * @returns Array of user info objects
 */
async function lookupUsers(client, userIds) {
    if (!userIds || userIds.length === 0) {
        return [];
    }
    // Filter out empty strings and deduplicate
    const uniqueIds = [...new Set(userIds.filter(id => id && id.trim() !== ''))];
    if (uniqueIds.length === 0) {
        return [];
    }
    const response = await client.request({
        method: 'POST',
        path: '/lookup-users',
        body: { userIds: uniqueIds },
    });
    return response.users;
}
/**
 * Complete OAuth signup for a user who authenticated via OAuth.
 * The user is already authenticated - this creates their profile and lab.
 * Requires a valid JWT token in the Authorization header.
 *
 * @param baseUrl - The base URL of the API server
 * @param token - JWT access token
 * @param data - Profile and lab data
 * @returns The completion response
 */
async function completeOAuthSignup(baseUrl, token, data) {
    const response = await fetch(`${baseUrl}/repository/complete-oauth-signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `OAuth signup completion failed with status ${response.status}`);
    }
    return response.json();
}
/**
 * Complete OAuth signup for an institution-only user.
 * Requires a valid JWT token in the Authorization header.
 *
 * @param baseUrl - The base URL of the API server
 * @param token - JWT access token
 * @param data - Profile and institution data
 * @returns The completion response
 */
async function completeOAuthInstitutionSignup(baseUrl, token, data) {
    const response = await fetch(`${baseUrl}/repository/complete-oauth-institution-signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `OAuth signup completion failed with status ${response.status}`);
    }
    return response.json();
}
//# sourceMappingURL=auth.js.map