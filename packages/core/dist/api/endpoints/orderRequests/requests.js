"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOrderRequests = fetchOrderRequests;
exports.fetchOrderRequest = fetchOrderRequest;
exports.fetchArchivedOrderRequest = fetchArchivedOrderRequest;
exports.fetchArchivedOrderRequests = fetchArchivedOrderRequests;
exports.reRequestArchivedOrder = reRequestArchivedOrder;
exports.generateQuotePresignedUrl = generateQuotePresignedUrl;
exports.updateOrderRequestQuote = updateOrderRequestQuote;
exports.getQuoteViewUrl = getQuoteViewUrl;
const responseValidation_1 = require("../../responseValidation");
function normalizeOrderRequest(item) {
    const idValue = (item === null || item === void 0 ? void 0 : item._id) || (item === null || item === void 0 ? void 0 : item.id);
    if (!idValue)
        return item;
    return { ...item, _id: idValue, id: idValue };
}
async function fetchOrderRequests(client, labId, view) {
    const response = await client.request({
        method: 'GET',
        path: '/list-requests',
        query: { labId, view: view !== null && view !== void 0 ? view : null },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchOrderRequests', ['orderRequests', 'totalCount']);
    const items = (0, responseValidation_1.validateArrayResponse)(validated.orderRequests, 'fetchOrderRequests.orderRequests');
    return { orderRequests: items.map(normalizeOrderRequest), totalCount: validated.totalCount };
}
async function fetchOrderRequest(client, orderRequestId) {
    const response = await client.request({
        method: 'GET',
        path: '/get-request',
        query: { id: orderRequestId },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchOrderRequest', ['orderRequest']);
    return { orderRequest: normalizeOrderRequest(validated.orderRequest) };
}
async function fetchArchivedOrderRequest(client, archivedOrderRequestId) {
    const response = await client.request({
        method: 'GET',
        path: '/get-archived-request',
        query: { id: archivedOrderRequestId },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchArchivedOrderRequest', ['orderRequest']);
    return { orderRequest: normalizeOrderRequest(validated.orderRequest) };
}
async function fetchArchivedOrderRequests(client, labId) {
    const response = await client.request({
        method: 'GET',
        path: '/list-all-archived-order-requests',
        query: { lab_id: labId },
    });
    const items = (0, responseValidation_1.validateArrayResponse)(response, 'fetchArchivedOrderRequests');
    return items.map(normalizeOrderRequest);
}
async function reRequestArchivedOrder(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/re-request-order',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'reRequestArchivedOrder', ['id']);
}
/**
 * Generate a presigned URL for uploading a quote PDF to S3.
 * This uses the OCR server (port 8080) endpoint.
 */
async function generateQuotePresignedUrl(client, itemType = 'order-request') {
    const response = await client.request({
        method: 'GET',
        path: '/generate-presigned-url/quote',
        query: { itemType },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'generateQuotePresignedUrl', ['url', 'object_key']);
}
/**
 * Update an order request with a quote URL after uploading the PDF to S3.
 */
async function updateOrderRequestQuote(client, orderRequestId, quoteUrl) {
    const response = await client.request({
        method: 'POST',
        path: '/update-order-request-quote',
        body: { orderRequestId, quoteUrl },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'updateOrderRequestQuote', ['message', 'id']);
}
/**
 * Get a presigned URL for viewing/downloading a quote PDF from S3.
 * The returned URL is valid for 15 minutes.
 */
async function getQuoteViewUrl(client, s3Url) {
    const response = await client.request({
        method: 'POST',
        path: '/get-quote-view-url',
        body: { s3Url },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getQuoteViewUrl', ['url', 'expiresAt']);
}
//# sourceMappingURL=requests.js.map