import type { ApiClient } from '../../ApiClient';
import type { InventoryExcelExportResponse, OrderRequestsExcelExportResponse, OrderRequestExportView } from '../../../types/excel';
/**
 * Exports the authenticated lab's inventory to Excel and returns a presigned download URL.
 *
 * Backend route (under /repository):
 * - GET /export-to-excel
 */
export declare function exportInventoryToExcel(client: ApiClient): Promise<InventoryExcelExportResponse>;
/**
 * Exports the authenticated lab's order requests to Excel and returns a presigned download URL.
 *
 * Backend route (under /repository):
 * - GET /export-order-requests?view={current|placed|archived}
 *
 * @param view - Which order requests to export:
 *   - 'current' (default): Active order requests
 *   - 'placed': Placed/submitted order requests
 *   - 'archived': Archived order requests
 */
export declare function exportOrderRequestsToExcel(client: ApiClient, view?: OrderRequestExportView): Promise<OrderRequestsExcelExportResponse>;
//# sourceMappingURL=export.d.ts.map