import type { ApiClient, Role, EnrichedMembership, EnrichedInvitation, InvitationDetails, CurrentUserRoleResponse, PermissionsByResource, CreateRoleRequest, UpdateRoleRequest, DeleteRoleRequest, UpdateMemberRoleRequest, RemoveMemberRequest, CreateInvitationRequest, CreateInvitationResponse, CancelInvitationRequest, ClaimInvitationRequest, LabMembership } from '@labshare/shared-core';
/**
 * Get all roles for the current lab
 */
export declare function useRoles(client: ApiClient, params: {
    labId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Role[], Error>;
/**
 * Get available permissions grouped by resource
 */
export declare function useAvailablePermissions(client: ApiClient, params?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<PermissionsByResource, Error>;
/**
 * Get display role (title) options
 */
export declare function useDisplayRoleOptions(client: ApiClient, params?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<string[], Error>;
/**
 * Get current user's role and permissions for the lab
 * Includes retry logic to handle race condition after registration
 */
export declare function useCurrentUserRole(client: ApiClient, params: {
    labId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<CurrentUserRoleResponse, Error>;
/**
 * Mutations for role management
 */
export declare function useRoleMutations(client: ApiClient): {
    createRoleMutation: import("@tanstack/react-query").UseMutationResult<Role, Error, CreateRoleRequest, unknown>;
    updateRoleMutation: import("@tanstack/react-query").UseMutationResult<Role, Error, UpdateRoleRequest, unknown>;
    deleteRoleMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, DeleteRoleRequest, unknown>;
    initializeRolesMutation: import("@tanstack/react-query").UseMutationResult<Role[], Error, void, unknown>;
};
/**
 * Get all lab memberships with enriched role information
 */
export declare function useLabMemberships(client: ApiClient, params: {
    labId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<EnrichedMembership[], Error>;
/**
 * Mutations for membership management
 */
export declare function useMembershipMutations(client: ApiClient): {
    updateMemberRoleMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, UpdateMemberRoleRequest, unknown>;
    removeMemberMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, RemoveMemberRequest, unknown>;
};
/**
 * Get all invitations for the current lab
 */
export declare function useInvitations(client: ApiClient, params: {
    labId: string | null | undefined;
    includeExpired?: boolean;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<EnrichedInvitation[], Error>;
/**
 * Get invitation details by code (for signup flow)
 */
export declare function useInvitationByCode(client: ApiClient, params: {
    code: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InvitationDetails, Error>;
/**
 * Mutations for invitation management
 */
export declare function useInvitationMutations(client: ApiClient): {
    createInvitationMutation: import("@tanstack/react-query").UseMutationResult<CreateInvitationResponse, Error, CreateInvitationRequest, unknown>;
    cancelInvitationMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, CancelInvitationRequest, unknown>;
    resendInvitationMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
        inviteCode: string;
    }, Error, string, unknown>;
    claimInvitationMutation: import("@tanstack/react-query").UseMutationResult<{
        membership: LabMembership;
        labId: string;
        message: string;
    }, Error, ClaimInvitationRequest, unknown>;
};
/**
 * Combined hook for all RBAC mutations
 */
export declare function useRBACMutations(client: ApiClient): {
    createInvitationMutation: import("@tanstack/react-query").UseMutationResult<CreateInvitationResponse, Error, CreateInvitationRequest, unknown>;
    cancelInvitationMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, CancelInvitationRequest, unknown>;
    resendInvitationMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
        inviteCode: string;
    }, Error, string, unknown>;
    claimInvitationMutation: import("@tanstack/react-query").UseMutationResult<{
        membership: LabMembership;
        labId: string;
        message: string;
    }, Error, ClaimInvitationRequest, unknown>;
    updateMemberRoleMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, UpdateMemberRoleRequest, unknown>;
    removeMemberMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, RemoveMemberRequest, unknown>;
    createRoleMutation: import("@tanstack/react-query").UseMutationResult<Role, Error, CreateRoleRequest, unknown>;
    updateRoleMutation: import("@tanstack/react-query").UseMutationResult<Role, Error, UpdateRoleRequest, unknown>;
    deleteRoleMutation: import("@tanstack/react-query").UseMutationResult<{
        message: string;
    }, Error, DeleteRoleRequest, unknown>;
    initializeRolesMutation: import("@tanstack/react-query").UseMutationResult<Role[], Error, void, unknown>;
};
//# sourceMappingURL=rbac.d.ts.map