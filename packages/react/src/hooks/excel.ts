import { useMutation } from '@tanstack/react-query';
import type {
  ApiClient,
  ExcelImportFileExt,
  InventoryExcelExportResponse,
  PresignedUploadResponse,
} from '@labshare/shared-core';
import { exportInventoryToExcel, getExcelImportPresignedPutUrl } from '@labshare/shared-core';

/**
 * Export inventory to Excel (presigned download URL).
 *
 * Use a repository-scoped client (default repositoryPrefix).
 */
export function useInventoryExcelExport(client: ApiClient) {
  return useMutation<InventoryExcelExportResponse, Error, void>({
    mutationFn: () => exportInventoryToExcel(client),
  });
}

/**
 * Get presigned PUT URL for Excel/CSV import upload.
 *
 * Use a root client (repositoryPrefix: '').
 */
export function useExcelImportPresignedPutUrl(client: ApiClient) {
  return useMutation<
    PresignedUploadResponse,
    Error,
    { fileExt: ExcelImportFileExt; itemType?: string; cacheBuster?: number }
  >({
    mutationFn: (params) => getExcelImportPresignedPutUrl(client, params),
  });
}

