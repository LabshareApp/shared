"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTools = fetchTools;
exports.getTool = getTool;
exports.createTool = createTool;
exports.updateTool = updateTool;
exports.deleteTool = deleteTool;
exports.checkoutTool = checkoutTool;
exports.returnTool = returnTool;
exports.getToolCheckouts = getToolCheckouts;
exports.getAvailableTools = getAvailableTools;
exports.getMyCheckouts = getMyCheckouts;
exports.logToolAccess = logToolAccess;
exports.createMaintenanceRequest = createMaintenanceRequest;
exports.getMaintenanceRequest = getMaintenanceRequest;
exports.listMaintenanceRequests = listMaintenanceRequests;
exports.updateMaintenanceRequest = updateMaintenanceRequest;
exports.getToolMaintenanceHistory = getToolMaintenanceHistory;
const responseValidation_1 = require("../../responseValidation");
function normalizeId(obj) {
    const idValue = (obj === null || obj === void 0 ? void 0 : obj._id) || (obj === null || obj === void 0 ? void 0 : obj.id);
    if (!idValue)
        return obj;
    return { ...obj, _id: idValue, id: idValue };
}
function normalizeArray(arr) {
    return arr.map(normalizeId);
}
// =============================================================================
// Tool CRUD
// =============================================================================
/**
 * Fetch all tools for the authenticated lab.
 */
async function fetchTools(client, params) {
    var _a, _b, _c;
    const query = {};
    if (params === null || params === void 0 ? void 0 : params.page)
        query.page = String(params.page);
    if (params === null || params === void 0 ? void 0 : params.limit)
        query.limit = String(params.limit);
    if (params === null || params === void 0 ? void 0 : params.status)
        query.status = params.status;
    if (params === null || params === void 0 ? void 0 : params.category)
        query.category = params.category;
    if (params === null || params === void 0 ? void 0 : params.search)
        query.search = params.search;
    if (params === null || params === void 0 ? void 0 : params.includeShared)
        query.includeShared = 'true';
    const response = await client.request({
        method: 'GET',
        path: '/tools',
        query: Object.keys(query).length > 0 ? query : undefined,
    });
    return {
        tools: normalizeArray(response.tools || []),
        totalCount: (_a = response.totalCount) !== null && _a !== void 0 ? _a : 0,
        page: (_b = response.page) !== null && _b !== void 0 ? _b : 1,
        limit: (_c = response.limit) !== null && _c !== void 0 ? _c : 20,
    };
}
/**
 * Fetch a single tool by ID.
 */
async function getTool(client, id) {
    const response = await client.request({
        method: 'GET',
        path: '/tools/get',
        query: { id },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'getTool', ['name', 'category']);
    return normalizeId(validated);
}
/**
 * Create a new tool.
 */
async function createTool(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/tools/create',
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'createTool', ['name', 'category']);
    return normalizeId(validated);
}
/**
 * Update a tool.
 */
