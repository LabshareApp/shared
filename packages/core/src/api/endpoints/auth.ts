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
