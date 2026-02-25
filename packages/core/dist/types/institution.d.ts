/**
 * Institution Management Types
 *
 * Represents the hierarchical institution management system where:
 * - Institutions contain departments (optional) and labs
 * - Labs can belong to multiple institutions
 * - Users can be in multiple labs with different roles
 * - Institution admins have view-only access to all labs
 * - Department heads can edit orders and configure approval flows
 */
/**
 * Institution address information
 */
export interface InstitutionAddress {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}
/**
 * Main institution entity
 */
export interface Institution {
    id: string;
    name: string;
    institutionCode: string;
    address?: InstitutionAddress;
    website?: string;
    settings?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
/**
 * Response from /institution/by-code endpoint (limited public info)
 */
export interface InstitutionPublicInfo {
    id: string;
    name: string;
    institutionCode: string;
}
/**
 * Request to create a new institution
 */
export interface CreateInstitutionRequest {
    name: string;
    address?: InstitutionAddress;
    website?: string;
    settings?: Record<string, unknown>;
}
/**
 * Link between a lab and an institution
 */
export interface LabInstitution {
    id: string;
    labId: string;
    institutionId: string;
    isPrimary: boolean;
    joinedAt: string;
}
/**
 * Department within an institution
 */
export interface Department {
    id: string;
    institutionId: string;
    name: string;
    code?: string;
    description?: string;
    settings?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
/**
 * Request to create a department
 */
export interface CreateDepartmentRequest {
    institutionId: string;
    name: string;
    code?: string;
    description?: string;
}
/**
 * Request to update a department
 */
export interface UpdateDepartmentRequest {
    name: string;
    code?: string;
    description?: string;
}
/**
 * Link between a lab and a department
 */
export interface LabDepartment {
    id: string;
    labId: string;
    departmentId: string;
    createdAt: string;
}
/**
 * Request to add/remove a lab from a department
 */
export interface LabDepartmentRequest {
    labId: string;
    departmentId: string;
}
/**
 * Role within an institution
 */
export interface InstitutionRole {
    id: string;
    institutionId: string;
    name: InstitutionRoleName;
    description?: string;
    permissions: InstitutionPermission[];
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}
/**
 * Institution role name — includes default roles and any custom roles
 */
export type InstitutionRoleName = string;
/**
 * Available institution-level permissions
 */
export type InstitutionPermission = 'institution:view' | 'institution:edit' | 'institution:admin' | 'members:view' | 'members:invite' | 'members:edit_roles' | 'members:remove' | 'department:view' | 'department:admin' | 'orders:view' | 'orders:approve' | 'inventory:view' | 'collaborations:view' | 'collaborations:manage' | 'sharing:view';
/**
 * Human-readable labels for institution permissions
 */
export declare const INSTITUTION_PERMISSION_LABELS: Record<InstitutionPermission, string>;
/**
 * Permissions grouped by resource category
 */
export type InstitutionPermissionsByResource = Record<string, InstitutionPermission[]>;
/**
 * User's membership in an institution
 */
export interface InstitutionMembership {
    id: string;
    userId: string;
    institutionId: string;
    roleId: string;
    departmentId?: string;
    isFirstAdmin: boolean;
    status: InstitutionMembershipStatus;
    joinedAt: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Status of an institution membership
 */
export type InstitutionMembershipStatus = 'active' | 'pending' | 'suspended';
/**
 * Collaboration agreement between two institutions
 */
export interface AllowedCollaboration {
    id: string;
    institutionAId: string;
    institutionBId: string;
    status: CollaborationStatus;
    requestedByInstitutionId: string;
    approvedAt?: string;
    createdAt: string;
}
/**
 * Status of a collaboration request
 */
export type CollaborationStatus = 'pending' | 'approved' | 'rejected';
/**
 * Request to create an inter-institution collaboration
 */
export interface InstitutionCollaborationRequest {
    targetInstitutionId: string;
}
/**
 * Request to approve/reject an inter-institution collaboration
 */
export interface InstitutionCollaborationActionRequest {
    collaborationId: string;
}
/**
 * Usage record for an institution code
 */
export interface InstitutionCodeUsage {
    id: string;
    institutionCode: string;
    userId: string;
    isFirstUse: boolean;
    usedAt: string;
}
/**
 * Extended registration request with institution codes
 */
export interface RegisterUserWithInstitutionsRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
    labName: string;
    labDepartment?: string;
    labCountry?: string;
    labBuilding?: string;
    labFloorNumber?: string;
    institutionCodes: string[];
}
/**
 * Response from registration with institutions
 */
export interface RegisterUserWithInstitutionsResponse {
    userId: string;
    labId: string;
    email: string;
    institutionIds?: string[];
    pendingInstitutionIds?: string[];
    hasPendingInstitutions?: boolean;
}
/**
 * Lab info as returned in institution context
 */
export interface InstitutionLabInfo {
    id: string;
    name: string;
    institution: string;
}
/**
 * Member info with institution context
 */
export interface InstitutionMemberInfo extends InstitutionMembership {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    role?: InstitutionRole;
    department?: Department;
}
/**
 * Dashboard overview stats for an institution
 */
export interface InstitutionDashboardOverview {
    institutionId: string;
    totalLabs: number;
    totalMembers: number;
    totalInventoryItems: number;
    totalOrderRequests: number;
    totalGrants: number;
}
/**
 * Permission check for institution-level operations
 */
export declare function hasInstitutionPermission(membership: InstitutionMembership | null, role: InstitutionRole | null, permission: InstitutionPermission): boolean;
/**
 * Check if user is institution admin
 */
export declare function isInstitutionAdmin(membership: InstitutionMembership | null, role: InstitutionRole | null): boolean;
/**
 * Check if user is department head
 */
export declare function isDepartmentHead(membership: InstitutionMembership | null, role: InstitutionRole | null): boolean;
/**
 * Check if user can approve orders for a department
 */
export declare function canApproveOrders(membership: InstitutionMembership | null, role: InstitutionRole | null): boolean;
/**
 * Collaboration with enriched institution names
 */
export interface CollaborationWithInstitutions {
    id: string;
    institutionAId: string;
    institutionBId: string;
    institutionAName: string;
    institutionBName: string;
    status: CollaborationStatus;
    requestedByInstitutionId: string;
    approvedAt?: string;
    createdAt: string;
}
/**
 * Statistics about collaborations
 */
export interface CollaborationStats {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    approvalRate: number;
}
/**
 * Response from collaboration history endpoint
 */
export interface CollaborationHistoryResponse {
    collaborations: CollaborationWithInstitutions[];
    stats: CollaborationStats;
}
/**
 * Request params for searching institution order requests
 */
export interface InstitutionOrderRequestsParams {
    view: 'current' | 'placed' | 'archived';
    labIds?: string[];
    query?: string;
    page?: number;
    limit?: number;
}
/**
 * Order request with lab name for institution admin view
 */
export interface InstitutionOrderRequest {
    id: string;
    name: string;
    brand?: string;
    catalog?: string;
    quantity: number;
    units?: string;
    labId: string;
    labName?: string;
    createdAt: string;
    updatedAt?: string;
    urgency?: 'high' | 'medium' | 'low';
    attributes?: {
        price?: {
            amount: number;
            currency: string;
        };
        [key: string]: unknown;
    };
    [key: string]: unknown;
}
/**
 * Response from institution order requests search
 */
export interface InstitutionOrderRequestsResponse {
    orderRequests: InstitutionOrderRequest[];
    totalCount: number;
}
/**
 * Request params for searching institution inventory
 */
export interface InstitutionInventoryParams {
    labIds?: string[];
    query?: string;
    page?: number;
    limit?: number;
}
/**
 * Inventory item with lab name for institution admin view
 */
export interface InstitutionInventoryItem {
    id: string;
    name: string;
    brand?: string;
    catalog?: string;
    quantity: number;
    units?: string;
    labId: string;
    labName?: string;
    createdAt: string;
    updatedAt?: string;
    [key: string]: unknown;
}
/**
 * Response from institution inventory search
 */
export interface InstitutionInventoryResponse {
    items: InstitutionInventoryItem[];
    totalCount: number;
}
/**
 * Request to update an institution member's role
 */
export interface UpdateInstitutionMemberRoleRequest {
    membershipId: string;
    roleName: InstitutionRoleName;
    departmentId?: string;
}
/**
 * Request to create a custom institution role
 */
export interface CreateInstitutionRoleRequest {
    institutionId: string;
    name: string;
    description?: string;
    permissions: InstitutionPermission[];
}
/**
 * Request to update an institution role
 */
export interface UpdateInstitutionRoleRequest {
    roleId: string;
    name: string;
    description?: string;
    permissions: InstitutionPermission[];
}
/**
 * Request to delete an institution role
 */
export interface DeleteInstitutionRoleRequest {
    roleId: string;
}
/**
 * Status of an institution invitation
 */
export type InstitutionInvitationStatus = 'pending' | 'accepted' | 'expired' | 'canceled';
/**
 * Institution invitation document (stored in MongoDB)
 */
export interface InstitutionInvitation {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    institutionId: string;
    roleName: InstitutionRoleName;
    departmentId?: string;
    invitedBy: string;
    inviteCode: string;
    status: InstitutionInvitationStatus;
    expiresAt: string;
    createdAt: string;
    acceptedAt?: string;
}
/**
 * Public details of an institution invitation (returned for signup flow)
 */
export interface InstitutionInvitationDetails {
    inviteCode: string;
    email: string;
    firstName: string;
    lastName: string;
    institutionId: string;
    institutionName: string;
    roleName: InstitutionRoleName;
    departmentName?: string;
    status: InstitutionInvitationStatus;
    expiresAt: string;
}
/**
 * Request to create an institution invitation
 */
export interface CreateInstitutionInvitationRequest {
    email: string;
    firstName: string;
    lastName: string;
    institutionId: string;
    roleName: InstitutionRoleName;
    departmentId?: string;
}
/**
 * Response from claiming an institution invitation
 */
export interface ClaimInstitutionInvitationResponse {
    membershipId: string;
    institutionId: string;
    roleId: string;
    departmentId?: string;
}
//# sourceMappingURL=institution.d.ts.map