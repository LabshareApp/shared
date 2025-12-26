import type { ApiClient } from '../../ApiClient';
import type { BulkTagResponse, TagCategory } from '../../../types/inventory';
import { validateObjectResponse } from '../../responseValidation';

export async function bulkAddTagsToOrderRequests(
  client: ApiClient,
  orderRequestIds: string[],
  tagIds: string[],
  category: TagCategory
): Promise<BulkTagResponse> {
  const response = await client.request<any>({
    method: 'POST',
    path: '/bulk-attach-tags-to-requests',
    body: {
      orderRequestIds,
      tagIds,
      category,
    },
  });

  const validated = validateObjectResponse(response, 'bulkAddTagsToOrderRequests') as any;
  return {
    matchedCount: validated.matchedCount || 0,
    updatedCount: validated.modifiedCount || 0,
  };
}

export async function bulkRemoveTagsFromOrderRequests(
  client: ApiClient,
  orderRequestIds: string[],
  tagIds: string[],
  category: TagCategory
): Promise<BulkTagResponse> {
  const response = await client.request<any>({
    method: 'POST',
    path: '/bulk-detach-tags-from-requests',
    body: {
      orderRequestIds,
      tagIds,
      category,
    },
  });

  const validated = validateObjectResponse(response, 'bulkRemoveTagsFromOrderRequests') as any;
  return {
    matchedCount: validated.matchedCount || 0,
    updatedCount: validated.modifiedCount || 0,
  };
}



