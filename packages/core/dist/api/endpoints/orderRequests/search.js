"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchOrderRequests = searchOrderRequests;
const responseValidation_1 = require("../../responseValidation");
function normalize(item) {
    const idValue = (item === null || item === void 0 ? void 0 : item._id) || (item === null || item === void 0 ? void 0 : item.id);
    if (!idValue)
        return item;
    return { ...item, _id: idValue, id: idValue };
}
async function searchOrderRequests(client, searchRequest, page = 1, limit = 20, sortBy = 'name', sortDirection = 'asc', signal) {
    var _a;
    const queryParams = {
        page,
        limit,
        sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
        sortDirection,
    };
    const response = await client.request({
        method: 'POST',
        path: '/search-requests',
        body: searchRequest,
        query: queryParams,
        signal, // Add signal support
    });
    const validated = (0, responseValidation_1.validatePaginatedResponse)(response, 'searchOrderRequests');
    return { items: ((_a = validated.items) !== null && _a !== void 0 ? _a : []).map(normalize), totalCount: validated.totalCount };
}
//# sourceMappingURL=search.js.map