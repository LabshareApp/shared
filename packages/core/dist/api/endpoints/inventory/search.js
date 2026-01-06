"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInventory = searchInventory;
const responseValidation_1 = require("../../responseValidation");
const logger_1 = require("../../../utils/logger");
async function searchInventory(client, searchRequest, page = 1, limit = 20, sortBy = 'name', sortDirection = 'asc', signal) {
    var _a, _b;
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
        page,
        limit,
        sortBy: sortBy === 'date' ? 'updatedAt' : sortBy,
        sortDirection,
    };
    logger_1.logger.debug('searchInventory request', {
        path: '/search',
        query: queryParams,
        hasGlobalSearchTerm: !!searchRequest.globalSearchTerm,
    });
    try {
        const response = await client.request({
            method: 'POST',
            path: '/search',
            body: searchRequest,
            query: queryParams,
            signal, // Pass signal to request
        });
        // Handle both possible response formats
        // Backend might return { items, totalCount } or { Items, TotalCount }
        const items = response.items || response.Items || [];
        const totalCount = (_b = (_a = response.totalCount) !== null && _a !== void 0 ? _a : response.TotalCount) !== null && _b !== void 0 ? _b : 0;
        if (!Array.isArray(items)) {
            logger_1.logger.error('Invalid items format in searchInventory response', {
                itemsType: typeof items,
                responseKeys: Object.keys(response || {}),
            });
            throw new Error(`Unexpected response format from searchInventory: items is not an array. Got: ${typeof items}. Response: ${JSON.stringify(response).substring(0, 200)}`);
        }
        const mappedItems = (0, responseValidation_1.mapInventoryItems)(items);
        logger_1.logger.debug('searchInventory success', { itemCount: mappedItems.length, totalCount });
        return { items: mappedItems, totalCount };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStatus = error.status;
        logger_1.logger.error('searchInventory error', {
            message: errorMessage,
            status: errorStatus,
        });
        throw error;
    }
}
//# sourceMappingURL=search.js.map