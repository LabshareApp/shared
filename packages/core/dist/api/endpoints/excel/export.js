"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportInventoryToExcel = exportInventoryToExcel;
exports.exportOrderRequestsToExcel = exportOrderRequestsToExcel;
const responseValidation_1 = require("../../responseValidation");
/**
 * Exports the authenticated lab's inventory to Excel and returns a presigned download URL.
 *
 * Backend route (under /repository):
 * - GET /export-to-excel
 */
async function exportInventoryToExcel(client) {
    const response = await client.request({
        method: 'GET',
        path: '/export-to-excel',
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'exportInventoryToExcel', ['itemCount']);
}
/**
 * Exports the authenticated lab's order requests to Excel and returns a presigned download URL.
 *
 * Backend route (under /repository):
 * - GET /export-order-requests?view={current|placed|archived}
 *
 * @param view - Which order requests to export:
 *   - 'current' (default): Active order requests
 *   - 'placed': Placed/submitted order requests
 *   - 'archived': Archived order requests
 */
async function exportOrderRequestsToExcel(client, view = 'current') {
    const response = await client.request({
        method: 'GET',
        path: '/export-order-requests',
        query: { view },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'exportOrderRequestsToExcel', ['itemCount']);
}
//# sourceMappingURL=export.js.map