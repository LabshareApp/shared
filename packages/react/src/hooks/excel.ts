import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  ExcelImportFileExt,
  InventoryExcelExportResponse,
  PresignedUploadResponse,
  ResetInventoryResponse,
} from '@labshare/shared-core';
import { exportInventoryToExcel, getExcelImportPresignedPutUrl, resetInventory } from '@labshare/shared-core';
import { inventoryKeys } from '../queryKeys/inventory';

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

/**
 * Reset inventory by deleting ALL items for the current lab.
 * This is a destructive operation and should be admin-only.
 *
 * Invalidates inventory queries after successful reset.
 */
export function useResetInventory(client: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation<ResetInventoryResponse, Error, void>({
    mutationFn: () => resetInventory(client),
    onSuccess: () => {
      // Invalidate all inventory-related queries
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.tags });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.customGroups });
    },
  });
}




