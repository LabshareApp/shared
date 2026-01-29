// Shared grant domain types for client usage.
// Mirrors backend models in server/shared/domain/models/grant.go and GRANT_TRANSACTIONS_CLIENT_GUIDE.

export type GrantStatus = 'active' | 'closed' | 'archived';

export type GrantTransactionType = 'purchase' | 'shipping' | 'adjustment' | 'odc';

// ODC (Other Direct Costs) category types
export type OdcCategory =
  | 'consultant'
  | 'subaward'
  | 'equipment'
  | 'travel'
  | 'participant'
  | 'publication'
  | 'tuition'
  | 'maintenance'
  | 'software'
  | 'subscription'
  | 'animal_care'
  | 'human_subjects'
  | 'fees'
  | 'other';

export interface OdcCategoryOption {
  value: OdcCategory;
  label: string;
}

export interface OdcCategoriesResponse {
  categories: OdcCategoryOption[];
}

export interface MoneyAmount {
  amount: number; // in cents
  currency: string;
}

export interface Grant {
  _id: string;
  name: string;
  description?: string;
  labId: string;
  userId?: string;

  totalBudget: MoneyAmount;
  spentAmount: MoneyAmount;

  grantNumber?: string;
  startDate?: string | null;
  endDate?: string | null;
  status: GrantStatus;

  // Link to grant tag (one-to-one)
  tagId: string;

  createdAt: string;
  updatedAt: string;
}

export interface GrantTransaction {
  _id: string;
  grantId: string;
  labId: string;
  type: GrantTransactionType;
  amount: MoneyAmount;

  itemId?: string;
  orderRequestId?: string;

  shippingCost?: MoneyAmount;
  shippingMethod?: string;

  // ODC-specific fields
  odcCategory?: OdcCategory;
  vendor?: string;
  invoiceNumber?: string;
  transactionDate?: string;

  description?: string;
  notes?: string;
  userId?: string;

  createdAt: string;
}

export interface GrantListResponse {
  grants: Grant[];
  totalCount: number;
}

export interface GrantTransactionsResponse {
  transactions: GrantTransaction[];
  totalCount: number;
}

export interface MoveGrantTransactionRequest {
  transactionId: string;
  targetGrantId: string;
}

export interface CreateGrantRequest {
  name: string;
  description?: string;
  grantNumber?: string;
  startDate?: string | null;
  endDate?: string | null;
  totalBudget: MoneyAmount;
}

export interface UpdateGrantRequest {
  name?: string;
  description?: string;
  grantNumber?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: GrantStatus;
  totalBudget?: MoneyAmount;
}

export interface CreateGrantTransactionRequest {
  type: GrantTransactionType;
  amount: MoneyAmount;
  description?: string;
  notes?: string;
  itemId?: string;
  orderRequestId?: string;
  shippingCost?: MoneyAmount;
  shippingMethod?: string;
  // ODC-specific fields
  odcCategory?: OdcCategory;
  vendor?: string;
  invoiceNumber?: string;
  transactionDate?: string;
}

// ---------------------------------------------------------------------------
// Backwards-compatible aliases for older grant endpoint types
// ---------------------------------------------------------------------------

// Older code (and generated d.ts files) refer to CreateGrantData / UpdateGrantData /
// CreateGrantTransactionData. Keep them as aliases over the canonical request types.

export type CreateGrantData = CreateGrantRequest;

export interface UpdateGrantData extends Partial<CreateGrantRequest> {
  status?: GrantStatus;
}

export type CreateGrantTransactionData = CreateGrantTransactionRequest;

// ---------------------------------------------------------------------------
// Shipping estimate types used by grant + order request UIs
// ---------------------------------------------------------------------------

export interface ShippingEstimate {
  method: string;
  estimatedDays: number;
  cost: MoneyAmount;
}

export interface ShippingEstimateRequest {
  to: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  itemIds?: string[];
}

export interface ShippingEstimateResponse {
  estimates: ShippingEstimate[];
}

// ---------------------------------------------------------------------------
// Legacy list response aliases used by older endpoints
// ---------------------------------------------------------------------------

export type ListGrantsResponse = GrantListResponse;
export type ListGrantTransactionsResponse = GrantTransactionsResponse;

export interface ListGrantItemsResponse {
  items: any[];
  totalCount: number;
}

