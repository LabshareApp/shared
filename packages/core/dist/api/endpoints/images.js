"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImagePresignedUrl = generateImagePresignedUrl;
exports.getImageViewUrl = getImageViewUrl;
exports.addItemImage = addItemImage;
exports.removeItemImage = removeItemImage;
exports.addOrderRequestImage = addOrderRequestImage;
exports.removeOrderRequestImage = removeOrderRequestImage;
exports.addItemQuote = addItemQuote;
exports.removeItemQuote = removeItemQuote;
exports.addOrderRequestQuote = addOrderRequestQuote;
exports.removeOrderRequestQuote = removeOrderRequestQuote;
const responseValidation_1 = require("../responseValidation");
/**
 * Generate a presigned URL for uploading an image to S3.
 * @param client - The API client
 * @param extension - File extension (e.g., 'jpg', 'png', 'webp')
 * @returns The presigned URL and S3 object key
 */
async function generateImagePresignedUrl(client, extension = 'jpg') {
    const response = await client.request({
        method: 'GET',
        path: '/generate-presigned-url/other-image',
        query: { ext: extension },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'generateImagePresignedUrl', ['url', 'object_key']);
}
/**
 * Get a presigned URL for viewing/downloading an image from S3.
 * The returned URL is valid for 15 minutes.
 */
async function getImageViewUrl(client, s3Url) {
    const response = await client.request({
        method: 'POST',
        path: '/get-other-image-view-url',
        body: { s3Url },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getImageViewUrl', ['url', 'expiresAt']);
}
/**
 * Add an image URL to an inventory item's images array.
 */
async function addItemImage(client, itemId, imageUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/add-item-image',
        body: { itemId, imageUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'addItemImage', ['message']);
}
/**
 * Remove an image URL from an inventory item's images array.
 */
async function removeItemImage(client, itemId, imageUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/remove-item-image',
        body: { itemId, imageUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'removeItemImage', ['message']);
}
/**
 * Add an image URL to an order request's images array.
 */
async function addOrderRequestImage(client, orderRequestId, imageUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/add-order-request-image',
        body: { orderRequestId, imageUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'addOrderRequestImage', ['message']);
}
/**
 * Remove an image URL from an order request's images array.
 */
async function removeOrderRequestImage(client, orderRequestId, imageUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/remove-order-request-image',
        body: { orderRequestId, imageUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'removeOrderRequestImage', ['message']);
}
/**
 * Add a quote URL to an inventory item's quotes array.
 */
async function addItemQuote(client, itemId, quoteUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/add-item-quote',
        body: { itemId, quoteUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'addItemQuote', ['message']);
}
/**
 * Remove a quote URL from an inventory item's quotes array.
 */
async function removeItemQuote(client, itemId, quoteUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/remove-item-quote',
        body: { itemId, quoteUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'removeItemQuote', ['message']);
}
/**
 * Add a quote URL to an order request's quotes array.
 */
async function addOrderRequestQuote(client, orderRequestId, quoteUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/add-order-request-quote',
        body: { orderRequestId, quoteUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'addOrderRequestQuote', ['message']);
}
/**
 * Remove a quote URL from an order request's quotes array.
 */
async function removeOrderRequestQuote(client, orderRequestId, quoteUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/remove-order-request-quote',
        body: { orderRequestId, quoteUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'removeOrderRequestQuote', ['message']);
}
//# sourceMappingURL=images.js.map