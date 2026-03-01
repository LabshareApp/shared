/**
 * Auth endpoints for user registration.
 * These endpoints don't require authentication since they're used before the user has a token.
 */
export interface RegisterUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
    labId?: string;
    labName?: string;
    labInstitution?: string;
    labDepartment?: string;
    labCountry?: string;
}
export interface RegisterUserResponse {
    userId: string;
    labId: string;
    email: string;
}
/**
 * Register a new user with atomic rollback.
 * This endpoint creates the auth user, profile, and optionally a new lab.
 * If any step fails, all previous steps are rolled back.
 *
 * @param baseUrl - The base URL of the API server (e.g., 'http://localhost:8082')
 * @param data - The registration data
 * @returns The registration response with userId, labId, and email
 */
export declare function registerUser(baseUrl: string, data: RegisterUserRequest): Promise<RegisterUserResponse>;
/**
 * Request for institution-only user registration (no lab)
 */
export interface RegisterInstitutionUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    institutionCode: string;
}
/**
 * Response from institution-only registration
 */
export interface RegisterInstitutionUserResponse {
    userId: string;
    institutionId: string;
    email: string;
    status: 'active' | 'pending';
    isFirstAdmin: boolean;
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
export declare function registerInstitutionUser(baseUrl: string, data: RegisterInstitutionUserRequest): Promise<RegisterInstitutionUserResponse>;
/**
 * Request for invitation-based user registration
 */
export interface RegisterWithInvitationRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    inviteCode: string;
}
/**
 * Response from invitation-based registration
 */
export interface RegisterWithInvitationResponse {
    userId: string;
    labId: string;
    email: string;
    message: string;
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
export declare function registerWithInvitation(baseUrl: string, data: RegisterWithInvitationRequest): Promise<RegisterWithInvitationResponse>;
/**
 * Request for institution-invitation-based user registration
 */
export interface RegisterWithInstitutionInvitationRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    inviteCode: string;
}
/**
 * Response from institution-invitation-based registration
 */
export interface RegisterWithInstitutionInvitationResponse {
    userId: string;
    institutionId: string;
    email: string;
    message: string;
}
/**
 * Register a new user via institution invitation.
 * Creates the auth user (email auto-confirmed), profile (no lab, signup_complete: true),
 * institution membership with the invitation's role, assigns departments,
 * and marks the invitation as accepted — all atomically.
 *
 * @param baseUrl - The base URL of the API server
 * @param data - The registration data including invite code
 * @returns The registration response with userId and institutionId
 */
export declare function registerWithInstitutionInvitation(baseUrl: string, data: RegisterWithInstitutionInvitationRequest): Promise<RegisterWithInstitutionInvitationResponse>;
/**
 * User info for display purposes
 */
export interface UserNameInfo {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}
/**
 * Response from user lookup
 */
export interface LookupUsersResponse {
    users: UserNameInfo[];
}
/**
 * Look up user names by IDs.
 * This is used for displaying user names in the UI (e.g., "Uploaded By" column).
 *
 * @param client - The API client
 * @param userIds - Array of user IDs to look up
 * @returns Array of user info objects
 */
export declare function lookupUsers(client: import('../ApiClient').ApiClient, userIds: string[]): Promise<UserNameInfo[]>;
/**
 * Request to complete OAuth signup (user already authenticated via OAuth)
 */
export interface CompleteOAuthSignupRequest {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
    labId?: string;
    labName?: string;
    labDepartment?: string;
    labCountry?: string;
    institutionCodes?: string[];
}
/**
 * Response from completing OAuth signup
 */
export interface CompleteOAuthSignupResponse {
    userId: string;
    labId: string;
    email: string;
    institutionIds?: string[];
    pendingInstitutionIds?: string[];
    hasPendingInstitutions?: boolean;
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
export declare function completeOAuthSignup(baseUrl: string, token: string, data: CompleteOAuthSignupRequest): Promise<CompleteOAuthSignupResponse>;
/**
 * Request to complete OAuth signup as institution-only user
 */
export interface CompleteOAuthInstitutionSignupRequest {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    institutionCode: string;
}
/**
 * Response from completing OAuth institution signup
 */
export interface CompleteOAuthInstitutionSignupResponse {
    userId: string;
    institutionId: string;
    email: string;
    status: 'active' | 'pending';
    isFirstAdmin: boolean;
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
export declare function completeOAuthInstitutionSignup(baseUrl: string, token: string, data: CompleteOAuthInstitutionSignupRequest): Promise<CompleteOAuthInstitutionSignupResponse>;
//# sourceMappingURL=auth.d.ts.map