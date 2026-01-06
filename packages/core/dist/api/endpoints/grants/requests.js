"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGrants = fetchGrants;
exports.fetchGrant = fetchGrant;
exports.fetchGrantTransactions = fetchGrantTransactions;
exports.fetchGrantItems = fetchGrantItems;
const responseValidation_1 = require("../../responseValidation");
function normalizeGrant(grant) {
    const idValue = (grant === null || grant === void 0 ? void 0 : grant._id) || (grant === null || grant === void 0 ? void 0 : grant.id);
    if (!idValue)
        return grant;
    return { ...grant, _id: idValue, id: idValue };
}
function normalizeGrantTransaction(transaction) {
    const idValue = (transaction === null || transaction === void 0 ? void 0 : transaction._id) || (transaction === null || transaction === void 0 ? void 0 : transaction.id);
    if (!idValue)
        return transaction;
    return { ...transaction, _id: idValue, id: idValue };
}
async function fetchGrants(client, params) {
    var _a, _b, _c, _d;
    const response = await client.request({
        method: 'GET',
        path: '/grants',
        query: {
            status: (_a = params === null || params === void 0 ? void 0 : params.status) !== null && _a !== void 0 ? _a : null,
            page: (_b = params === null || params === void 0 ? void 0 : params.page) !== null && _b !== void 0 ? _b : null,
            limit: (_c = params === null || params === void 0 ? void 0 : params.limit) !== null && _c !== void 0 ? _c : null,
        },
    });
    // Handle both response formats: array directly or object with grants array
    let grants;
    let totalCount;
    if (Array.isArray(response)) {
        // Response is directly an array
        grants = response;
        totalCount = response.length;
    }
    else {
        // Response is an object with grants and totalCount
        const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchGrants', ['grants']);
        grants = (0, responseValidation_1.validateArrayResponse)(validated.grants, 'fetchGrants.grants');
        totalCount = (_d = validated.totalCount) !== null && _d !== void 0 ? _d : grants.length;
    }
    return { grants: grants.map(normalizeGrant), totalCount };
}
async function fetchGrant(client, grantId) {
    if (!grantId) {
        throw new Error('Grant ID is required');
    }
    const response = await client.request({
        method: 'GET',
        path: '/get-grant',
        query: { id: String(grantId) },
    });
    // Response is the grant object directly, not wrapped
    return normalizeGrant(response);
}
async function fetchGrantTransactions(client, grantId, params) {
    var _a;
    // Build query object, only including defined values
    const query = {
        grantId,
    };
    if ((params === null || params === void 0 ? void 0 : params.page) !== undefined) {
        query.page = params.page;
    }
    if ((params === null || params === void 0 ? void 0 : params.limit) !== undefined) {
        query.limit = params.limit;
    }
    if ((params === null || params === void 0 ? void 0 : params.type) !== undefined && params.type !== null) {
        query.type = params.type;
    }
    const response = await client.request({
        method: 'GET',
        path: '/get-grant-transactions',
        query,
    });
    // Response should always be an object with transactions and totalCount
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchGrantTransactions', ['transactions']);
    // Handle null transactions (backend might return null for empty arrays)
    const transactionsArray = validated.transactions === null || validated.transactions === undefined
        ? []
        : validated.transactions;
    const transactions = (0, responseValidation_1.validateArrayResponse)(transactionsArray, 'fetchGrantTransactions.transactions');
    const totalCount = (_a = validated.totalCount) !== null && _a !== void 0 ? _a : transactions.length;
    return { transactions: transactions.map(normalizeGrantTransaction), totalCount };
}
async function fetchGrantItems(client, grantId, params) {
    var _a, _b;
    const response = await client.request({
        method: 'GET',
        path: '/get-grant-items',
        query: {
            grantId,
            page: (_a = params === null || params === void 0 ? void 0 : params.page) !== null && _a !== void 0 ? _a : null,
            limit: (_b = params === null || params === void 0 ? void 0 : params.limit) !== null && _b !== void 0 ? _b : null,
        },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchGrantItems', ['items', 'totalCount']);
    const items = (0, responseValidation_1.validateArrayResponse)(validated.items, 'fetchGrantItems.items');
    return { items, totalCount: validated.totalCount };
}
//# sourceMappingURL=requests.js.map