export type GrantStatus = 'active' | 'closed' | 'archived';
export type GrantTransactionType = 'purchase' | 'shipping' | 'adjustment';
export interface MoneyAmount {
    amount: number;
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
}
export type CreateGrantData = CreateGrantRequest;
export interface UpdateGrantData extends Partial<CreateGrantRequest> {
    status?: GrantStatus;
}
export type CreateGrantTransactionData = CreateGrantTransactionRequest;
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
export type ListGrantsResponse = GrantListResponse;
export type ListGrantTransactionsResponse = GrantTransactionsResponse;
export interface ListGrantItemsResponse {
    items: any[];
    totalCount: number;
}
//# sourceMappingURL=grants.d.ts.map