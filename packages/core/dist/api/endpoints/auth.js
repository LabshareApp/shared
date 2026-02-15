"use strict";
/**
 * Auth endpoints for user registration.
 * These endpoints don't require authentication since they're used before the user has a token.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.registerInstitutionUser = registerInstitutionUser;
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
 * Register a new institution-only user (without a lab).
 * First user with an institution code becomes admin with active status.
 * Subsequent users get observer role with pending status (require admin approval).
 *
 * @param baseUrl - The base URL of the API server (e.g., 'http://localhost:8082')
 * @param data - The registration data including institution code
 * @returns The registration response with userId, institutionId, status, and isFirstAdmin
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
        throw new Error(errorText || `Institution registration failed with status ${response.status}`);
    }
    return response.json();
}
//# sourceMappingURL=auth.js.map