import type { ApiClient } from '../../ApiClient';
import type { ExcelImportFileExt, PresignedUploadResponse, ExcelBatchesResponse, DeleteExcelBatchResponse, ResetInventoryResponse } from '../../../types/excel';
/**
 * Gets a presigned PUT URL for uploading an Excel/CSV import file.
 *
 * Backend routes:
 * - GET /ocr/generate-presigned-url/csv
 * - GET /ocr/generate-presigned-url/xlsx
 *
 * IMPORTANT: These are NOT under /repository. Create your ApiClient with repositoryPrefix: ''.
 */
export declare function getExcelImportPresignedPutUrl(client: ApiClient, params: {
    fileExt: ExcelImportFileExt;
    itemType?: string;
    cacheBuster?: number;
}): Promise<PresignedUploadResponse>;
/**
 * Gets all Excel import batches for the current lab.
 * Returns information about each batch including item count, upload time, and sample item names.
 *
 * Backend route: GET /repository/excel-batches
 */
export declare function getExcelBatches(client: ApiClient): Promise<ExcelBatchesResponse>;
/**
 * Deletes all items from a specific Excel import batch.
 *
 * Backend route: POST /repository/bulk-delete-by-source
 *
 * @param sourceFileKey - The S3 key of the source Excel file (from ExcelBatchInfo.sourceFileKey)
 */
export declare function deleteExcelBatch(client: ApiClient, sourceFileKey: string): Promise<DeleteExcelBatchResponse>;
/**
 * Resets the inventory by deleting ALL items for the current lab.
 * This is a destructive operation and should be used with caution.
 *
 * Backend route: POST /repository/reset-inventory
 */
export declare function resetInventory(client: ApiClient): Promise<ResetInventoryResponse>;
//# sourceMappingURL=import.d.ts.map