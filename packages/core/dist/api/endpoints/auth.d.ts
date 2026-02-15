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
    labBuilding?: string;
    labFloorNumber?: string;
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
//# sourceMappingURL=auth.d.ts.map