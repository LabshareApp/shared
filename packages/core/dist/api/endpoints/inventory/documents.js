"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInventoryDocumentPresignedUrl = generateInventoryDocumentPresignedUrl;
exports.getInventoryDocumentViewUrl = getInventoryDocumentViewUrl;
exports.addInventoryDocument = addInventoryDocument;
exports.removeInventoryDocument = removeInventoryDocument;
const responseValidation_1 = require("../../responseValidation");
/**
 * Generate a presigned URL for uploading a document to S3.
 */
async function generateInventoryDocumentPresignedUrl(client) {
    const response = await client.request({
        method: 'GET',
        path: '/generate-presigned-url/inventory-document',
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'generateInventoryDocumentPresignedUrl', [
        'url',
        'object_key',
    ]);
}
/**
 * Get a presigned URL for viewing/downloading a document from S3.
 * The returned URL is valid for 15 minutes.
 */
async function getInventoryDocumentViewUrl(client, s3Url) {
    const response = await client.request({
        method: 'POST',
        path: '/get-inventory-document-view-url',
        body: { s3Url },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getInventoryDocumentViewUrl', ['url', 'expiresAt']);
}
/**
 * Add a document URL to an inventory item's documents array.
 */
async function addInventoryDocument(client, itemId, documentUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/add-inventory-document',
        body: { itemId, documentUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'addInventoryDocument', ['message', 'id']);
}
/**
 * Remove a document URL from an inventory item's documents array.
 */
async function removeInventoryDocument(client, itemId, documentUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/remove-inventory-document',
        body: { itemId, documentUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'removeInventoryDocument', ['message', 'id']);
}
//# sourceMappingURL=documents.js.map