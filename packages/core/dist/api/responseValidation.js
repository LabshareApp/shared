"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArrayResponse = validateArrayResponse;
exports.validateObjectResponse = validateObjectResponse;
exports.validatePaginatedResponse = validatePaginatedResponse;
exports.mapInventoryItems = mapInventoryItems;
exports.normalizeMongoId = normalizeMongoId;
function validateArrayResponse(response, functionName) {
    if (!Array.isArray(response)) {
        throw new Error(`Unexpected response format from ${functionName}: Expected array.`);
    }
    return response;
}
function validateObjectResponse(response, functionName, requiredFields = []) {
    if (typeof response !== 'object' || response === null) {
        throw new Error(`Unexpected response format from ${functionName}: Expected object.`);
    }
    for (const field of requiredFields) {
        if (!(field in response)) {
            throw new Error(`Incomplete response from ${functionName}. Missing '${field}'.`);
        }
        // For array fields, ensure they're arrays (not null)
        if (field === 'items' && response[field] === null) {
            response[field] = [];
        }
    }
    return response;
}
function validatePaginatedResponse(response, functionName) {
    var _a;
    // Handle both lowercase and uppercase field names (Go JSON serialization)
    const items = (response === null || response === void 0 ? void 0 : response.items) || (response === null || response === void 0 ? void 0 : response.Items);
    const totalCount = (_a = response === null || response === void 0 ? void 0 : response.totalCount) !== null && _a !== void 0 ? _a : response === null || response === void 0 ? void 0 : response.TotalCount;
    if (!response) {
        throw new Error(`Unexpected response format from ${functionName}: Response is null or undefined.`);
    }
    if (!Array.isArray(items)) {
        console.error(`[${functionName}] Invalid response:`, response);
        throw new Error(`Unexpected response format from ${functionName}: Expected items array. Got: ${typeof items}. Response keys: ${Object.keys(response || {}).join(', ')}`);
    }
    if (typeof totalCount !== 'number') {
        console.error(`[${functionName}] Invalid response:`, response);
        throw new Error(`Unexpected response format from ${functionName}: Expected totalCount number. Got: ${typeof totalCount}. Response keys: ${Object.keys(response || {}).join(', ')}`);
    }
    return { items, totalCount };
}
function mapInventoryItems(items) {
    return items.map((item) => {
        return { ...item };
    });
}
/**
 * Normalize MongoDB _id to id on a response object.
 * The Go server may return _id instead of id depending on serialization.
 */
function normalizeMongoId(obj) {
    const o = obj;
    if (o && !o.id && o._id) {
        return { ...o, id: o._id };
    }
    return obj;
}
//# sourceMappingURL=responseValidation.js.map