"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoles = useRoles;
exports.useAvailablePermissions = useAvailablePermissions;
exports.useDisplayRoleOptions = useDisplayRoleOptions;
exports.useCurrentUserRole = useCurrentUserRole;
exports.useRoleMutations = useRoleMutations;
exports.useLabMemberships = useLabMemberships;
exports.useMembershipMutations = useMembershipMutations;
exports.useInvitations = useInvitations;
exports.useInvitationByCode = useInvitationByCode;
exports.useInvitationMutations = useInvitationMutations;
exports.useRBACMutations = useRBACMutations;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const rbac_1 = require("../queryKeys/rbac");
// ============================================================================
// Role Hooks
// ============================================================================
/**
 * Get all roles for the current lab
 */
function useRoles(client, params) {
    var _a, _b;
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.rolesList((_a = params.labId) !== null && _a !== void 0 ? _a : null),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.getRoles)(client);
        },
        enabled: (_b = params.enabled) !== null && _b !== void 0 ? _b : !!params.labId,
        staleTime: 60000, // 1 minute - roles don't change often
    });
}
/**
 * Get available permissions grouped by resource
 */
function useAvailablePermissions(client, params = {}) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.availablePermissions(),
        queryFn: () => (0, shared_core_1.getAvailablePermissions)(client),
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: Infinity, // Permissions don't change
    });
}
/**
 * Get display role (title) options
 */
function useDisplayRoleOptions(client, params = {}) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.displayRoleOptions(),
        queryFn: () => (0, shared_core_1.getDisplayRoleOptions)(client),
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: Infinity, // Options don't change
    });
}
/**
 * Get current user's role and permissions for the lab
 * Includes retry logic to handle race condition after registration
 */
function useCurrentUserRole(client, params) {
    var _a, _b;
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.currentUserRole((_a = params.labId) !== null && _a !== void 0 ? _a : null),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.getCurrentUserRole)(client);
        },
        enabled: (_b = params.enabled) !== null && _b !== void 0 ? _b : !!params.labId,
        staleTime: 30000,
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
                if (fetchCount < 5)
                    return 2000;
            }
            return false;
        },
    });
}
/**
 * Mutations for role management
 */
function useRoleMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createRoleMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.createRole)(client, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.roles() });
        },
    });
    const updateRoleMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.updateRole)(client, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.roles() });
            // Also invalidate current user role in case permissions changed
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.all });
        },
    });
    const deleteRoleMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.deleteRole)(client, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.roles() });
        },
    });
    const initializeRolesMutation = (0, react_query_1.useMutation)({
        mutationFn: () => (0, shared_core_1.initializeLabRoles)(client),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.roles() });
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
function useLabMemberships(client, params) {
    var _a, _b;
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.membershipsList((_a = params.labId) !== null && _a !== void 0 ? _a : null),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.getLabMemberships)(client);
        },
        enabled: (_b = params.enabled) !== null && _b !== void 0 ? _b : !!params.labId,
        staleTime: 30000,
    });
}
/**
 * Mutations for membership management
 */
function useMembershipMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const updateMemberRoleMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.updateMemberRole)(client, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.memberships() });
            // Also invalidate current user role in case the updated member is viewing the page
            queryClient.invalidateQueries({ queryKey: ['rbac', 'currentUser'] });
        },
    });
    const removeMemberMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.removeMember)(client, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.memberships() });
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
function useInvitations(client, params) {
    var _a, _b, _c;
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.invitationsList((_a = params.labId) !== null && _a !== void 0 ? _a : null, (_b = params.includeExpired) !== null && _b !== void 0 ? _b : false),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.getInvitations)(client, params.includeExpired);
        },
        enabled: (_c = params.enabled) !== null && _c !== void 0 ? _c : !!params.labId,
        staleTime: 30000,
    });
}
/**
 * Get invitation details by code (for signup flow)
 */
function useInvitationByCode(client, params) {
    var _a, _b;
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.invitationByCode((_a = params.code) !== null && _a !== void 0 ? _a : null),
        queryFn: async () => {
            if (!params.code)
                throw new Error('code required');
            return (0, shared_core_1.getInvitationByCode)(client, params.code);
        },
        enabled: (_b = params.enabled) !== null && _b !== void 0 ? _b : !!params.code,
        staleTime: 60000,
    });
}
/**
 * Mutations for invitation management
 */
function useInvitationMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createInvitationMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.createInvitation)(client, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.invitations() });
        },
    });
    const cancelInvitationMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.cancelInvitation)(client, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.invitations() });
        },
    });
    const resendInvitationMutation = (0, react_query_1.useMutation)({
        mutationFn: (invitationId) => (0, shared_core_1.resendInvitation)(client, invitationId),
        onSuccess: () => {
            // No need to invalidate - just triggers email resend
        },
    });
    const claimInvitationMutation = (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.claimInvitation)(client, payload),
        onSuccess: (data) => {
            // Invalidate invitations (it's now accepted) and memberships (new member added)
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.invitations() });
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.memberships() });
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.currentUserRole(data.labId) });
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
function useRBACMutations(client) {
    return {
        ...useRoleMutations(client),
        ...useMembershipMutations(client),
        ...useInvitationMutations(client),
    };
}
//# sourceMappingURL=rbac.js.map