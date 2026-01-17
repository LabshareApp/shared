"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExcelImportPresignedPutUrl = getExcelImportPresignedPutUrl;
exports.getExcelBatches = getExcelBatches;
exports.deleteExcelBatch = deleteExcelBatch;
exports.resetInventory = resetInventory;
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
/**
 * Gets all Excel import batches for the current lab.
 * Returns information about each batch including item count, upload time, and sample item names.
 *
 * Backend route: GET /repository/excel-batches
 */
async function getExcelBatches(client) {
    const response = await client.request({
        method: 'GET',
        path: '/excel-batches',
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getExcelBatches', ['batches']);
}
/**
 * Deletes all items from a specific Excel import batch.
 *
 * Backend route: POST /repository/bulk-delete-by-source
 *
 * @param sourceFileKey - The S3 key of the source Excel file (from ExcelBatchInfo.sourceFileKey)
 */
async function deleteExcelBatch(client, sourceFileKey) {
    const response = await client.request({
        method: 'POST',
        path: '/bulk-delete-by-source',
        body: { sourceFileKey },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'deleteExcelBatch', ['deletedCount']);
}
/**
 * Resets the inventory by deleting ALL items for the current lab.
 * This is a destructive operation and should be used with caution.
 *
 * Backend route: POST /repository/reset-inventory
 */
async function resetInventory(client) {
    const response = await client.request({
        method: 'POST',
        path: '/reset-inventory',
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'resetInventory', ['deletedCount']);
}
//# sourceMappingURL=import.js.map