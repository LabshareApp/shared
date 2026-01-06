"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExcelImportPresignedPutUrl = getExcelImportPresignedPutUrl;
const responseValidation_1 = require("../../responseValidation");
/**
 * Gets a presigned PUT URL for uploading an Excel/CSV import file.
 *
 * Backend routes:
 * - GET /ocr/generate-presigned-url/csv
 * - GET /ocr/generate-presigned-url/xlsx
 *
 * IMPORTANT: These are NOT under /repository. Create your ApiClient with repositoryPrefix: ''.
 */
async function getExcelImportPresignedPutUrl(client, params) {
    var _a;
    // Validate file extension
    const allowedExts = ['csv', 'xlsx', 'xls'];
    if (!allowedExts.includes(params.fileExt)) {
        throw new Error(`Invalid file extension: ${params.fileExt}. Allowed extensions: ${allowedExts.join(', ')}`);
    }
    // Validate item type
    const allowedItemTypes = ['inventory', 'order-request', 'placed-order'];
    let validatedItemType = params.itemType;
    if (validatedItemType) {
        const normalized = validatedItemType.toLowerCase();
        if (!allowedItemTypes.includes(normalized)) {
            validatedItemType = 'inventory'; // Default to inventory if invalid
        }
        else {
            validatedItemType = normalized;
        }
    }
    const endpoint = params.fileExt === 'csv' ? 'csv' : 'xlsx';
    const response = await client.request({
        method: 'GET',
        path: `/ocr/generate-presigned-url/${endpoint}`,
        query: {
            // Used by mobile to avoid cached presign responses.
            t: (_a = params.cacheBuster) !== null && _a !== void 0 ? _a : Date.now(),
            // Optional: server defaults to "inventory" if omitted.
            itemType: validatedItemType,
        },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getExcelImportPresignedPutUrl', ['url']);
}
//# sourceMappingURL=import.js.map