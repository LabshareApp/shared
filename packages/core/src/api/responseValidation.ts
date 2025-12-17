import type { InventoryItem, PaginatedSearchResult } from '../types/inventory';

export type PaginatedInventoryResponse = PaginatedSearchResult<
  Omit<InventoryItem, 'id'> & { _id?: string; id?: string }
>;

export function validateArrayResponse<T>(response: any, functionName: string): T[] {
  if (!Array.isArray(response)) {
    throw new Error(`Unexpected response format from ${functionName}: Expected array.`);
  }
  return response;
}

export function validateObjectResponse<T>(response: any, functionName: string): T;
export function validateObjectResponse<T>(
  response: any,
  functionName: string,
  requiredFields: (keyof T)[]
): T;
export function validateObjectResponse<T>(
  response: any,
  functionName: string,
  requiredFields: (keyof T)[] = []
): T {
  if (typeof response !== 'object' || response === null) {
    throw new Error(`Unexpected response format from ${functionName}: Expected object.`);
  }
  for (const field of requiredFields) {
    if (!(field in response)) {
      throw new Error(`Incomplete response from ${functionName}. Missing '${String(field)}'.`);
    }
  }
  return response;
}

export function validatePaginatedResponse(
  response: any,
  functionName: string
): PaginatedInventoryResponse {
  if (!response || !Array.isArray(response.items) || typeof response.totalCount !== 'number') {
    throw new Error(`Unexpected response format from ${functionName}: Expected paginated structure.`);
  }
  return response as PaginatedInventoryResponse;
}

export function mapInventoryItems(items: PaginatedInventoryResponse['items']): InventoryItem[] {
  return items.map((item: any) => {
    const idValue = item?._id || item?.id;
    if (!idValue) return { ...item } as InventoryItem;
    return { ...item, _id: idValue, id: idValue } as InventoryItem;
  });
}

