import type { ApiClient } from '../../ApiClient';
import { validateObjectResponse } from '../../responseValidation';

/**
 * Generate a presigned URL for uploading a document to S3.
 */
export async function generateInventoryDocumentPresignedUrl(
  client: ApiClient
): Promise<{ url: string; object_key: string }> {
  const response = await client.request<{ url: string; object_key: string }>({
    method: 'GET',
    path: '/generate-presigned-url/inventory-document',
  });
  return validateObjectResponse(response, 'generateInventoryDocumentPresignedUrl', [
    'url',
    'object_key',
  ] as any) as { url: string; object_key: string };
}

/**
 * Get a presigned URL for viewing/downloading a document from S3.
 * The returned URL is valid for 15 minutes.
 */
export async function getInventoryDocumentViewUrl(
  client: ApiClient,
  s3Url: string
): Promise<{ url: string; expiresAt: number }> {
  const response = await client.request<{ url: string; expiresAt: number }>({
    method: 'POST',
    path: '/get-inventory-document-view-url',
    body: { s3Url },
  });
  return validateObjectResponse(response, 'getInventoryDocumentViewUrl', ['url', 'expiresAt'] as any) as {
    url: string;
    expiresAt: number;
  };
}

/**
 * Add a document URL to an inventory item's documents array.
 */
export async function addInventoryDocument(
  client: ApiClient,
  itemId: string,
  documentUrl: string
): Promise<{ message: string; id: string }> {
  const response = await client.request<{ message: string; id: string }>({
    method: 'POST',
    path: '/add-inventory-document',
    body: { itemId, documentUrl },
  });
  return validateObjectResponse(response, 'addInventoryDocument', ['message', 'id'] as any) as {
    message: string;
    id: string;
  };
}

/**
 * Remove a document URL from an inventory item's documents array.
 */
export async function removeInventoryDocument(
  client: ApiClient,
  itemId: string,
  documentUrl: string
): Promise<{ message: string; id: string }> {
  const response = await client.request<{ message: string; id: string }>({
    method: 'POST',
    path: '/remove-inventory-document',
    body: { itemId, documentUrl },
  });
  return validateObjectResponse(response, 'removeInventoryDocument', ['message', 'id'] as any) as {
    message: string;
    id: string;
  };
}
