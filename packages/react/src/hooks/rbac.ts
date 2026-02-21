import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  Role,
  EnrichedMembership,
  EnrichedInvitation,
  InvitationDetails,
  CurrentUserRoleResponse,
  PermissionsByResource,
  CreateRoleRequest,
  UpdateRoleRequest,
  DeleteRoleRequest,
  UpdateMemberRoleRequest,
  RemoveMemberRequest,
  CreateInvitationRequest,
  CreateInvitationResponse,
  CancelInvitationRequest,
  ClaimInvitationRequest,
  LabMembership,
} from '@labshare/shared-core';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getAvailablePermissions,
  getDisplayRoleOptions,
  getCurrentUserRole,
  initializeLabRoles,
  getLabMemberships,
  updateMemberRole,
  removeMember,
  getInvitations,
  createInvitation,
  cancelInvitation,
  resendInvitation,
  getInvitationByCode,
  claimInvitation,
} from '@labshare/shared-core';

import { rbacKeys } from '../queryKeys/rbac';

// ============================================================================
// Role Hooks
// ============================================================================

/**
 * Get all roles for the current lab
 */
export function useRoles(
  client: ApiClient,
  params: { labId: string | null | undefined; enabled?: boolean }
) {
  return useQuery<Role[], Error>({
    queryKey: rbacKeys.rolesList(params.labId ?? null),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return getRoles(client);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 60_000, // 1 minute - roles don't change often
  });
}

/**
 * Get available permissions grouped by resource
 */
export function useAvailablePermissions(
  client: ApiClient,
  params: { enabled?: boolean } = {}
) {
  return useQuery<PermissionsByResource, Error>({
    queryKey: rbacKeys.availablePermissions(),
    queryFn: () => getAvailablePermissions(client),
    enabled: params.enabled ?? true,
    staleTime: Infinity, // Permissions don't change
  });
}

/**
 * Get display role (title) options
 */
export function useDisplayRoleOptions(
  client: ApiClient,
  params: { enabled?: boolean } = {}
) {
  return useQuery<string[], Error>({
    queryKey: rbacKeys.displayRoleOptions(),
    queryFn: () => getDisplayRoleOptions(client),
    enabled: params.enabled ?? true,
    staleTime: Infinity, // Options don't change
  });
}

/**
 * Get current user's role and permissions for the lab
 * Includes retry logic to handle race condition after registration
 */
export function useCurrentUserRole(
  client: ApiClient,
  params: { labId: string | null | undefined; enabled?: boolean }
) {
  return useQuery<CurrentUserRoleResponse, Error>({
    queryKey: rbacKeys.currentUserRole(params.labId ?? null),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return getCurrentUserRole(client);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30_000,
    // Retry if user has no membership (race condition after registration)
    retry: (failureCount, error) => {
      // Retry up to 3 times with delay
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
    // Refetch if no membership found (data might not be ready yet)
    refetchInterval: (query) => {
      const data = query.state.data;
      // If no membership, refetch every 2 seconds up to a few times
      if (data && !data.hasMembership) {
        const fetchCount = query.state.dataUpdateCount;
        if (fetchCount < 5) return 2000;
      }
      return false;
    },
  });
}

/**
 * Mutations for role management
 */
export function useRoleMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createRoleMutation = useMutation({
    mutationFn: (payload: CreateRoleRequest) => createRole(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (payload: UpdateRoleRequest) => updateRole(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      // Also invalidate current user role in case permissions changed
      queryClient.invalidateQueries({ queryKey: rbacKeys.all });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (payload: DeleteRoleRequest) => deleteRole(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
    },
  });

  const initializeRolesMutation = useMutation({
    mutationFn: () => initializeLabRoles(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
    },
  });

  return {
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
    initializeRolesMutation,
  };
}

// ============================================================================
// Membership Hooks
// ============================================================================

/**
 * Get all lab memberships with enriched role information
 */
export function useLabMemberships(
  client: ApiClient,
  params: { labId: string | null | undefined; enabled?: boolean }
) {
  return useQuery<EnrichedMembership[], Error>({
    queryKey: rbacKeys.membershipsList(params.labId ?? null),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return getLabMemberships(client);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30_000,
  });
}

/**
 * Mutations for membership management
 */
export function useMembershipMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const updateMemberRoleMutation = useMutation({
    mutationFn: (payload: UpdateMemberRoleRequest) => updateMemberRole(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.memberships() });
      // Also invalidate current user role in case the updated member is viewing the page
      queryClient.invalidateQueries({ queryKey: ['rbac', 'currentUser'] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (payload: RemoveMemberRequest) => removeMember(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.memberships() });
    },
  });

  return {
    updateMemberRoleMutation,
    removeMemberMutation,
  };
}

// ============================================================================
// Invitation Hooks
// ============================================================================

/**
 * Get all invitations for the current lab
 */
export function useInvitations(
  client: ApiClient,
  params: { labId: string | null | undefined; includeExpired?: boolean; enabled?: boolean }
) {
  return useQuery<EnrichedInvitation[], Error>({
    queryKey: rbacKeys.invitationsList(params.labId ?? null, params.includeExpired ?? false),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return getInvitations(client, params.includeExpired);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30_000,
  });
}

/**
 * Get invitation details by code (for signup flow)
 */
export function useInvitationByCode(
  client: ApiClient,
  params: { code: string | null | undefined; enabled?: boolean }
) {
  return useQuery<InvitationDetails, Error>({
    queryKey: rbacKeys.invitationByCode(params.code ?? null),
    queryFn: async () => {
      if (!params.code) throw new Error('code required');
      return getInvitationByCode(client, params.code);
    },
    enabled: params.enabled ?? !!params.code,
    staleTime: 60_000,
  });
}

/**
 * Mutations for invitation management
 */
export function useInvitationMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createInvitationMutation = useMutation({
    mutationFn: (payload: CreateInvitationRequest) => createInvitation(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.invitations() });
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: (payload: CancelInvitationRequest) => cancelInvitation(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.invitations() });
    },
  });

  const resendInvitationMutation = useMutation({
    mutationFn: (invitationId: string) => resendInvitation(client, invitationId),
    onSuccess: () => {
      // No need to invalidate - just triggers email resend
    },
  });

  const claimInvitationMutation = useMutation({
    mutationFn: (payload: ClaimInvitationRequest) => claimInvitation(client, payload),
    onSuccess: (data) => {
      // Invalidate invitations (it's now accepted) and memberships (new member added)
      queryClient.invalidateQueries({ queryKey: rbacKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: rbacKeys.memberships() });
      queryClient.invalidateQueries({ queryKey: rbacKeys.currentUserRole(data.labId) });
    },
  });

  return {
    createInvitationMutation,
    cancelInvitationMutation,
    resendInvitationMutation,
    claimInvitationMutation,
  };
}

// ============================================================================
// Combined Hook
// ============================================================================

/**
 * Combined hook for all RBAC mutations
 */
export function useRBACMutations(client: ApiClient) {
  return {
    ...useRoleMutations(client),
    ...useMembershipMutations(client),
    ...useInvitationMutations(client),
  };
}
