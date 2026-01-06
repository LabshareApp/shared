import type { ApiClient } from '../../ApiClient';
import type { InventoryExcelExportResponse } from '../../../types/excel';
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




