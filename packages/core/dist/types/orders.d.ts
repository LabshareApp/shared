export type OrderRequestStatus = 'current' | 'placed' | 'archived';
export type UrgencyLevel = 'high' | 'medium' | 'low';
export interface OrderRequest {
    _id: string;
    id?: string;
    name: string;
    catalog_number?: string;
    brand?: string;
    quantity: number;
    units: string;
    urgency: UrgencyLevel;
    price?: {
        amount: number;
        currency: string;
    };
    vendor?: string;
    created_at: string;
    placed_at?: string;
    archived_at?: string;
    notes?: string;
    grantTags?: string[];
    locationTags?: string[];
    labelTags?: string[];
    customFields?: Record<string, any>;
    userId?: string;
    labId: string;
    updatedAt: string;
}
export interface CreateOrderRequestData {
    name: string;
    catalog_number: string;
    brand?: string;
    quantity: number;
    units: string;
    urgency: UrgencyLevel;
    price?: {
        amount: number;
        currency: string;
    };
    notes?: string;
    grantTags?: string[];
    locationTags?: string[];
    labelTags?: string[];
    customFields?: Record<string, any>;
    userId?: string;
}
export interface OrderSearchRequest {
    status?: OrderRequestStatus;
    query?: {
        operation: 'AND' | 'OR';
        filters?: any[];
        groups?: any[];
    };
    globalSearchTerm?: string;
}
//# sourceMappingURL=orders.d.ts.map