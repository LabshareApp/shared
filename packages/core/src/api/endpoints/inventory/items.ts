import type { ApiClient } from '../../ApiClient';
import type { CreateItemData, InventoryItem } from '../../../types/inventory';
import { validateObjectResponse } from '../../responseValidation';

export async function createInventoryItem(
  client: ApiClient,
  itemData: CreateItemData
): Promise<{ id: string }> {
  const response = await client.request<{ id: string; message?: string }>({
    method: 'POST',
    path: '/insert-data',
    body: itemData,
  });
  return validateObjectResponse(response, 'createInventoryItem', ['id']) as { id: string };
}

export async function fetchInventoryItem(client: ApiClient, itemId: string): Promise<InventoryItem> {
  const item = await client.request<InventoryItem>({
    method: 'GET',
    path: '/read-data',
    query: { id: itemId },
  });

  const validated = validateObjectResponse(item, 'fetchInventoryItem') as any;
  if (!validated.id) {
    throw new Error(
      `Unexpected response format from fetchInventoryItem for item ${itemId}: Expected object with id.`
    );
  }
  return validated as InventoryItem;
}

export async function updateInventoryItem(
  client: ApiClient,
  itemId: string,
  itemUpdateData: Partial<
    Pick<
      InventoryItem,
      | 'name'
      | 'brands'
      | 'totalQuantity'
      | 'units'
      | 'notes'
      | 'attributes'
      | 'customFields'
      | 'vendorTags'
      | 'locationTags'
      | 'grantTags'
      | 'labelTags'
      | 'quotes'
      | 'images'
    >
  > & {
    catalog?: string;
  }
): Promise<void> {
  await client.request<any>({
    method: 'PUT',
    path: '/update-data',
    query: { id: itemId },
    body: itemUpdateData,
  });
}

export async function deleteInventoryItem(client: ApiClient, itemId: string): Promise<void> {
  await client.request<any>({
    method: 'DELETE',
    path: '/delete-data',
    query: { id: itemId },
  });
}

export async function bulkDeleteInventoryItems(
  client: ApiClient,
  itemIds: string[]
): Promise<{ deletedCount: number }> {
  const response = await client.request<{ deletedCount: number }>({
    method: 'POST',
    path: '/bulk-delete-data',
    body: { itemIds },
  });
  return validateObjectResponse(response, 'bulkDeleteInventoryItems', ['deletedCount']) as {
    deletedCount: number;
  };
}
