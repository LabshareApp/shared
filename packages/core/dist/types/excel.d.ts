export type ExcelImportFileExt = 'csv' | 'xlsx' | 'xls';
export interface PresignedUploadResponse {
    url: string;
    object_key: string;
}
export interface InventoryExcelExportResponse {
    url: string;
    filename: string;
    expires: string;
    itemCount: number;
}
export declare function getExcelContentType(fileExt: ExcelImportFileExt): string;
//# sourceMappingURL=excel.d.ts.map