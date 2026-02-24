import type { InventoryItem, PaginatedSearchResult } from '../types/inventory';
export type PaginatedInventoryResponse = PaginatedSearchResult<InventoryItem>;
export declare function validateArrayResponse<T>(response: any, functionName: string): T[];
export declare function validateObjectResponse<T>(response: any, functionName: string): T;
export declare function validateObjectResponse<T>(response: any, functionName: string, requiredFields: string[]): T;
export declare function validatePaginatedResponse(response: any, functionName: string): PaginatedInventoryResponse;
export declare function mapInventoryItems(items: PaginatedInventoryResponse['items']): InventoryItem[];
/**
 * Normalize MongoDB _id to id on a response object.
 * The Go server may return _id instead of id depending on serialization.
 */
export declare function normalizeMongoId<T>(obj: T): T;
//# sourceMappingURL=responseValidation.d.ts.map