async function updateTool(client, id, data) {
    const response = await client.request({
        method: 'PUT',
        path: '/tools/update',
        query: { id },
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'updateTool', ['name', 'category']);
    return normalizeId(validated);
}
/**
 * Delete a tool.
 */
async function deleteTool(client, id) {
    await client.request({
        method: 'DELETE',
        path: '/tools/delete',
        query: { id },
    });
}
// =============================================================================
// Checkout/Return
// =============================================================================
/**
 * Checkout a tool.
 */
async function checkoutTool(client, id, data) {
    const response = await client.request({
        method: 'POST',
        path: '/tools/checkout',
        query: { id },
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'checkoutTool', ['toolId', 'userId']);
    return normalizeId(validated);
}
/**
 * Return a checked out tool.
 */
async function returnTool(client, id, data) {
    const response = await client.request({
        method: 'POST',
        path: '/tools/return',
        query: { id },
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'returnTool', ['toolId', 'userId']);
    return normalizeId(validated);
}
/**
 * Get checkout history for a tool.
 */
async function getToolCheckouts(client, id, params) {
    var _a, _b, _c;
    const query = { id };
    if (params === null || params === void 0 ? void 0 : params.page)
        query.page = String(params.page);
    if (params === null || params === void 0 ? void 0 : params.limit)
        query.limit = String(params.limit);
    const response = await client.request({
        method: 'GET',
        path: '/tools/checkouts',
        query,
    });
    return {
        checkouts: normalizeArray(response.checkouts || []),
        totalCount: (_a = response.totalCount) !== null && _a !== void 0 ? _a : 0,
        page: (_b = response.page) !== null && _b !== void 0 ? _b : 1,
        limit: (_c = response.limit) !== null && _c !== void 0 ? _c : 20,
    };
}
// =============================================================================
// Available Tools / My Checkouts
// =============================================================================
/**
 * Get tools available to borrow from other labs.
 */
async function getAvailableTools(client, params) {
    var _a, _b, _c;
    const query = {};
    if (params === null || params === void 0 ? void 0 : params.page)
        query.page = String(params.page);
    if (params === null || params === void 0 ? void 0 : params.limit)
        query.limit = String(params.limit);
    const response = await client.request({
        method: 'GET',
        path: '/tools/available',
        query: Object.keys(query).length > 0 ? query : undefined,
    });
    return {
        tools: normalizeArray(response.tools || []),
        totalCount: (_a = response.totalCount) !== null && _a !== void 0 ? _a : 0,
        page: (_b = response.page) !== null && _b !== void 0 ? _b : 1,
        limit: (_c = response.limit) !== null && _c !== void 0 ? _c : 20,
    };
}
/**
 * Get current user's active checkouts.
 */
async function getMyCheckouts(client, params) {
    var _a;
    const query = {};
    if (params === null || params === void 0 ? void 0 : params.allLabs)
        query.allLabs = 'true';
    const response = await client.request({
        method: 'GET',
        path: '/tools/my-checkouts',
        query: Object.keys(query).length > 0 ? query : undefined,
    });
    return {
        checkouts: normalizeArray(response.checkouts || []),
        count: (_a = response.count) !== null && _a !== void 0 ? _a : 0,
    };
}
// =============================================================================
// Access Logging
// =============================================================================
/**
 * Log an access event for a tool (ID swipe, view).
 */
async function logToolAccess(client, id, data) {
    await client.request({
        method: 'POST',
        path: '/tools/log-access',
        query: { id },
        body: data,
    });
}
/**
 * Create a maintenance request for a tool.
 */
async function createMaintenanceRequest(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/tools/maintenance-requests',
        body: data,
    });
    return response;
}
/**
 * Get a maintenance request by ID.
 */
async function getMaintenanceRequest(client, requestId) {
    const response = await client.request({
        method: 'GET',
        path: '/tools/maintenance-requests',
        query: { id: requestId },
    });
    return response;
}
/**
 * List maintenance requests with optional filters.
 */
async function listMaintenanceRequests(client, params) {
    var _a;
    const response = await client.request({
        method: 'GET',
        path: '/tools/maintenance-requests/list',
        query: params,
    });
    return {
        requests: response.requests || [],
        totalCount: (_a = response.totalCount) !== null && _a !== void 0 ? _a : 0,
    };
}
/**
 * Update a maintenance request (change status, assign, resolve).
 */
async function updateMaintenanceRequest(client, requestId, data) {
    const response = await client.request({
        method: 'PUT',
        path: '/tools/maintenance-requests',
        query: { id: requestId },
        body: data,
    });
    return response;
}
/**
 * Get maintenance requests for a specific tool.
 */
async function getToolMaintenanceHistory(client, toolId) {
    const response = await listMaintenanceRequests(client, { toolId });
    return response.requests;
}
//# sourceMappingURL=index.js.map