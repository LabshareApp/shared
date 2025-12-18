import type { ApiClient } from '../../ApiClient';
import {
  TagCategory,
  type BackendTag,
  type CreateSublocationData,
  type CreateTagData,
  type TagCategory as TagCategoryType,
} from '../../../types/inventory';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

export async function createTag(client: ApiClient, tagData: CreateTagData): Promise<BackendTag> {
  if (!tagData.category || typeof tagData.category !== 'string') {
    throw new Error(`createTag Error: Invalid or missing category ('${(tagData as any).category}')`);
  }

  const newTag = await client.request<BackendTag>({
    method: 'POST',
    path: '/add-tag',
    body: tagData,
  });

  return validateObjectResponse(newTag, 'createTag', ['id', 'name', 'category'] as any);
}

export async function createSublocation(
  client: ApiClient,
  sublocationData: CreateSublocationData
): Promise<BackendTag> {
  const newSublocation = await client.request<BackendTag>({
    method: 'POST',
    path: '/add-sublocation',
    body: sublocationData,
  });

  const validated = validateObjectResponse(newSublocation, 'createSublocation', [
    'id',
    'name',
    'category',
    'isSublocation',
    'parentLocationId',
  ] as any) as any;

  if (
    validated.category !== TagCategory.Location ||
    !validated.isSublocation ||
    !validated.parentLocationId
  ) {
    throw new Error('Incomplete or invalid sublocation object received from createSublocation');
  }

  return validated as BackendTag;
}

export async function fetchTags(client: ApiClient): Promise<BackendTag[]> {
  const tags = await client.request<BackendTag[]>({ method: 'GET', path: '/get-tags' });
  return validateArrayResponse<BackendTag>(tags, 'fetchTags');
}

export async function deleteTag(client: ApiClient, tagId: string): Promise<void> {
  await client.request<any>({
    method: 'DELETE',
    path: '/delete-tag',
    query: { id: tagId },
  });
}

export async function fetchTagsByCategory(
  client: ApiClient,
  category: TagCategoryType,
  labId: string
): Promise<BackendTag[]> {
  const tags = await client.request<BackendTag[]>({
    method: 'GET',
    path: '/get-tags-by-category',
    query: { category, labId },
  });
  return validateArrayResponse<BackendTag>(tags, 'fetchTagsByCategory');
}

export async function fetchSublocations(
  client: ApiClient,
  parentLocationId: string
): Promise<BackendTag[]> {
  const tags = await client.request<BackendTag[]>({
    method: 'GET',
    path: '/get-sublocations',
    query: { parentLocationId },
  });
  return validateArrayResponse<BackendTag>(tags, 'fetchSublocations');
}

