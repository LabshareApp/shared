import type { ApiClient } from '../../ApiClient';
import type {
  EnrichedMembership,
  UpdateMemberRoleRequest,
  RemoveMemberRequest,
} from '../../../types/rbac';
import { validateArrayResponse, normalizeMongoId } from '../../responseValidation';

/**
 * Get all lab memberships with enriched role information
 */
export async function getLabMemberships(
  client: ApiClient
): Promise<EnrichedMembership[]> {
  const res = await client.request<EnrichedMembership[]>({
    method: 'GET',
    path: '/get-lab-memberships',
  });
  return validateArrayResponse<EnrichedMembership>(res, 'getLabMemberships').map(normalizeMongoId);
}

/**
 * Update a member's role
 */
export async function updateMemberRole(
  client: ApiClient,
  data: UpdateMemberRoleRequest
): Promise<{ message: string }> {
  return client.request<{ message: string }>({
    method: 'PUT',
    path: '/update-member-role',
    body: data,
  });
}

/**
 * Remove a member from the lab
 */
export async function removeMember(
  client: ApiClient,
  data: RemoveMemberRequest
): Promise<{ message: string }> {
  return client.request<{ message: string }>({
    method: 'POST',
    path: '/remove-member',
    body: data,
  });
}
