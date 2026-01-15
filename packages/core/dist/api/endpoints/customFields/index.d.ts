import type { ApiClient } from '../../ApiClient';
import type { CustomFieldDefinition, CreateCustomFieldData, UpdateCustomFieldData, CustomFieldAppliesTo } from '../../../types/customFields';
/**
 * Fetch all custom field definitions for the authenticated lab.
 * Optionally filter by entity type (inventory or orderRequest).
 */
export declare function fetchCustomFieldDefinitions(client: ApiClient, appliesTo?: CustomFieldAppliesTo): Promise<CustomFieldDefinition[]>;
/**
 * Fetch a single custom field definition by ID.
 */
export declare function fetchCustomFieldDefinition(client: ApiClient, id: string): Promise<CustomFieldDefinition>;
/**
 * Create a new custom field definition.
 */
export declare function createCustomFieldDefinition(client: ApiClient, data: CreateCustomFieldData): Promise<CustomFieldDefinition>;
/**
 * Update an existing custom field definition.
 */
export declare function updateCustomFieldDefinition(client: ApiClient, id: string, data: UpdateCustomFieldData): Promise<CustomFieldDefinition>;
/**
 * Delete a custom field definition.
 * This also cascades deletion to remove field values from all items/order requests.
 */
export declare function deleteCustomFieldDefinition(client: ApiClient, id: string): Promise<void>;
/**
 * Reorder custom field definitions.
 * The orderedIds array determines the new display order.
 */
export declare function reorderCustomFieldDefinitions(client: ApiClient, orderedIds: string[]): Promise<void>;
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
export declare function generateCustomFieldFilePresignedUrl(client: ApiClient, fileType: CustomFieldFileType, fieldName: string, extension: string): Promise<{
    url: string;
    object_key: string;
}>;
/**
 * Get a presigned URL for viewing/downloading a custom field file.
 * The returned URL is valid for 15 minutes.
 *
 * @param client - The API client
 * @param s3Url - The S3 URL of the file
 * @param fileType - Optional file type hint ('image', 'pdf', or 'excel')
 * @returns The presigned view URL and expiration timestamp
 */
export declare function getCustomFieldFileViewUrl(client: ApiClient, s3Url: string, fileType?: CustomFieldFileType): Promise<{
    url: string;
    expiresAt: number;
}>;
//# sourceMappingURL=index.d.ts.map