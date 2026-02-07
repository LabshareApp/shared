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
  description?: string;
}

/**
 * Request to update a department
 */
export interface UpdateDepartmentRequest {
  name: string;
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
  permissions: InstitutionPermission[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Default institution role names
 */
export type InstitutionRoleName =
  | 'institution_admin'
  | 'department_head'
  | 'observer';

/**
 * Available institution-level permissions
 */
export type InstitutionPermission =
  | 'institution:view'
  | 'institution:admin'
  | 'department:view'
  | 'department:admin'
  | 'department:approve_orders';

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
  // User credentials
  email: string;
  password: string;

  // User profile
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: string;

  // Lab data (always create new lab)
  labName: string;
  labDepartment?: string;
  labCountry?: string;
  labBuilding?: string;
  labFloorNumber?: string;

  // Institution codes (required, 1+)
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
export function hasInstitutionPermission(
  membership: InstitutionMembership | null,
  role: InstitutionRole | null,
  permission: InstitutionPermission
): boolean {
  if (!membership || !role) {
    return false;
  }

  if (membership.status !== 'active') {
    return false;
  }

  return role.permissions.includes(permission);
}

/**
 * Check if user is institution admin
 */
export function isInstitutionAdmin(
  membership: InstitutionMembership | null,
  role: InstitutionRole | null
): boolean {
  return hasInstitutionPermission(membership, role, 'institution:admin');
}

/**
 * Check if user is department head
 */
export function isDepartmentHead(
  membership: InstitutionMembership | null,
  role: InstitutionRole | null
): boolean {
  return hasInstitutionPermission(membership, role, 'department:admin');
}

/**
 * Check if user can approve orders for a department
 */
export function canApproveOrders(
  membership: InstitutionMembership | null,
  role: InstitutionRole | null
): boolean {
  return hasInstitutionPermission(membership, role, 'department:approve_orders');
}
