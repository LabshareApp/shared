"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArrayResponse = validateArrayResponse;
exports.validateObjectResponse = validateObjectResponse;
exports.validatePaginatedResponse = validatePaginatedResponse;
exports.mapInventoryItems = mapInventoryItems;
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
            throw new Error(`Incomplete response from ${functionName}. Missing '${String(field)}'.`);
        }
    }
    return response;
}
function validatePaginatedResponse(response, functionName) {
    if (!response || !Array.isArray(response.items) || typeof response.totalCount !== 'number') {
        throw new Error(`Unexpected response format from ${functionName}: Expected paginated structure.`);
    }
    return response;
}
function mapInventoryItems(items) {
    return items.map((item) => {
        const idValue = (item === null || item === void 0 ? void 0 : item._id) || (item === null || item === void 0 ? void 0 : item.id);
        if (!idValue)
            return { ...item };
        return { ...item, _id: idValue, id: idValue };
    });
}
//# sourceMappingURL=responseValidation.js.map