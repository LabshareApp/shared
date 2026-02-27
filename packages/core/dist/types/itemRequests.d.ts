export interface ContactInfo {
    phone?: string;
    email?: string;
    name?: string;
    role?: string;
}
export interface ItemRequest {
    id: string;
    itemId: string;
    itemName: string;
    quantity: number;
    brandName: string;
    status: 'pending' | 'accepted' | 'fulfilled';
    requestingLabId: string;
    requestingLabName?: string;
    recipientLabId: string;
    recipientLabName?: string;
    requestedByUserId?: string;
    requestedByUserName?: string;
    acceptedByUserId?: string;
    fulfilledByUserId?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    recipientContact?: ContactInfo;
    requestingContact?: ContactInfo;
}
export interface ListItemRequestsResponse {
    total: number;
    requests: ItemRequest[];
}
export interface CreateItemRequestRequest {
    itemId: string;
    itemName: string;
    quantity: number;
    brandName: string;
    recipientLabId: string;
    notes?: string;
}
export interface CreateItemRequestResponse {
    id: string;
}
//# sourceMappingURL=itemRequests.d.ts.map