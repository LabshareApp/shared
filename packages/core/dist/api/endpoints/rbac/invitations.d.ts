import type { ApiClient } from '../../ApiClient';
import type { EnrichedInvitation, InvitationDetails, CreateInvitationRequest, CreateInvitationResponse, CancelInvitationRequest, ClaimInvitationRequest, LabMembership } from '../../../types/rbac';
/**
 * Get all invitations for the current lab
 */
export declare function getInvitations(client: ApiClient, includeExpired?: boolean): Promise<EnrichedInvitation[]>;
/**
 * Create a new invitation
 */
export declare function createInvitation(client: ApiClient, data: CreateInvitationRequest): Promise<CreateInvitationResponse>;
/**
 * Cancel a pending invitation
 */
export declare function cancelInvitation(client: ApiClient, data: CancelInvitationRequest): Promise<{
    message: string;
}>;
/**
 * Resend an invitation email
 */
export declare function resendInvitation(client: ApiClient, invitationId: string): Promise<{
    message: string;
    inviteCode: string;
}>;
/**
 * Get invitation details by code (PUBLIC - no auth required)
 * This is used during the signup flow to show invitation details
 */
export declare function getInvitationByCode(client: ApiClient, code: string): Promise<InvitationDetails>;
/**
 * Claim an invitation (creates membership)
 * User must be authenticated
 */
export declare function claimInvitation(client: ApiClient, data: ClaimInvitationRequest): Promise<{
    membership: LabMembership;
    labId: string;
    message: string;
}>;
//# sourceMappingURL=invitations.d.ts.map