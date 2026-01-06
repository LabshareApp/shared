"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCollaboratorItems = searchCollaboratorItems;
exports.searchCollaboratorItemsWithFilters = searchCollaboratorItemsWithFilters;
exports.filterCollaboratorItems = filterCollaboratorItems;
const responseValidation_1 = require("../../responseValidation");
// Check if we're in development mode
// @ts-ignore - __DEV__ is a global defined by React Native/Metro bundler
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : (typeof process !== 'undefined' && ((_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) === 'development');
// Legacy GET endpoint (backward compatibility)
async function searchCollaboratorItems(client, params, signal) {
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
        signal, // Add signal support
    });
    if (isDev) {
        console.log('[searchCollaboratorItems] Raw response:', response);
    }
    // Ensure items is always an array, even if backend returns null
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'searchCollaboratorItems', ['items', 'totalCount']);
    // Handle null items array
    if (!validated.items || !Array.isArray(validated.items)) {
        if (isDev) {
            console.warn('[searchCollaboratorItems] Items is not an array, defaulting to empty array:', validated.items);
        }
        validated.items = [];
    }
    // Ensure totalCount is a number
    if (typeof validated.totalCount !== 'number') {
        validated.totalCount = validated.items.length;
    }
    return validated;
}
// New POST endpoint with SearchRequest
async function searchCollaboratorItemsWithFilters(client, searchRequest, page = 1, limit = 20, sortBy = 'name', sortDirection = 'asc', signal) {
    const queryParams = {
        page,
        limit,
        sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
        sortDirection,
    };
    const response = await client.request({
        method: 'POST',
        path: '/search-collaborator-items',
        body: searchRequest,
        query: queryParams,
        signal,
    });
    if (isDev) {
        console.log('[searchCollaboratorItemsWithFilters] Raw response:', response);
    }
    // Ensure items is always an array
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'searchCollaboratorItemsWithFilters', ['items', 'totalCount']);
    if (!validated.items || !Array.isArray(validated.items)) {
        validated.items = [];
    }
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