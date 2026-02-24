"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryItem = createInventoryItem;
exports.fetchInventoryItem = fetchInventoryItem;
exports.updateInventoryItem = updateInventoryItem;
exports.deleteInventoryItem = deleteInventoryItem;
exports.bulkDeleteInventoryItems = bulkDeleteInventoryItems;
const responseValidation_1 = require("../../responseValidation");
async function createInventoryItem(client, itemData) {
    const response = await client.request({
        method: 'POST',
        path: '/insert-data',
        body: itemData,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createInventoryItem', ['id']);
}
async function fetchInventoryItem(client, itemId) {
    const item = await client.request({
        method: 'GET',
        path: '/read-data',
        query: { id: itemId },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(item, 'fetchInventoryItem');
    if (!validated.id) {
        throw new Error(`Unexpected response format from fetchInventoryItem for item ${itemId}: Expected object with id.`);
    }
    return validated;
}
async function updateInventoryItem(client, itemId, itemUpdateData) {
    await client.request({
        method: 'PUT',
        path: '/update-data',
        query: { id: itemId },
        body: itemUpdateData,
    });
}
async function deleteInventoryItem(client, itemId) {
    await client.request({
        method: 'DELETE',
        path: '/delete-data',
        query: { id: itemId },
    });
}
async function bulkDeleteInventoryItems(client, itemIds) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-delete-data',
        body: { itemIds },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'bulkDeleteInventoryItems', ['deletedCount']);
}
//# sourceMappingURL=items.js.map