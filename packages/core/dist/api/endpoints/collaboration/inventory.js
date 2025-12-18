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
    return (0, responseValidation_1.validateObjectResponse)(response, 'searchCollaboratorItems', ['items', 'totalCount']);
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