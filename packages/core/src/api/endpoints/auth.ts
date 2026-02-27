/**
 * Auth endpoints for user registration.
 * These endpoints don't require authentication since they're used before the user has a token.
 */

export interface RegisterUserRequest {
  // User credentials
  email: string;
  password: string;

  // User profile data
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: string; // Display role (e.g., PhD Student)

  // Lab data - either provide existing labId OR new lab data
  labId?: string; // Existing lab ID (for joining)

  // New lab data (for creating new lab)
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
export async function registerUser(
  baseUrl: string,
  data: RegisterUserRequest
): Promise<RegisterUserResponse> {
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
 * Request for institution-only user registration (no lab)
 */
export interface RegisterInstitutionUserRequest {
  // User credentials
  email: string;
  password: string;

  // User profile data
  firstName: string;
  lastName: string;
  phoneNumber?: string;

  // Institution data
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
export async function registerInstitutionUser(
  baseUrl: string,
  data: RegisterInstitutionUserRequest
): Promise<RegisterInstitutionUserResponse> {
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
 * Request for invitation-based user registration
 */
export interface RegisterWithInvitationRequest {
  // User credentials
  email: string;
  password: string;

  // User profile data
  firstName: string;
  lastName: string;
  phoneNumber?: string;

  // Invitation
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
export async function registerWithInvitation(
  baseUrl: string,
  data: RegisterWithInvitationRequest
): Promise<RegisterWithInvitationResponse> {
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
export async function lookupUsers(
  client: import('../ApiClient').ApiClient,
  userIds: string[]
): Promise<UserNameInfo[]> {
  if (!userIds || userIds.length === 0) {
    return [];
  }

  // Filter out empty strings and deduplicate
  const uniqueIds = [...new Set(userIds.filter(id => id && id.trim() !== ''))];
  if (uniqueIds.length === 0) {
    return [];
  }

  const response = await client.request<LookupUsersResponse>({
    method: 'POST',
    path: '/lookup-users',
    body: { userIds: uniqueIds },
  });

  return response.users;
}

/**
 * Request to complete OAuth signup (user already authenticated via OAuth)
 */
export interface CompleteOAuthSignupRequest {
  // User profile data
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: string;

  // Lab data - either provide existing labId OR new lab data
  labId?: string; // Existing lab ID (for joining)

  // New lab data (for creating new lab)
  labName?: string;
  labDepartment?: string;
  labCountry?: string;

  // Institution codes (optional)
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
export async function completeOAuthSignup(
  baseUrl: string,
  token: string,
  data: CompleteOAuthSignupRequest
): Promise<CompleteOAuthSignupResponse> {
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
 * Request to complete OAuth signup as institution-only user
 */
export interface CompleteOAuthInstitutionSignupRequest {
  // User profile data
  firstName: string;
  lastName: string;
  phoneNumber?: string;

  // Institution data
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
export async function completeOAuthInstitutionSignup(
  baseUrl: string,
  token: string,
  data: CompleteOAuthInstitutionSignupRequest
): Promise<CompleteOAuthInstitutionSignupResponse> {
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
