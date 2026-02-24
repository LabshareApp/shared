import type { ApiClient } from '../../ApiClient';
import type {
  CustomFieldDefinition,
  CreateCustomFieldData,
  UpdateCustomFieldData,
  CustomFieldAppliesTo,
} from '../../../types/customFields';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

/**
 * Fetch all custom field definitions for the authenticated lab.
 * Optionally filter by entity type (inventory or orderRequest).
 */
export async function fetchCustomFieldDefinitions(
  client: ApiClient,
  appliesTo?: CustomFieldAppliesTo
): Promise<CustomFieldDefinition[]> {
  const query: Record<string, string> = {};
  if (appliesTo) {
    query.appliesTo = appliesTo;
  }

  const response = await client.request<CustomFieldDefinition[]>({
    method: 'GET',
    path: '/custom-fields',
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  return validateArrayResponse<CustomFieldDefinition>(response, 'fetchCustomFieldDefinitions');
}

/**
 * Fetch a single custom field definition by ID.
 */
export async function fetchCustomFieldDefinition(
  client: ApiClient,
  id: string
): Promise<CustomFieldDefinition> {
  const response = await client.request<CustomFieldDefinition>({
    method: 'GET',
    path: '/custom-field',
    query: { id },
  });

  return validateObjectResponse(response, 'fetchCustomFieldDefinition', ['id', 'name', 'valueType']) as CustomFieldDefinition;
}

/**
 * Create a new custom field definition.
 */
export async function createCustomFieldDefinition(
  client: ApiClient,
  data: CreateCustomFieldData
): Promise<CustomFieldDefinition> {
  const response = await client.request<CustomFieldDefinition>({
    method: 'POST',
    path: '/create-custom-field',
    body: data,
  });

  return validateObjectResponse(response, 'createCustomFieldDefinition', ['id', 'name', 'valueType']) as CustomFieldDefinition;
}

/**
 * Update an existing custom field definition.
 */
export async function updateCustomFieldDefinition(
  client: ApiClient,
  id: string,
  data: UpdateCustomFieldData
): Promise<CustomFieldDefinition> {
  const response = await client.request<CustomFieldDefinition>({
    method: 'PUT',
    path: '/update-custom-field',
    query: { id },
    body: data,
  });

  return validateObjectResponse(response, 'updateCustomFieldDefinition', ['id', 'name', 'valueType']) as CustomFieldDefinition;
}

/**
 * Delete a custom field definition.
 * This also cascades deletion to remove field values from all items/order requests.
 */
export async function deleteCustomFieldDefinition(
  client: ApiClient,
  id: string
): Promise<void> {
  await client.request({
    method: 'DELETE',
    path: '/delete-custom-field',
    query: { id },
  });
}

/**
 * Reorder custom field definitions.
 * The orderedIds array determines the new display order.
 */
export async function reorderCustomFieldDefinitions(
  client: ApiClient,
  orderedIds: string[]
): Promise<void> {
  await client.request({
    method: 'POST',
    path: '/reorder-custom-fields',
    body: { orderedIds },
  });
}

// ============================================================================
// Custom Field File Upload Functions
// ============================================================================

export type CustomFieldFileType = 'image' | 'pdf' | 'excel';

/**
 * Generate a presigned URL for uploading a custom field file.
 *
 * @param client - The API client
 * @param fileType - The type of file: 'image', 'pdf', or 'excel'
 * @param fieldName - The name of the custom field (used in S3 path organization)
 * @param extension - The file extension (e.g., 'jpg', 'pdf', 'xlsx')
 * @returns The presigned URL and S3 object key
 */
export async function generateCustomFieldFilePresignedUrl(
  client: ApiClient,
  fileType: CustomFieldFileType,
  fieldName: string,
  extension: string
): Promise<{ url: string; object_key: string }> {
  const path = `/generate-presigned-url/custom-field-${fileType}`;
  const query: Record<string, string> = { fieldName };

  if (extension) {
    query.ext = extension;
  }

  const response = await client.request<{ url: string; object_key: string }>({
    method: 'GET',
    path,
    query,
  });

  return validateObjectResponse(response, 'generateCustomFieldFilePresignedUrl', ['url', 'object_key']) as {
    url: string;
    object_key: string;
  };
}

/**
 * Get a presigned URL for viewing/downloading a custom field file.
 * The returned URL is valid for 15 minutes.
 *
 * @param client - The API client
 * @param s3Url - The S3 URL of the file
 * @param fileType - Optional file type hint ('image', 'pdf', or 'excel')
 * @returns The presigned view URL and expiration timestamp
 */
export async function getCustomFieldFileViewUrl(
  client: ApiClient,
  s3Url: string,
  fileType?: CustomFieldFileType
): Promise<{ url: string; expiresAt: number }> {
  const body: { s3Url: string; fileType?: string } = { s3Url };
  if (fileType) {
    body.fileType = fileType;
  }

  const response = await client.request<{ url: string; expiresAt: number }>({
    method: 'POST',
    path: '/get-custom-field-file-view-url',
    body,
  });

  return validateObjectResponse(response, 'getCustomFieldFileViewUrl', ['url', 'expiresAt']) as {
    url: string;
    expiresAt: number;
  };
}
