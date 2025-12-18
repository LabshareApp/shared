"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportInventoryToExcel = exportInventoryToExcel;
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
//# sourceMappingURL=export.js.map