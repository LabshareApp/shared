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
  locationTags?: string[]; // Optional: allows modifying locations when re-requesting
}

export interface BulkOrderRequestTagPayload {
  orderRequestIds: string[];
  tagIds: string[];
  category: TagCategory;
}

// Payload for placing a single order request with cost information.
// Matches backend /place-order expectations from GRANT_TRANSACTIONS_CLIENT_GUIDE.
export interface PlaceOrderPayload {
  orderRequestId: string;
  /**
   * Cost per unit in cents. Required for grant transaction creation.
   */
  unitCost?: number;
  /**
   * Optional shipping cost in cents.
   */
  shippingCost?: number;
  /**
   * Optional currency code, defaults to USD on the backend.
   */
  currency?: string;
}

// Payload for bulk placing multiple order requests with per-order cost info.
// Mirrors backend /bulk-place-orders: { orders: [{ orderRequestId, unitCost?, shippingCost?, currency? }] }
export interface BulkPlaceOrdersPayload {
  orders: {
    orderRequestId: string;
    unitCost?: number;
    shippingCost?: number;
    currency?: string;
  }[];
}






