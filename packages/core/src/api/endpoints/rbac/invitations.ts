import type { ApiClient } from '../../ApiClient';
import type {
  EnrichedInvitation,
  InvitationDetails,
  CreateInvitationRequest,
  CreateInvitationResponse,
  CancelInvitationRequest,
  ClaimInvitationRequest,
  LabMembership,
} from '../../../types/rbac';
import { validateArrayResponse } from '../../responseValidation';

/**
 * Get all invitations for the current lab
 */
export async function getInvitations(
  client: ApiClient,
  includeExpired = false
): Promise<EnrichedInvitation[]> {
  const res = await client.request<EnrichedInvitation[]>({
    method: 'GET',
    path: '/get-invitations',
    query: includeExpired ? { includeExpired: 'true' } : undefined,
  });
  return validateArrayResponse<EnrichedInvitation>(res, 'getInvitations');
}

/**
 * Create a new invitation
 */
export async function createInvitation(
  client: ApiClient,
  data: CreateInvitationRequest
): Promise<CreateInvitationResponse> {
  return client.request<CreateInvitationResponse>({
    method: 'POST',
    path: '/create-invitation',
    body: data,
  });
}

/**
 * Cancel a pending invitation
 */
export async function cancelInvitation(
  client: ApiClient,
  data: CancelInvitationRequest
): Promise<{ message: string }> {
  return client.request<{ message: string }>({
    method: 'POST',
    path: '/cancel-invitation',
    body: data,
  });
}

/**
 * Resend an invitation email
 */
export async function resendInvitation(
  client: ApiClient,
  invitationId: string
): Promise<{ message: string; inviteCode: string }> {
  return client.request<{ message: string; inviteCode: string }>({
    method: 'POST',
    path: '/resend-invitation',
    body: { invitationId },
  });
}

/**
 * Get invitation details by code (PUBLIC - no auth required)
 * This is used during the signup flow to show invitation details
 */
export async function getInvitationByCode(
  client: ApiClient,
  code: string
): Promise<InvitationDetails> {
  return client.request<InvitationDetails>({
    method: 'GET',
    path: '/get-invitation-by-code',
    query: { code },
  });
}

/**
 * Claim an invitation (creates membership)
 * User must be authenticated
 */
export async function claimInvitation(
  client: ApiClient,
  data: ClaimInvitationRequest
): Promise<{ membership: LabMembership; labId: string; message: string }> {
  return client.request<{ membership: LabMembership; labId: string; message: string }>({
    method: 'POST',
    path: '/claim-invitation',
    body: data,
  });
}
