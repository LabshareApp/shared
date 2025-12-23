// Shared grant domain types for client usage.
// Mirrors backend models in server/shared/domain/models/grant.go and GRANT_TRANSACTIONS_CLIENT_GUIDE.

export type GrantStatus = 'active' | 'closed' | 'archived';

export type GrantTransactionType = 'purchase' | 'shipping' | 'adjustment';

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

export interface CreateGrantTransactionRequest {
  type: GrantTransactionType;
  amount: MoneyAmount;
  description?: string;
  notes?: string;
  itemId?: string;
  orderRequestId?: string;
  shippingCost?: MoneyAmount;
  shippingMethod?: string;
}


