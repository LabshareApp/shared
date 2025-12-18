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


