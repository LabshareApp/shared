"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkAddTagsToOrderRequests = bulkAddTagsToOrderRequests;
exports.bulkRemoveTagsFromOrderRequests = bulkRemoveTagsFromOrderRequests;
const responseValidation_1 = require("../../responseValidation");
async function bulkAddTagsToOrderRequests(client, orderRequestIds, tagIds, category) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-attach-tags-to-requests',
        body: {
            orderRequestIds,
            tagIds,
            category,
        },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'bulkAddTagsToOrderRequests');
    return {
        matchedCount: validated.matchedCount || 0,
        updatedCount: validated.modifiedCount || 0,
    };
}
async function bulkRemoveTagsFromOrderRequests(client, orderRequestIds, tagIds, category) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-detach-tags-from-requests',
        body: {
            orderRequestIds,
            tagIds,
            category,
        },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'bulkRemoveTagsFromOrderRequests');
    return {
        matchedCount: validated.matchedCount || 0,
        updatedCount: validated.modifiedCount || 0,
    };
}
//# sourceMappingURL=tagging.js.map