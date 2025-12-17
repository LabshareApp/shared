"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTag = createTag;
exports.createSublocation = createSublocation;
exports.fetchTags = fetchTags;
exports.fetchTagsByCategory = fetchTagsByCategory;
exports.fetchSublocations = fetchSublocations;
exports.deleteTag = deleteTag;
const inventory_1 = require("../../../types/inventory");
const responseValidation_1 = require("../../responseValidation");
async function createTag(client, tagData) {
    if (!tagData.category || typeof tagData.category !== 'string') {
        throw new Error(`createTag Error: Invalid or missing category ('${tagData.category}')`);
    }
    const newTag = await client.request({
        method: 'POST',
        path: '/add-tag',
        body: tagData,
    });
    return (0, responseValidation_1.validateObjectResponse)(newTag, 'createTag', ['id', 'name', 'category']);
}
async function createSublocation(client, sublocationData) {
    const newSublocation = await client.request({
        method: 'POST',
        path: '/add-sublocation',
        body: sublocationData,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(newSublocation, 'createSublocation', [
        'id',
        'name',
        'category',
        'isSublocation',
        'parentLocationId',
    ]);
    if (validated.category !== inventory_1.TagCategory.Location ||
        !validated.isSublocation ||
        !validated.parentLocationId) {
        throw new Error('Incomplete or invalid sublocation object received from createSublocation');
    }
    return validated;
}
async function fetchTags(client) {
    const tags = await client.request({ method: 'GET', path: '/get-tags' });
    return (0, responseValidation_1.validateArrayResponse)(tags, 'fetchTags');
}
async function fetchTagsByCategory(client, category, labId) {
    const tags = await client.request({
        method: 'GET',
        path: '/get-tags-by-category',
        query: { category, labId },
    });
    return (0, responseValidation_1.validateArrayResponse)(tags, 'fetchTagsByCategory');
}
async function fetchSublocations(client, parentLocationId) {
    const tags = await client.request({
        method: 'GET',
        path: '/get-sublocations',
        query: { parentLocationId },
    });
    return (0, responseValidation_1.validateArrayResponse)(tags, 'fetchSublocations');
}
async function deleteTag(client, tagId) {
    await client.request({
        method: 'DELETE',
        path: '/delete-tag',
        query: { id: tagId },
    });
}
//# sourceMappingURL=tags.js.map