import type { ApiClient } from '../../ApiClient';
import type { Grant, GrantTransaction, CreateGrantData, UpdateGrantData, CreateGrantTransactionData, ShippingEstimateRequest, ShippingEstimateResponse } from '../../../types/grants';
export declare function createGrant(client: ApiClient, grantData: CreateGrantData): Promise<Grant>;
export declare function updateGrant(client: ApiClient, grantId: string, grantData: UpdateGrantData): Promise<Grant>;
export declare function deleteGrant(client: ApiClient, grantId: string): Promise<void>;
export declare function createGrantTransaction(client: ApiClient, grantId: string, transactionData: CreateGrantTransactionData): Promise<GrantTransaction>;
export declare function linkGrantTag(client: ApiClient, grantId: string, tagId: string): Promise<Grant>;
export declare function estimateShipping(client: ApiClient, estimateRequest: ShippingEstimateRequest): Promise<ShippingEstimateResponse>;
//# sourceMappingURL=mutations.d.ts.map