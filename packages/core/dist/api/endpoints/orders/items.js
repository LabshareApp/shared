"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRequest = createOrderRequest;
exports.fetchOrderRequest = fetchOrderRequest;
exports.updateOrderRequest = updateOrderRequest;
exports.deleteOrderRequest = deleteOrderRequest;
exports.bulkDeleteOrderRequests = bulkDeleteOrderRequests;
exports.placeOrderRequest = placeOrderRequest;
exports.bulkPlaceOrderRequests = bulkPlaceOrderRequests;
exports.fulfillOrderRequest = fulfillOrderRequest;
exports.bulkFulfillOrderRequests = bulkFulfillOrderRequests;
const responseValidation_1 = require("../../responseValidation");
async function createOrderRequest(client, orderData) {
    const response = await client.request({
        method: 'POST',
        path: '/order-requests/insert-data',
        body: orderData,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createOrderRequest', ['id']);
}
async function fetchOrderRequest(client, orderId) {
    const order = await client.request({
        method: 'GET',
        path: '/order-requests/read-data',
        query: { id: orderId },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(order, 'fetchOrderRequest');
    const idValue = validated._id || validated.id;
    if (!idValue) {
        throw new Error(`Unexpected response format from fetchOrderRequest for order ${orderId}: Expected object with _id or id.`);
    }
    return { ...validated, id: idValue, _id: idValue };
}
async function updateOrderRequest(client, orderId, orderUpdateData) {
    await client.request({
        method: 'PUT',
        path: '/order-requests/update-data',
        query: { id: orderId },
        body: orderUpdateData,
    });
}
async function deleteOrderRequest(client, orderId) {
    await client.request({
        method: 'DELETE',
        path: '/order-requests/delete-data',
        query: { id: orderId },
    });
}
async function bulkDeleteOrderRequests(client, orderIds) {
    const response = await client.request({
        method: 'POST',
        path: '/order-requests/bulk-delete-data',
        body: { orderIds },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkDeleteOrderRequests', ['deletedCount']);
}
async function placeOrderRequest(client, orderId) {
    await client.request({
        method: 'POST',
        path: '/order-requests/place',
        query: { id: orderId },
    });
}
async function bulkPlaceOrderRequests(client, orderIds) {
    await client.request({
        method: 'POST',
        path: '/order-requests/bulk-place',
        body: { orderIds },
    });
}
async function fulfillOrderRequest(client, orderId) {
    await client.request({
        method: 'POST',
        path: '/order-requests/fulfill',
        query: { id: orderId },
    });
}
async function bulkFulfillOrderRequests(client, orderIds) {
    await client.request({
        method: 'POST',
        path: '/order-requests/bulk-fulfill',
        body: { orderIds },
    });
}
//# sourceMappingURL=items.js.map