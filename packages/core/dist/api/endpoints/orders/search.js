"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchOrderRequests = searchOrderRequests;
const responseValidation_1 = require("../../responseValidation");
function mapOrderRequests(items) {
    return items.map((item) => {
        const idValue = item._id || item.id;
        return {
            ...item,
            _id: idValue,
            id: idValue,
        };
    });
}
async function searchOrderRequests(client, searchRequest, page = 1, limit = 20, sortBy = 'name', sortDirection = 'asc') {
    const queryParams = {
        page,
        limit,
        sortBy: sortBy === 'date' ? 'created_at' : sortBy,
        sortDirection,
    };
    const response = await client.request({
        method: 'POST',
        path: '/order-requests/search',
        body: searchRequest,
        query: queryParams,
    });
    const validatedResponse = (0, responseValidation_1.validatePaginatedResponse)(response, 'searchOrderRequests');
    const items = mapOrderRequests(validatedResponse.items);
    return { items, totalCount: validatedResponse.totalCount };
}
//# sourceMappingURL=search.js.map