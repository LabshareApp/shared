"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInventory = searchInventory;
const responseValidation_1 = require("../../responseValidation");
async function searchInventory(client, searchRequest, page = 1, limit = 20, sortBy = 'name', sortDirection = 'asc') {
    const queryParams = {
        page,
        limit,
        sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
        sortDirection,
    };
    const response = await client.request({
        method: 'POST',
        path: '/search',
        body: searchRequest,
        query: queryParams,
    });
    const validatedResponse = (0, responseValidation_1.validatePaginatedResponse)(response, 'searchInventory');
    const items = (0, responseValidation_1.mapInventoryItems)(validatedResponse.items);
    return { items, totalCount: validatedResponse.totalCount };
}
//# sourceMappingURL=search.js.map