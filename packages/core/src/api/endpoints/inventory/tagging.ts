import type { ApiClient } from '../../ApiClient';
import type { BulkTagResponse, TagCategory } from '../../../types/inventory';
import { validateObjectResponse } from '../../responseValidation';

export async function addTagToItem(
  client: ApiClient,
  itemId: string,
  tagId: string,
  category: TagCategory
): Promise<void> {
  await client.request<any>({
    method: 'POST',
    path: '/add-tag-to-item',
    body: { itemId, tagId, category },
  });
}

export async function removeTagFromItem(
  client: ApiClient,
  itemId: string,
  tagId: string,
  category: TagCategory
): Promise<void> {
  await client.request<any>({
    method: 'POST',
    path: '/remove-tag-from-item',
    body: { itemId, tagId, category },
  });
}

export async function bulkAddTagsToItems(
  client: ApiClient,
  itemIds: string[],
  tagIds: string[],
  category: TagCategory
): Promise<BulkTagResponse> {
  const response = await client.request<BulkTagResponse>({
    method: 'POST',
    path: '/bulk-add-tags',
    body: { itemIds, tagIds, category },
  });
  return validateObjectResponse(
    response,
    'bulkAddTagsToItems',
    ['matchedCount', 'updatedCount']
  ) as BulkTagResponse;
}

export async function bulkRemoveTagsFromItems(
  client: ApiClient,
  itemIds: string[],
  tagIds: string[],
  category: TagCategory
): Promise<BulkTagResponse> {
  const response = await client.request<BulkTagResponse>({
    method: 'POST',
    path: '/bulk-remove-tags',
    body: { itemIds, tagIds, category },
  });

  return validateObjectResponse(
    response,
    'bulkRemoveTagsFromItems',
    ['matchedCount', 'updatedCount']
  ) as BulkTagResponse;
}

