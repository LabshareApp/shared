// Canonical order request domain types for shared-core.

import type { TagCategory } from './inventory';

export type OrderRequestStatus =
  | 'pending'
  | 'placed'
  | 'approved'
  | 'rejected'
  | 'fulfilled'
  | 'cancelled';

export type OrderRequestUrgency = 'high' | 'medium' | 'low';

// Mirrors backend `models.OrderRequest` as consumed by clients.
export interface OrderRequestItem {
  _id: string;
  id?: string;

  name: string;
  description?: string;
  notes?: string;

  brand?: string;
  quantity?: number;
  catalog: string;
  units?: string;

  labId: string;
  userId?: string;

  createdAt: string;
  updatedAt: string;

  attributes?: {
    amountAdded?: number;
    expirationDate?: string | null;
    lotNumber?: string;
    price?: {
      amount: number;
      currency: string;
    };
  };

  customFields?: { [key: string]: any };

  locationTags?: string[];
  grantTags?: string[];
  labelTags?: string[];
  uploadedByTags?: string[];

  locationTagNames?: string[];
  grantTagNames?: string[];
  labelTagNames?: string[];
  uploadedByTagNames?: string[];

  locationTagsCount?: number;
  grantTagsCount?: number;
  labelTagsCount?: number;
  uploadedByTagsCount?: number;
  totalTagsCount?: number;

  status?: OrderRequestStatus | string;
  priority?: string;
  urgency?: OrderRequestUrgency;
  estimatedCost?: number;
  approvedBy?: string;
  approvedAt?: string;
  sourceFileKey?: string;

  [key: string]: any;
}

// Mirrors backend `models.CreateOrderRequestRequest`.
export interface CreateOrderRequestData {
  name: string;
  description?: string;
  notes?: string;
  brand?: string;
  quantity?: number;
  catalog: string;
  units?: string;
  attributes?: {
    expirationDate?: string | null;
    lotNumber?: string;
    price?: {
      amount: number;
      currency: string;
    };
  };
  customFields?: { [key: string]: any };
  locationTags?: string[];
  grantTags?: string[];
  labelTags?: string[];
  urgency?: OrderRequestUrgency;
}

export interface BulkOperationResult {
  successCount: number;
  failureCount: number;
  errors: string[];
}

export interface ReRequestOrderPayload {
  id: string;
  quantity: number;
}

export interface BulkOrderRequestTagPayload {
  orderRequestIds: string[];
  tagIds: string[];
  category: TagCategory;
}

