"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInventory = searchInventory;
const responseValidation_1 = require("../../responseValidation");
// Check if we're in development mode (works in both Node and browser environments)
// @ts-ignore - __DEV__ is a global defined by React Native/Metro bundler
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : (typeof process !== 'undefined' && ((_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) === 'development');
async function searchInventory(client, searchRequest, page = 1, limit = 20, sortBy = 'name', sortDirection = 'asc', signal) {
    var _a, _b, _c, _d, _e, _f;
    // Validate and normalize pagination parameters
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(100, Math.max(1, limit)); // Server max is 100
    // Validate and normalize sort parameters
    const allowedSortFields = ['name', 'updatedAt', 'createdAt', 'expirationDate'];
    let validatedSortBy = sortBy === 'date' ? 'updatedAt' : sortBy;
    if (!allowedSortFields.includes(validatedSortBy)) {
        validatedSortBy = 'name';
    }
    const validatedSortDirection = (sortDirection === 'asc' || sortDirection === 'desc')
        ? sortDirection
        : 'asc';
    const queryParams = {
        page: validatedPage,
        limit: validatedLimit,
        sortBy: validatedSortBy,
        sortDirection: validatedSortDirection,
    };
    // Ensure numeric filter values are actual numbers (not strings) before sending
    if ((_a = searchRequest.query) === null || _a === void 0 ? void 0 : _a.attributeFilters) {
        searchRequest.query.attributeFilters = searchRequest.query.attributeFilters.map((filter) => {
            const numericFields = ['totalQuantity', 'attributes.price.amount'];
            if (numericFields.includes(filter.field) && filter.value !== undefined && filter.value !== null) {
                if (typeof filter.value === 'string' && filter.value !== '') {
                    const num = parseFloat(filter.value);
                    if (!isNaN(num)) {
                        return { ...filter, value: num };
                    }
                }
            }
            return filter;
        });
    }
    if (isDev) {
        console.log('[searchInventory] Request:', {
            path: '/search',
            body: JSON.stringify(searchRequest, null, 2),
            query: queryParams,
            hasGlobalSearchTerm: !!searchRequest.globalSearchTerm,
            globalSearchTerm: searchRequest.globalSearchTerm,
            attributeFilters: (_c = (_b = searchRequest.query) === null || _b === void 0 ? void 0 : _b.attributeFilters) === null || _c === void 0 ? void 0 : _c.map((f) => ({
                field: f.field,
                operator: f.operator,
                value: f.value,
                valueType: typeof f.value,
            })),
        });
    }
    try {
        const response = await client.request({
            method: 'POST',
            path: '/search',
            body: searchRequest,
            query: queryParams,
            signal, // Pass signal to request
        });
        if (isDev) {
            console.log('[searchInventory] Raw response:', {
                type: typeof response,
                keys: response ? Object.keys(response) : [],
                hasItems: !!((response === null || response === void 0 ? void 0 : response.items) || (response === null || response === void 0 ? void 0 : response.Items)),
                itemsLength: ((response === null || response === void 0 ? void 0 : response.items) || (response === null || response === void 0 ? void 0 : response.Items) || []).length,
                totalCount: (_d = response === null || response === void 0 ? void 0 : response.totalCount) !== null && _d !== void 0 ? _d : response === null || response === void 0 ? void 0 : response.TotalCount,
                fullResponse: JSON.stringify(response, null, 2).substring(0, 500),
            });
        }
        // Handle both possible response formats
        // Backend might return { items, totalCount } or { Items, TotalCount }
        const items = response.items || response.Items || [];
        const totalCount = (_f = (_e = response.totalCount) !== null && _e !== void 0 ? _e : response.TotalCount) !== null && _f !== void 0 ? _f : 0;
        if (!Array.isArray(items)) {
            if (isDev) {
                console.error('[searchInventory] Invalid items format:', {
                    items,
                    itemsType: typeof items,
                    responseKeys: Object.keys(response || {}),
                });
            }
            throw new Error(`Unexpected response format from searchInventory: items is not an array. Got: ${typeof items}. Response: ${JSON.stringify(response).substring(0, 200)}`);
        }
        const mappedItems = (0, responseValidation_1.mapInventoryItems)(items);
        if (isDev) {
            console.log('[searchInventory] Success - Mapped items:', mappedItems.length, 'totalCount:', totalCount);
        }
        return { items: mappedItems, totalCount };
    }
    catch (error) {
        // Don't log cancellation errors
        if ((error === null || error === void 0 ? void 0 : error.name) === 'AbortError' || (error === null || error === void 0 ? void 0 : error.code) === 'ERR_CANCELED') {
            throw error;
        }
        if (isDev) {
            console.error('[searchInventory] Error details:', {
                message: error === null || error === void 0 ? void 0 : error.message,
                status: error === null || error === void 0 ? void 0 : error.status,
                response: error === null || error === void 0 ? void 0 : error.response,
                stack: error === null || error === void 0 ? void 0 : error.stack,
            });
        }
        throw error;
    }
}
//# sourceMappingURL=search.js.map