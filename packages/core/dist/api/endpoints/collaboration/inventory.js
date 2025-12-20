"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCollaboratorItems = searchCollaboratorItems;
exports.filterCollaboratorItems = filterCollaboratorItems;
const responseValidation_1 = require("../../responseValidation");
async function searchCollaboratorItems(client, params) {
    const query = {};
    if (params.term)
        query.term = params.term;
    if (params.page)
        query.page = params.page;
    if (params.limit)
        query.limit = params.limit;
    if (params.labId)
        query.labId = params.labId;
    // Multi-valued query params: pass as a comma-separated string since ApiClient's query map
    // is a simple Record and Metro clients already support this pattern elsewhere.
    if (params.labIds && params.labIds.length > 0)
        query.labIds = params.labIds.join(',');
    const response = await client.request({
        method: 'GET',
        path: '/search-collaborator-items',
        query,
    });
    console.log('[searchCollaboratorItems] Raw response:', response);
    // Ensure items is always an array, even if backend returns null
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'searchCollaboratorItems', ['items', 'totalCount']);
    // Handle null items array
    if (!validated.items || !Array.isArray(validated.items)) {
        console.warn('[searchCollaboratorItems] Items is not an array, defaulting to empty array:', validated.items);
        validated.items = [];
    }
    // Ensure totalCount is a number
    if (typeof validated.totalCount !== 'number') {
        validated.totalCount = validated.items.length;
    }
    return validated;
}
async function filterCollaboratorItems(client, request) {
    const response = await client.request({
        method: 'POST',
        path: '/filter-collaborator-items',
        body: request,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'filterCollaboratorItems', ['items']);
}
//# sourceMappingURL=inventory.js.map