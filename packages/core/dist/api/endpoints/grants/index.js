"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrant = createGrant;
exports.listGrants = listGrants;
exports.getGrant = getGrant;
exports.getGrantTransactions = getGrantTransactions;
exports.createGrantTransaction = createGrantTransaction;
exports.moveGrantTransaction = moveGrantTransaction;
exports.updateGrant = updateGrant;
exports.deleteGrant = deleteGrant;
exports.estimateShipping = estimateShipping;
const responseValidation_1 = require("../../responseValidation");
async function createGrant(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/grants',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createGrant', ['_id']);
}
async function listGrants(client, params = {}) {
    const response = await client.request({
        method: 'GET',
        path: '/grants',
        query: {
            ...(params.status ? { status: params.status } : {}),
            ...(params.page ? { page: String(params.page) } : {}),
            ...(params.limit ? { limit: String(params.limit) } : {}),
        },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'listGrants', ['grants', 'totalCount']);
}
async function getGrant(client, grantId) {
    const response = await client.request({
        method: 'GET',
        path: '/get-grant',
        query: { id: grantId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getGrant', ['_id']);
}
async function getGrantTransactions(client, params) {
    const response = await client.request({
        method: 'GET',
        path: '/get-grant-transactions',
        query: {
            grantId: params.grantId,
            ...(params.type ? { type: params.type } : {}),
            ...(params.page ? { page: String(params.page) } : {}),
            ...(params.limit ? { limit: String(params.limit) } : {}),
        },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getGrantTransactions', ['transactions', 'totalCount']);
}
async function createGrantTransaction(client, params) {
    const response = await client.request({
        method: 'POST',
        path: '/create-grant-transaction',
        query: { grantId: params.grantId },
        body: params.payload,
    });
    // Response is the created transaction
    return (0, responseValidation_1.validateObjectResponse)(response, 'createGrantTransaction', ['_id']);
}
async function moveGrantTransaction(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/move-grant-transaction',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'moveGrantTransaction', ['message', 'transactionId', 'fromGrantId', 'toGrantId']);
}
async function updateGrant(client, grantId, grantData) {
    const response = await client.request({
        method: 'PUT',
        path: '/update-grant',
        query: { grantId },
        body: grantData,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'updateGrant', ['grant']);
    return validated.grant;
}
async function deleteGrant(client, grantId) {
    await client.request({
        method: 'DELETE',
        path: '/delete-grant',
        query: { grantId },
    });
}
async function estimateShipping(client, estimateRequest) {
    const response = await client.request({
        method: 'POST',
        path: '/grants/estimate-shipping',
        body: estimateRequest,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'estimateShipping', ['estimates']);
}
//# sourceMappingURL=index.js.map