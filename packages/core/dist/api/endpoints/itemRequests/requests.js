"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listItemRequests = listItemRequests;
exports.createItemRequest = createItemRequest;
exports.acceptItemRequest = acceptItemRequest;
exports.denyItemRequest = denyItemRequest;
exports.fulfillItemRequest = fulfillItemRequest;
exports.cancelItemRequest = cancelItemRequest;
const responseValidation_1 = require("../../responseValidation");
async function listItemRequests(client, params) {
    const query = {};
    if (params.q)
        query.q = params.q;
    if (params.direction)
        query.direction = params.direction;
    if (params.status)
        query.status = params.status;
    if (params.page)
        query.page = params.page;
    if (params.limit)
        query.limit = params.limit;
    const response = await client.request({
        method: 'GET',
        path: '/list-item-requests',
        query,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'listItemRequests', ['requests', 'total']);
}
async function createItemRequest(client, body) {
    const response = await client.request({
        method: 'POST',
        path: '/create-item-request',
        body,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createItemRequest', ['id']);
}
async function acceptItemRequest(client, requestId) {
    const response = await client.request({
        method: 'POST',
        path: '/accept-item-request',
        body: { requestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'acceptItemRequest', ['message']);
}
async function denyItemRequest(client, requestId) {
    const response = await client.request({
        method: 'POST',
        path: '/deny-item-request',
        body: { requestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'denyItemRequest', ['message']);
}
async function fulfillItemRequest(client, requestId) {
    const response = await client.request({
        method: 'POST',
        path: '/fulfill-item-request',
        body: { requestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'fulfillItemRequest', ['message']);
}
async function cancelItemRequest(client, requestId) {
    const response = await client.request({
        method: 'POST',
        path: '/cancel-item-request',
        body: { requestId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'cancelItemRequest', ['message']);
}
//# sourceMappingURL=requests.js.map