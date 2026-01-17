export type ExcelImportFileExt = 'csv' | 'xlsx' | 'xls';

export interface PresignedUploadResponse {
  url: string;
  object_key: string;
}

export interface InventoryExcelExportResponse {
  url: string;
  filename: string;
  expires: string; // RFC3339
  itemCount: number;
}

export function getExcelContentType(fileExt: ExcelImportFileExt): string {
  if (fileExt === 'csv') return 'text/csv';
  return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

/**
 * Information about a batch of items imported from an Excel file.
 */
export interface ExcelBatchInfo {
  /** The S3 key of the source Excel file */
  sourceFileKey: string;
  /** Number of items in this batch */
  itemCount: number;
  /** Earliest createdAt timestamp */
  firstUpload: string;
  /** Latest createdAt timestamp */
  lastUpload: string;
  /** First few item names for preview */
  sampleNames: string[];
}

export interface ExcelBatchesResponse {
  batches: ExcelBatchInfo[];
}

export interface DeleteExcelBatchResponse {
  message: string;
  deletedCount: number;
}

export interface ResetInventoryResponse {
  message: string;
  deletedCount: number;
  previousCount: number;
}

/**
 * View types for order requests export
 */
export type OrderRequestExportView = 'current' | 'placed' | 'archived';

/**
 * Response from order requests export endpoint
 */
export interface OrderRequestsExcelExportResponse {
  url: string;
  filename: string;
  expires: string; // RFC3339
  itemCount: number;
  message?: string;
}




