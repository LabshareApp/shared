import type { ApiClient } from '../../ApiClient';
import type { ExcelImportFileExt, PresignedUploadResponse } from '../../../types/excel';
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
//# sourceMappingURL=import.d.ts.map