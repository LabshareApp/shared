"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTagToItem = addTagToItem;
exports.removeTagFromItem = removeTagFromItem;
exports.bulkAddTagsToItems = bulkAddTagsToItems;
exports.bulkRemoveTagsFromItems = bulkRemoveTagsFromItems;
const responseValidation_1 = require("../../responseValidation");
async function addTagToItem(client, itemId, tagId, category) {
    await client.request({
        method: 'POST',
        path: '/add-tag-to-item',
        body: { itemId, tagId, category },
    });
}
async function removeTagFromItem(client, itemId, tagId, category) {
    await client.request({
        method: 'POST',
        path: '/remove-tag-from-item',
        body: { itemId, tagId, category },
    });
}
async function bulkAddTagsToItems(client, itemIds, tagIds, category) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-add-tags',
        body: { itemIds, tagIds, category },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkAddTagsToItems', ['matchedCount', 'updatedCount']);
}
async function bulkRemoveTagsFromItems(client, itemIds, tagIds, category) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-remove-tags',
        body: { itemIds, tagIds, category },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkRemoveTagsFromItems', ['matchedCount', 'updatedCount']);
}
//# sourceMappingURL=tagging.js.map