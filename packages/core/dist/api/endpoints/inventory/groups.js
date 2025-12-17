"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCustomGroups = fetchCustomGroups;
exports.fetchCustomGroup = fetchCustomGroup;
exports.createCustomGroup = createCustomGroup;
exports.deleteCustomGroup = deleteCustomGroup;
exports.updateCustomGroup = updateCustomGroup;
exports.saveUserCustomGroupOrder = saveUserCustomGroupOrder;
const responseValidation_1 = require("../../responseValidation");
async function fetchCustomGroups(client) {
    const customGroups = await client.request({
        method: 'GET',
        path: '/get-custom-groups',
    });
    return (0, responseValidation_1.validateArrayResponse)(customGroups, 'fetchCustomGroups');
}
async function fetchCustomGroup(client, groupId) {
    const customGroup = await client.request({
        method: 'GET',
        path: '/get-custom-group',
        query: { id: groupId },
    });
    return (0, responseValidation_1.validateObjectResponse)(customGroup, 'fetchCustomGroup', ['id']);
}
async function createCustomGroup(client, groupData) {
    const response = await client.request({
        method: 'POST',
        path: '/create-custom-group',
        body: groupData,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createCustomGroup', ['id']);
}
async function deleteCustomGroup(client, groupId) {
    await client.request({
        method: 'DELETE',
        path: '/delete-custom-group',
        query: { id: groupId },
    });
}
async function updateCustomGroup(client, groupUpdateData) {
    await client.request({
        method: 'PUT',
        path: '/update-custom-group',
        body: groupUpdateData,
    });
}
async function saveUserCustomGroupOrder(client, orderedIds) {
    await client.request({
        method: 'POST',
        path: '/update-user-custom-group-order',
        body: { orderedIds },
    });
}
//# sourceMappingURL=groups.js.map