import type { InventoryItem, PaginatedSearchResult } from '../types/inventory';
export type PaginatedInventoryResponse = PaginatedSearchResult<Omit<InventoryItem, 'id'> & {
    _id?: string;
    id?: string;
}>;
export declare function validateArrayResponse<T>(response: any, functionName: string): T[];
export declare function validateObjectResponse<T>(response: any, functionName: string): T;
export declare function validateObjectResponse<T>(response: any, functionName: string, requiredFields: (keyof T)[]): T;
export declare function validatePaginatedResponse(response: any, functionName: string): PaginatedInventoryResponse;
export declare function mapInventoryItems(items: PaginatedInventoryResponse['items']): InventoryItem[];
//# sourceMappingURL=responseValidation.d.ts.map