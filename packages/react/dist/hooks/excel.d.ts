import type { ApiClient, ExcelImportFileExt, InventoryExcelExportResponse, PresignedUploadResponse, ResetInventoryResponse } from '@labshare/shared-core';
/**
 * Export inventory to Excel (presigned download URL).
 *
 * Use a repository-scoped client (default repositoryPrefix).
 */
export declare function useInventoryExcelExport(client: ApiClient): import("@tanstack/react-query").UseMutationResult<InventoryExcelExportResponse, Error, void, unknown>;
/**
 * Get presigned PUT URL for Excel/CSV import upload.
 *
 * Use a root client (repositoryPrefix: '').
 */
export declare function useExcelImportPresignedPutUrl(client: ApiClient): import("@tanstack/react-query").UseMutationResult<PresignedUploadResponse, Error, {
    fileExt: ExcelImportFileExt;
    itemType?: string;
    cacheBuster?: number;
}, unknown>;
/**
 * Reset inventory by deleting ALL items for the current lab.
 * This is a destructive operation and should be admin-only.
 *
 * Invalidates inventory queries after successful reset.
 */
export declare function useResetInventory(client: ApiClient): import("@tanstack/react-query").UseMutationResult<ResetInventoryResponse, Error, void, unknown>;
//# sourceMappingURL=excel.d.ts.map