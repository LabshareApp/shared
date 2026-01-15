import type { ApiClient } from '../../ApiClient';
/**
 * Generate a presigned URL for uploading a document to S3.
 */
export declare function generateInventoryDocumentPresignedUrl(client: ApiClient): Promise<{
    url: string;
    object_key: string;
}>;
/**
 * Get a presigned URL for viewing/downloading a document from S3.
 * The returned URL is valid for 15 minutes.
 */
export declare function getInventoryDocumentViewUrl(client: ApiClient, s3Url: string): Promise<{
    url: string;
    expiresAt: number;
}>;
/**
 * Add a document URL to an inventory item's documents array.
 */
export declare function addInventoryDocument(client: ApiClient, itemId: string, documentUrl: string): Promise<{
    message: string;
    id: string;
}>;
/**
 * Remove a document URL from an inventory item's documents array.
 */
export declare function removeInventoryDocument(client: ApiClient, itemId: string, documentUrl: string): Promise<{
    message: string;
    id: string;
}>;
//# sourceMappingURL=documents.d.ts.map