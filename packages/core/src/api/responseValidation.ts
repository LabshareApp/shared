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
  requiredFields: string[]
): T;
export function validateObjectResponse<T>(
  response: any,
  functionName: string,
  requiredFields: string[] = []
): T {
  if (typeof response !== 'object' || response === null) {
    throw new Error(`Unexpected response format from ${functionName}: Expected object.`);
  }
  for (const field of requiredFields) {
    if (!(field in response)) {
      throw new Error(`Incomplete response from ${functionName}. Missing '${field}'.`);
    }
    // For array fields, ensure they're arrays (not null)
    if (field === 'items' && response[field as keyof typeof response] === null) {
      response[field as keyof typeof response] = [];
    }
  }
  return response;
}

export function validatePaginatedResponse(
  response: any,
  functionName: string
): PaginatedInventoryResponse {
  // Handle both lowercase and uppercase field names (Go JSON serialization)
  const items = response?.items || response?.Items;
  const totalCount = response?.totalCount ?? response?.TotalCount;
  
  if (!response) {
    throw new Error(`Unexpected response format from ${functionName}: Response is null or undefined.`);
  }
  
  if (!Array.isArray(items)) {
    console.error(`[${functionName}] Invalid response:`, response);
    throw new Error(`Unexpected response format from ${functionName}: Expected items array. Got: ${typeof items}. Response keys: ${Object.keys(response || {}).join(', ')}`);
  }
  
  if (typeof totalCount !== 'number') {
    console.error(`[${functionName}] Invalid response:`, response);
    throw new Error(`Unexpected response format from ${functionName}: Expected totalCount number. Got: ${typeof totalCount}. Response keys: ${Object.keys(response || {}).join(', ')}`);
  }
  
  return { items, totalCount } as PaginatedInventoryResponse;
}

export function mapInventoryItems(items: PaginatedInventoryResponse['items']): InventoryItem[] {
  return items.map((item: any) => {
    const idValue = item?._id || item?.id;
    if (!idValue) return { ...item } as InventoryItem;
    return { ...item, _id: idValue, id: idValue } as InventoryItem;
  });
}

