/**
 * Tools Management Types
 * Types for shareable lab tools with checkout/return functionality
 */
export type ToolStatus = 'available' | 'checked_out' | 'maintenance' | 'retired';
export type ToolCheckoutStatus = 'active' | 'returned' | 'overdue';
export type ToolCondition = 'good' | 'damaged' | 'needs_maintenance';
export type ToolAccessAction = 'view' | 'checkout' | 'return' | 'access';
export type ToolOwnershipLevel = 'lab' | 'department';
export type ToolBillingType = 'hourly' | 'daily' | 'flat' | 'free';
export type ToolSharingPolicy = 'institution' | 'department' | 'lab_only' | 'collaborators';
export interface ToolPricing {
    billingType: ToolBillingType;
    hourlyRate?: number;
    dailyRate?: number;
    flatFee?: number;
    currency: string;
}
export interface CurrentCheckout {
    userId: string;
    userEmail: string;
    userName?: string;
    labId: string;
    checkedOutAt: string;
    dueDate?: string;
    notes?: string;
}
export interface Tool {
    id: string;
    labId: string;
    name: string;
    description?: string;
    category: string;
    serialNumber?: string;
    location?: string;
    imageUrl?: string;
    ownershipLevel?: ToolOwnershipLevel;
    departmentId?: string;
    departmentName?: string;
    institutionId?: string;
    sharingPolicy?: ToolSharingPolicy;
    isShareable: boolean;
    sharedWithLabIds?: string[];
    sharedWithDepartmentIds?: string[];
    sharedWithInstitution: boolean;
    requiresCheckout: boolean;
    maxCheckoutDays?: number;
    pricing?: ToolPricing;
    status: ToolStatus;
    currentCheckout?: CurrentCheckout;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}
export interface ToolCheckout {
    id: string;
    toolId: string;
    toolName: string;
    userId: string;
    userEmail: string;
    userName?: string;
    labId: string;
    labName: string;
    checkedOutAt: string;
    dueDate?: string;
    returnedAt?: string;
    status: ToolCheckoutStatus;
    checkoutNotes?: string;
    returnNotes?: string;
    condition?: ToolCondition;
    billingType?: ToolBillingType;
    duration?: number;
    unitRate?: number;
    totalCost?: number;
    currency?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ToolAccessLog {
    id: string;
    toolId: string;
    toolName: string;
    userId: string;
    userEmail: string;
    labId: string;
    accessedAt: string;
    action: ToolAccessAction;
    notes?: string;
    metadata?: Record<string, any>;
}
export interface CreateToolData {
    name: string;
    description?: string;
    category: string;
    serialNumber?: string;
    location?: string;
    imageUrl?: string;
    ownershipLevel?: ToolOwnershipLevel;
    departmentId?: string;
    departmentName?: string;
    institutionId?: string;
    sharingPolicy?: ToolSharingPolicy;
    isShareable?: boolean;
    sharedWithLabIds?: string[];
    sharedWithDepartmentIds?: string[];
    sharedWithInstitution?: boolean;
    requiresCheckout?: boolean;
    maxCheckoutDays?: number;
    pricing?: ToolPricing;
}
export interface UpdateToolData {
    name?: string;
    description?: string;
    category?: string;
    serialNumber?: string;
    location?: string;
    imageUrl?: string;
    ownershipLevel?: ToolOwnershipLevel;
    departmentId?: string;
    departmentName?: string;
    institutionId?: string;
    sharingPolicy?: ToolSharingPolicy;
    isShareable?: boolean;
    sharedWithLabIds?: string[];
    sharedWithDepartmentIds?: string[];
    sharedWithInstitution?: boolean;
    requiresCheckout?: boolean;
    maxCheckoutDays?: number;
    pricing?: ToolPricing;
    status?: ToolStatus;
}
export interface CheckoutToolData {
    dueDate?: string;
    notes?: string;
}
export interface ReturnToolData {
    notes?: string;
    condition?: ToolCondition;
}
export interface LogAccessData {
    action: 'view' | 'access';
    notes?: string;
    metadata?: Record<string, any>;
}
export interface ToolListResponse {
    tools: Tool[];
    totalCount: number;
    page: number;
    limit: number;
}
export interface CheckoutListResponse {
    checkouts: ToolCheckout[];
    totalCount: number;
    page: number;
    limit: number;
}
export interface MyCheckoutsResponse {
    checkouts: ToolCheckout[];
    count: number;
}
export interface ListToolsParams {
    page?: number;
    limit?: number;
    status?: ToolStatus;
    category?: string;
    search?: string;
    includeShared?: boolean;
    departmentId?: string;
    institutionId?: string;
    ownershipLevel?: ToolOwnershipLevel;
    includeDeptTools?: boolean;
}
export interface ListCheckoutsParams {
    page?: number;
    limit?: number;
}
export declare const TOOL_CATEGORIES: readonly ["Hand Tool", "Power Tool", "Measurement", "Cutting", "Safety Equipment", "Cleaning", "Storage", "Electrical", "Optical", "Laboratory Equipment", "Other"];
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];
/**
 * Configurable required fields for tool creation/editing.
 * When true, the field is required when creating or editing a tool.
 */
export interface ToolRequiredFields {
    description: boolean;
    serialNumber: boolean;
    location: boolean;
    imageUrl: boolean;
    maxCheckoutDays: boolean;
}
/**
 * Default required fields configuration (all false = no extra required fields)
 */
export declare const DEFAULT_TOOL_REQUIRED_FIELDS: ToolRequiredFields;
/**
 * Metadata for each configurable required field (used in settings UI)
 */
export declare const TOOL_REQUIRED_FIELD_OPTIONS: {
    key: keyof ToolRequiredFields;
    label: string;
    description: string;
}[];
//# sourceMappingURL=tools.d.ts.map