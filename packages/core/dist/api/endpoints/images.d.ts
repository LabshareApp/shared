import type { ApiClient } from '../ApiClient';
/**
 * Generate a presigned URL for uploading an image to S3.
 * @param client - The API client
 * @param extension - File extension (e.g., 'jpg', 'png', 'webp')
 * @returns The presigned URL and S3 object key
 */
export declare function generateImagePresignedUrl(client: ApiClient, extension?: string): Promise<{
    url: string;
    object_key: string;
}>;
/**
 * Get a presigned URL for viewing/downloading an image from S3.
 * The returned URL is valid for 15 minutes.
 */
export declare function getImageViewUrl(client: ApiClient, s3Url: string): Promise<{
    url: string;
    expiresAt: number;
}>;
/**
 * Add an image URL to an inventory item's images array.
 */
export declare function addItemImage(client: ApiClient, itemId: string, imageUrl: string): Promise<{
    message: string;
}>;
/**
 * Remove an image URL from an inventory item's images array.
 */
export declare function removeItemImage(client: ApiClient, itemId: string, imageUrl: string): Promise<{
    message: string;
}>;
/**
 * Add an image URL to an order request's images array.
 */
export declare function addOrderRequestImage(client: ApiClient, orderRequestId: string, imageUrl: string): Promise<{
    message: string;
}>;
/**
 * Remove an image URL from an order request's images array.
 */
export declare function removeOrderRequestImage(client: ApiClient, orderRequestId: string, imageUrl: string): Promise<{
    message: string;
}>;
/**
 * Add a quote URL to an inventory item's quotes array.
 */
export declare function addItemQuote(client: ApiClient, itemId: string, quoteUrl: string): Promise<{
    message: string;
}>;
/**
 * Remove a quote URL from an inventory item's quotes array.
 */
export declare function removeItemQuote(client: ApiClient, itemId: string, quoteUrl: string): Promise<{
    message: string;
}>;
/**
 * Add a quote URL to an order request's quotes array.
 */
export declare function addOrderRequestQuote(client: ApiClient, orderRequestId: string, quoteUrl: string): Promise<{
    message: string;
}>;
/**
 * Remove a quote URL from an order request's quotes array.
 */
export declare function removeOrderRequestQuote(client: ApiClient, orderRequestId: string, quoteUrl: string): Promise<{
    message: string;
}>;
//# sourceMappingURL=images.d.ts.map