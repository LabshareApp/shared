import type { ApiClient } from '../../ApiClient';
import type { InventoryExcelExportResponse } from '../../../types/excel';
/**
 * Exports the authenticated lab's inventory to Excel and returns a presigned download URL.
 *
 * Backend route (under /repository):
 * - GET /export-to-excel
 */
export declare function exportInventoryToExcel(client: ApiClient): Promise<InventoryExcelExportResponse>;
//# sourceMappingURL=export.d.ts.map