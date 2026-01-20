/**
 * Query keys for RBAC (Role-Based Access Control)
 */
export declare const rbacKeys: {
    all: readonly ["rbac"];
    roles: () => readonly ["rbac", "roles"];
    rolesList: (labId: string | null) => readonly ["rbac", "roles", "list", string | null];
    memberships: () => readonly ["rbac", "memberships"];
    membershipsList: (labId: string | null) => readonly ["rbac", "memberships", "list", string | null];
    invitations: () => readonly ["rbac", "invitations"];
    invitationsList: (labId: string | null, includeExpired: boolean) => readonly ["rbac", "invitations", "list", string | null, boolean];
    invitationByCode: (code: string | null) => readonly ["rbac", "invitations", "byCode", string | null];
    currentUserRole: (labId: string | null) => readonly ["rbac", "currentUser", string | null];
    availablePermissions: () => readonly ["rbac", "permissions"];
    displayRoleOptions: () => readonly ["rbac", "displayRoleOptions"];
};
export declare const rolesList: (labId: string | null) => readonly ["rbac", "roles", "list", string | null];
export declare const membershipsList: (labId: string | null) => readonly ["rbac", "memberships", "list", string | null];
export declare const invitationsList: (labId: string | null, includeExpired: boolean) => readonly ["rbac", "invitations", "list", string | null, boolean];
export declare const invitationByCode: (code: string | null) => readonly ["rbac", "invitations", "byCode", string | null];
export declare const currentUserRole: (labId: string | null) => readonly ["rbac", "currentUser", string | null];
export declare const availablePermissions: () => readonly ["rbac", "permissions"];
export declare const displayRoleOptions: () => readonly ["rbac", "displayRoleOptions"];
//# sourceMappingURL=rbac.d.ts.map