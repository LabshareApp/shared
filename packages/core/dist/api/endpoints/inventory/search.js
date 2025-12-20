"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInventory = searchInventory;
const responseValidation_1 = require("../../responseValidation");
async function searchInventory(client, searchRequest, page = 1, limit = 20, sortBy = 'name', sortDirection = 'asc') {
    var _a, _b, _c;
    const queryParams = {
        page,
        limit,
        sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
        sortDirection,
    };
    console.log('[searchInventory] Request:', {
        path: '/search',
        body: JSON.stringify(searchRequest, null, 2),
        query: queryParams,
        hasGlobalSearchTerm: !!searchRequest.globalSearchTerm,
        globalSearchTerm: searchRequest.globalSearchTerm,
    });
    try {
        const response = await client.request({
            method: 'POST',
            path: '/search',
            body: searchRequest,
            query: queryParams,
        });
        console.log('[searchInventory] Raw response:', {
            type: typeof response,
            keys: response ? Object.keys(response) : [],
            hasItems: !!((response === null || response === void 0 ? void 0 : response.items) || (response === null || response === void 0 ? void 0 : response.Items)),
            itemsLength: ((response === null || response === void 0 ? void 0 : response.items) || (response === null || response === void 0 ? void 0 : response.Items) || []).length,
            totalCount: (_a = response === null || response === void 0 ? void 0 : response.totalCount) !== null && _a !== void 0 ? _a : response === null || response === void 0 ? void 0 : response.TotalCount,
            fullResponse: JSON.stringify(response, null, 2).substring(0, 500),
        });
        // Handle both possible response formats
        // Backend might return { items, totalCount } or { Items, TotalCount }
        const items = response.items || response.Items || [];
        const totalCount = (_c = (_b = response.totalCount) !== null && _b !== void 0 ? _b : response.TotalCount) !== null && _c !== void 0 ? _c : 0;
        if (!Array.isArray(items)) {
            console.error('[searchInventory] Invalid items format:', {
                items,
                itemsType: typeof items,
                responseKeys: Object.keys(response || {}),
            });
            throw new Error(`Unexpected response format from searchInventory: items is not an array. Got: ${typeof items}. Response: ${JSON.stringify(response).substring(0, 200)}`);
        }
        const mappedItems = (0, responseValidation_1.mapInventoryItems)(items);
        console.log('[searchInventory] Success - Mapped items:', mappedItems.length, 'totalCount:', totalCount);
        return { items: mappedItems, totalCount };
    }
    catch (error) {
        console.error('[searchInventory] Error details:', {
            message: error === null || error === void 0 ? void 0 : error.message,
            status: error === null || error === void 0 ? void 0 : error.status,
            response: error === null || error === void 0 ? void 0 : error.response,
            stack: error === null || error === void 0 ? void 0 : error.stack,
        });
        throw error;
    }
}
//# sourceMappingURL=search.js.map