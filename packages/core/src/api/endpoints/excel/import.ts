import type { ApiClient } from '../../ApiClient';
import type { ExcelImportFileExt, PresignedUploadResponse } from '../../../types/excel';
import { validateObjectResponse } from '../../responseValidation';

/**
 * Gets a presigned PUT URL for uploading an Excel/CSV import file.
 *
 * Backend routes:
 * - GET /ocr/generate-presigned-url/csv
 * - GET /ocr/generate-presigned-url/xlsx
 *
 * IMPORTANT: These are NOT under /repository. Create your ApiClient with repositoryPrefix: ''.
 */
export async function getExcelImportPresignedPutUrl(
  client: ApiClient,
  params: { fileExt: ExcelImportFileExt; itemType?: string; cacheBuster?: number }
): Promise<PresignedUploadResponse> {
  const endpoint = params.fileExt === 'csv' ? 'csv' : 'xlsx';
  const response = await client.request<PresignedUploadResponse>({
    method: 'GET',
    path: `/ocr/generate-presigned-url/${endpoint}`,
    query: {
      // Used by mobile to avoid cached presign responses.
      t: params.cacheBuster ?? Date.now(),
      // Optional: server defaults to "inventory" if omitted.
      itemType: params.itemType,
    },
  });

  return validateObjectResponse(response, 'getExcelImportPresignedPutUrl', ['url'] as any) as any;
}



