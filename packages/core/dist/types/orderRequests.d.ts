import type { TagCategory } from './inventory';
export type OrderRequestStatus = 'pending' | 'placed' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';
export type OrderRequestUrgency = 'high' | 'medium' | 'low';
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
    customFields?: {
        [key: string]: any;
    };
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
    customFields?: {
        [key: string]: any;
    };
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
    locationTags?: string[];
}
export interface BulkOrderRequestTagPayload {
    orderRequestIds: string[];
    tagIds: string[];
    category: TagCategory;
}
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
export interface BulkPlaceOrdersPayload {
    orders: {
        orderRequestId: string;
        unitCost?: number;
        shippingCost?: number;
        currency?: string;
    }[];
}
//# sourceMappingURL=orderRequests.d.ts.map