/**
 * Tools Management Types
 * Types for shareable lab tools with checkout/return functionality
 */

// --- Enums ---

export type ToolStatus = 'available' | 'checked_out' | 'maintenance' | 'retired';

export type ToolCheckoutStatus = 'active' | 'returned' | 'overdue';

export type ToolCondition = 'good' | 'damaged' | 'needs_maintenance';

export type ToolAccessAction = 'view' | 'checkout' | 'return' | 'access';

export type ToolOwnershipLevel = 'lab' | 'department';

export type ToolBillingType = 'hourly' | 'daily' | 'flat' | 'free';

// --- Tool Pricing ---

export interface ToolPricing {
  billingType: ToolBillingType;
  hourlyRate?: number;   // cents per hour
  dailyRate?: number;    // cents per day
  flatFee?: number;      // cents per checkout
  currency: string;      // ISO 4217 code (e.g., "USD")
}

// --- Current Checkout ---

export interface CurrentCheckout {
  userId: string;
  userEmail: string;
  labId: string;
  checkedOutAt: string;
  dueDate?: string;
  notes?: string;
}

// --- Tool ---

export interface Tool {
  id: string;
  labId: string;
  name: string;
  description?: string;
  category: string;
  serialNumber?: string;
  location?: string;
  imageUrl?: string;

  // Department-level ownership
  ownershipLevel?: ToolOwnershipLevel;  // 'lab' or 'department'
  departmentId?: string;                 // Department that owns this tool (if dept-level)
  departmentName?: string;               // Denormalized for display
  institutionId?: string;                // Institution (for dept-level tools)

  // Sharing settings
  isShareable: boolean;
  sharedWithLabIds?: string[];
  sharedWithDepartmentIds?: string[];    // Departments that can request this tool
  sharedWithInstitution: boolean;

  // Checkout settings
  requiresCheckout: boolean;
  maxCheckoutDays?: number;

  // Pricing
  pricing?: ToolPricing;

  // Status
  status: ToolStatus;
  currentCheckout?: CurrentCheckout;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// --- Tool Checkout ---

export interface ToolCheckout {
  id: string;
  toolId: string;
  toolName: string;

  // Who checked out
  userId: string;
  userEmail: string;
  labId: string;
  labName: string;

  // Checkout details
  checkedOutAt: string;
  dueDate?: string;
  returnedAt?: string;
  status: ToolCheckoutStatus;

  // Notes
  checkoutNotes?: string;
  returnNotes?: string;
  condition?: ToolCondition;

  // Cost (calculated on return)
  billingType?: ToolBillingType;
  duration?: number;          // hours or days depending on billingType
  unitRate?: number;          // rate used (cents)
  totalCost?: number;         // calculated cost (cents)
  currency?: string;

  createdAt: string;
  updatedAt: string;
}

// --- Tool Access Log ---

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

// --- Request Types ---

export interface CreateToolData {
  name: string;
  description?: string;
  category: string;
  serialNumber?: string;
  location?: string;
  imageUrl?: string;
  // Department-level ownership
  ownershipLevel?: ToolOwnershipLevel;
  departmentId?: string;
  departmentName?: string;
  institutionId?: string;
  // Sharing settings
  isShareable?: boolean;
  sharedWithLabIds?: string[];
  sharedWithDepartmentIds?: string[];
  sharedWithInstitution?: boolean;
  requiresCheckout?: boolean;
  maxCheckoutDays?: number;
  // Pricing
  pricing?: ToolPricing;
}

export interface UpdateToolData {
  name?: string;
  description?: string;
  category?: string;
  serialNumber?: string;
  location?: string;
  imageUrl?: string;
  // Department-level ownership
  ownershipLevel?: ToolOwnershipLevel;
  departmentId?: string;
  departmentName?: string;
  institutionId?: string;
  // Sharing settings
  isShareable?: boolean;
  sharedWithLabIds?: string[];
  sharedWithDepartmentIds?: string[];
  sharedWithInstitution?: boolean;
  requiresCheckout?: boolean;
  maxCheckoutDays?: number;
  // Pricing
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

// --- Response Types ---

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

// --- Query Parameters ---

export interface ListToolsParams {
  page?: number;
  limit?: number;
  status?: ToolStatus;
  category?: string;
  search?: string;
  includeShared?: boolean;
  // Department-level filtering
  departmentId?: string;
  institutionId?: string;
  ownershipLevel?: ToolOwnershipLevel;
  includeDeptTools?: boolean;
}

export interface ListCheckoutsParams {
  page?: number;
  limit?: number;
}

// --- Tool Categories (predefined list) ---

export const TOOL_CATEGORIES = [
  'Hand Tool',
  'Power Tool',
  'Measurement',
  'Cutting',
  'Safety Equipment',
  'Cleaning',
  'Storage',
  'Electrical',
  'Optical',
  'Laboratory Equipment',
  'Other',
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];
