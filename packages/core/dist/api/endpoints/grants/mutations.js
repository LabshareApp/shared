"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrant = createGrant;
exports.updateGrant = updateGrant;
exports.deleteGrant = deleteGrant;
exports.createGrantTransaction = createGrantTransaction;
exports.linkGrantTag = linkGrantTag;
exports.estimateShipping = estimateShipping;
const responseValidation_1 = require("../../responseValidation");
function normalizeGrant(grant) {
    const idValue = (grant === null || grant === void 0 ? void 0 : grant._id) || (grant === null || grant === void 0 ? void 0 : grant.id);
    if (!idValue)
        return grant;
    return { ...grant, _id: idValue, id: idValue };
}
async function createGrant(client, grantData) {
    // Backend returns the grant object directly, not wrapped in { grant: ... }
    const response = await client.request({
        method: 'POST',
        path: '/grants',
        body: grantData,
    });
    // Response is the grant object directly
    return normalizeGrant(response);
}
async function updateGrant(client, grantId, grantData) {
    if (!grantId) {
        throw new Error('Grant ID is required');
    }
    const response = await client.request({
        method: 'PUT',
        path: '/update-grant',
        query: { id: String(grantId) },
        body: grantData,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'updateGrant', ['grant']);
    return normalizeGrant(validated.grant);
}
async function deleteGrant(client, grantId) {
    if (!grantId) {
        throw new Error('Grant ID is required');
    }
    await client.request({
        method: 'DELETE',
        path: '/delete-grant',
        query: { id: String(grantId) },
    });
}
async function createGrantTransaction(client, grantId, transactionData) {
    const response = await client.request({
        method: 'POST',
        path: '/create-grant-transaction',
        query: { grantId },
        body: transactionData,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'createGrantTransaction', ['transaction']);
    return validated.transaction;
}
async function linkGrantTag(client, grantId, tagId) {
    const response = await client.request({
        method: 'POST',
        path: '/link-grant-tag',
        query: { grantId },
        body: { tagId },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'linkGrantTag', ['grant']);
    return normalizeGrant(validated.grant);
}
async function estimateShipping(client, estimateRequest) {
    const response = await client.request({
        method: 'POST',
        path: '/grants/estimate-shipping',
        body: estimateRequest,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'estimateShipping', ['estimates']);
}
//# sourceMappingURL=mutations.js.map