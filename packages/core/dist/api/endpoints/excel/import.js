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
    const endpoint = params.fileExt === 'csv' ? 'csv' : 'xlsx';
    const response = await client.request({
        method: 'GET',
        path: `/ocr/generate-presigned-url/${endpoint}`,
        query: {
            // Used by mobile to avoid cached presign responses.
            t: (_a = params.cacheBuster) !== null && _a !== void 0 ? _a : Date.now(),
            // Optional: server defaults to "inventory" if omitted.
            itemType: params.itemType,
        },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getExcelImportPresignedPutUrl', ['url']);
}
//# sourceMappingURL=import.js.map