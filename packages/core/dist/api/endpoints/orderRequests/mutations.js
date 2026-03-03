"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRequest = createOrderRequest;
exports.updateOrderRequest = updateOrderRequest;
exports.deleteOrderRequest = deleteOrderRequest;
exports.bulkDeleteOrderRequests = bulkDeleteOrderRequests;
exports.moveOrderRequestToInventory = moveOrderRequestToInventory;
exports.bulkMoveOrderRequestsToInventory = bulkMoveOrderRequestsToInventory;
exports.approveOrderRequest = approveOrderRequest;
exports.unapproveOrderRequest = unapproveOrderRequest;
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
async function deleteOrderRequest(client, orderRequestId, view) {
    await client.request({
        method: 'DELETE',
        path: '/delete-request',
        query: { id: orderRequestId, view: view !== null && view !== void 0 ? view : null },
    });
}
async function bulkDeleteOrderRequests(client, orderRequestIds, view) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-delete-requests',
        body: { itemIds: orderRequestIds, view: view !== null && view !== void 0 ? view : 'current' },
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
async function approveOrderRequest(client, orderRequestId) {
    const response = await client.request({
        method: 'POST',
        path: '/approve-order-request',
        body: { orderRequestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'approveOrderRequest', ['id']);
}
async function unapproveOrderRequest(client, orderRequestId) {
    const response = await client.request({
        method: 'POST',
        path: '/unapprove-order-request',
        body: { orderRequestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'unapproveOrderRequest', ['id']);
}
async function placeOrderRequest(client, payload) {
    const { orderRequestId, unitCost, shippingCost, currency } = payload;
    const body = { orderRequestId };
    if (typeof unitCost === 'number')
        body.unitCost = unitCost;
    if (typeof shippingCost === 'number')
        body.shippingCost = shippingCost;
    if (currency)
        body.currency = currency;
    const response = await client.request({
        method: 'POST',
        path: '/place-order',
        body,
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
async function bulkPlaceOrderRequests(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-place-orders',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkPlaceOrderRequests', ['successCount', 'failureCount', 'errors']);
}
//# sourceMappingURL=mutations.js.map