import type { ApiClient } from '../../ApiClient';
import type {
  InventoryExcelExportResponse,
  OrderRequestsExcelExportResponse,
  OrderRequestExportView,
} from '../../../types/excel';
import { validateObjectResponse } from '../../responseValidation';

/**
 * Exports the authenticated lab's inventory to Excel and returns a presigned download URL.
 *
 * Backend route (under /repository):
 * - GET /export-to-excel
 */
export async function exportInventoryToExcel(client: ApiClient): Promise<InventoryExcelExportResponse> {
  const response = await client.request<InventoryExcelExportResponse>({
    method: 'GET',
    path: '/export-to-excel',
  });

  return validateObjectResponse(response, 'exportInventoryToExcel', ['itemCount'] as any) as any;
}

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
export async function exportOrderRequestsToExcel(
  client: ApiClient,
  view: OrderRequestExportView = 'current'
): Promise<OrderRequestsExcelExportResponse> {
  const response = await client.request<OrderRequestsExcelExportResponse>({
    method: 'GET',
    path: '/export-order-requests',
    query: { view },
  });

  return validateObjectResponse(response, 'exportOrderRequestsToExcel', ['itemCount'] as any) as any;
}




