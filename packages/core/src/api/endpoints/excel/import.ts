import type { ApiClient } from '../../ApiClient';
import type {
  ExcelImportFileExt,
  PresignedUploadResponse,
  ExcelBatchesResponse,
  DeleteExcelBatchResponse,
  ResetInventoryResponse
} from '../../../types/excel';
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
  // Validate file extension
  const allowedExts: ExcelImportFileExt[] = ['csv', 'xlsx', 'xls'];
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
    } else {
      validatedItemType = normalized;
    }
  }
  
  const endpoint = params.fileExt === 'csv' ? 'csv' : 'xlsx';
  const response = await client.request<PresignedUploadResponse>({
    method: 'GET',
    path: `/ocr/generate-presigned-url/${endpoint}`,
    query: {
      // Used by mobile to avoid cached presign responses.
      t: params.cacheBuster ?? Date.now(),
      // Optional: server defaults to "inventory" if omitted.
      itemType: validatedItemType,
    },
  });

  return validateObjectResponse(response, 'getExcelImportPresignedPutUrl', ['url']) as any;
}

/**
 * Gets all Excel import batches for the current lab.
 * Returns information about each batch including item count, upload time, and sample item names.
 *
 * Backend route: GET /repository/excel-batches
 */
export async function getExcelBatches(
  client: ApiClient
): Promise<ExcelBatchesResponse> {
  const response = await client.request<ExcelBatchesResponse>({
    method: 'GET',
    path: '/excel-batches',
  });

  return validateObjectResponse(response, 'getExcelBatches', ['batches']) as any;
}

/**
 * Deletes all items from a specific Excel import batch.
 *
 * Backend route: POST /repository/bulk-delete-by-source
 *
 * @param sourceFileKey - The S3 key of the source Excel file (from ExcelBatchInfo.sourceFileKey)
 */
export async function deleteExcelBatch(
  client: ApiClient,
  sourceFileKey: string
): Promise<DeleteExcelBatchResponse> {
  const response = await client.request<DeleteExcelBatchResponse>({
    method: 'POST',
    path: '/bulk-delete-by-source',
    body: { sourceFileKey },
  });

  return validateObjectResponse(response, 'deleteExcelBatch', ['deletedCount']) as any;
}

/**
 * Resets the inventory by deleting ALL items for the current lab.
 * This is a destructive operation and should be used with caution.
 *
 * Backend route: POST /repository/reset-inventory
 */
export async function resetInventory(
  client: ApiClient
): Promise<ResetInventoryResponse> {
  const response = await client.request<ResetInventoryResponse>({
    method: 'POST',
    path: '/reset-inventory',
  });

  return validateObjectResponse(response, 'resetInventory', ['deletedCount']) as any;
}

