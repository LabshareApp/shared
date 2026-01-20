import type { ApiClient } from '../../ApiClient';
import type { EnrichedMembership, UpdateMemberRoleRequest, RemoveMemberRequest } from '../../../types/rbac';
/**
 * Get all lab memberships with enriched role information
 */
export declare function getLabMemberships(client: ApiClient): Promise<EnrichedMembership[]>;
/**
 * Update a member's role
 */
export declare function updateMemberRole(client: ApiClient, data: UpdateMemberRoleRequest): Promise<{
    message: string;
}>;
/**
 * Remove a member from the lab
 */
export declare function removeMember(client: ApiClient, data: RemoveMemberRequest): Promise<{
    message: string;
}>;
//# sourceMappingURL=members.d.ts.map