"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRequest = createOrderRequest;
exports.updateOrderRequest = updateOrderRequest;
exports.deleteOrderRequest = deleteOrderRequest;
exports.bulkDeleteOrderRequests = bulkDeleteOrderRequests;
exports.moveOrderRequestToInventory = moveOrderRequestToInventory;
exports.bulkMoveOrderRequestsToInventory = bulkMoveOrderRequestsToInventory;
exports.placeOrderRequest = placeOrderRequest;
exports.revertPlacedOrderRequest = revertPlacedOrderRequest;
exports.bulkPlaceOrderRequests = bulkPlaceOrderRequests;
const responseValidation_1 = require("../../responseValidation");
async function createOrderRequest(client, orderRequestData) {
    const response = await client.request({
        method: 'POST',
        path: '/create-request',
        body: orderRequestData,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createOrderRequest', ['id']);
}
async function updateOrderRequest(client, orderRequestId, orderRequestUpdateData) {
    const response = await client.request({
        method: 'PUT',
        path: '/update-request',
        query: { id: orderRequestId },
        body: orderRequestUpdateData,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'updateOrderRequest', ['orderRequest']);
}
async function deleteOrderRequest(client, orderRequestId) {
    await client.request({
        method: 'DELETE',
        path: '/delete-request',
        query: { id: orderRequestId },
    });
}
async function bulkDeleteOrderRequests(client, orderRequestIds) {
    // Backend expects `ItemIDs` (capitalization) for legacy reasons.
    const response = await client.request({
        method: 'POST',
        path: '/bulk-delete-requests',
        body: { ItemIDs: orderRequestIds },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkDeleteOrderRequests', ['deletedCount']);
}
async function moveOrderRequestToInventory(client, orderRequestId, quantity, locationId) {
    const body = { orderRequestId, quantity };
    if (locationId)
        body.locationId = locationId;
    const response = await client.request({
        method: 'POST',
        path: '/move-request-to-inventory',
        body,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'moveOrderRequestToInventory', ['id']);
}
async function bulkMoveOrderRequestsToInventory(client, orderRequestIds, locationId) {
    const body = { orderRequestIds };
    if (locationId)
        body.locationId = locationId;
    const response = await client.request({
        method: 'POST',
        path: '/bulk-move-requests-to-inventory',
        body,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkMoveOrderRequestsToInventory', ['successCount', 'failureCount', 'errors']);
}
async function placeOrderRequest(client, orderRequestId) {
    const response = await client.request({
        method: 'POST',
        path: '/place-order',
        body: { orderRequestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'placeOrderRequest', ['id']);
}
async function revertPlacedOrderRequest(client, orderRequestId) {
    const response = await client.request({
        method: 'POST',
        path: '/revert-placed-order',
        body: { orderRequestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'revertPlacedOrderRequest', ['id']);
}
async function bulkPlaceOrderRequests(client, orderRequestIds) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-place-orders',
        body: { orderRequestIds },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkPlaceOrderRequests', ['successCount', 'failureCount', 'errors']);
}
//# sourceMappingURL=mutations.js.map