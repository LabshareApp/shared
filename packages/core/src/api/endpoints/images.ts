import type { ApiClient } from '../ApiClient';
import { validateObjectResponse } from '../responseValidation';

/**
 * Generate a presigned URL for uploading an image to S3.
 * @param client - The API client
 * @param extension - File extension (e.g., 'jpg', 'png', 'webp')
 * @returns The presigned URL and S3 object key
 */
export async function generateImagePresignedUrl(
  client: ApiClient,
  extension: string = 'jpg'
): Promise<{ url: string; object_key: string }> {
  const response = await client.request<{ url: string; object_key: string }>({
    method: 'GET',
    path: '/generate-presigned-url/other-image',
    query: { ext: extension },
  });
  return validateObjectResponse(response, 'generateImagePresignedUrl', ['url', 'object_key'] as any) as {
    url: string;
    object_key: string;
  };
}

/**
 * Get a presigned URL for viewing/downloading an image from S3.
 * The returned URL is valid for 15 minutes.
 */
export async function getImageViewUrl(
  client: ApiClient,
  s3Url: string
): Promise<{ url: string; expiresAt: number }> {
  const response = await client.request<{ url: string; expiresAt: number }>({
    method: 'POST',
    path: '/get-other-image-view-url',
    body: { s3Url },
  });
  return validateObjectResponse(response, 'getImageViewUrl', ['url', 'expiresAt'] as any) as {
    url: string;
    expiresAt: number;
  };
}

/**
 * Add an image URL to an inventory item's images array.
 */
export async function addItemImage(
  client: ApiClient,
  itemId: string,
  imageUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/add-item-image',
    body: { itemId, imageUrl },
  });
  return validateObjectResponse(response, 'addItemImage', ['message'] as any) as { message: string };
}

/**
 * Remove an image URL from an inventory item's images array.
 */
export async function removeItemImage(
  client: ApiClient,
  itemId: string,
  imageUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/remove-item-image',
    body: { itemId, imageUrl },
  });
  return validateObjectResponse(response, 'removeItemImage', ['message'] as any) as { message: string };
}

/**
 * Add an image URL to an order request's images array.
 */
export async function addOrderRequestImage(
  client: ApiClient,
  orderRequestId: string,
  imageUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/add-order-request-image',
    body: { orderRequestId, imageUrl },
  });
  return validateObjectResponse(response, 'addOrderRequestImage', ['message'] as any) as { message: string };
}

/**
 * Remove an image URL from an order request's images array.
 */
export async function removeOrderRequestImage(
  client: ApiClient,
  orderRequestId: string,
  imageUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/remove-order-request-image',
    body: { orderRequestId, imageUrl },
  });
  return validateObjectResponse(response, 'removeOrderRequestImage', ['message'] as any) as { message: string };
}

/**
 * Add a quote URL to an inventory item's quotes array.
 */
export async function addItemQuote(
  client: ApiClient,
  itemId: string,
  quoteUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/add-item-quote',
    body: { itemId, quoteUrl },
  });
  return validateObjectResponse(response, 'addItemQuote', ['message'] as any) as { message: string };
}

/**
 * Remove a quote URL from an inventory item's quotes array.
 */
export async function removeItemQuote(
  client: ApiClient,
  itemId: string,
  quoteUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/remove-item-quote',
    body: { itemId, quoteUrl },
  });
  return validateObjectResponse(response, 'removeItemQuote', ['message'] as any) as { message: string };
}

/**
 * Add a quote URL to an order request's quotes array.
 */
export async function addOrderRequestQuote(
  client: ApiClient,
  orderRequestId: string,
  quoteUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/add-order-request-quote',
    body: { orderRequestId, quoteUrl },
  });
  return validateObjectResponse(response, 'addOrderRequestQuote', ['message'] as any) as { message: string };
}

/**
 * Remove a quote URL from an order request's quotes array.
 */
export async function removeOrderRequestQuote(
  client: ApiClient,
  orderRequestId: string,
  quoteUrl: string
): Promise<{ message: string }> {
  const response = await client.request<{ message: string }>({
    method: 'POST',
    path: '/remove-order-request-quote',
    body: { orderRequestId, quoteUrl },
  });
  return validateObjectResponse(response, 'removeOrderRequestQuote', ['message'] as any) as { message: string };
}
