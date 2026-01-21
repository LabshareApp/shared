"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInventoryExcelExport = useInventoryExcelExport;
exports.useExcelImportPresignedPutUrl = useExcelImportPresignedPutUrl;
exports.useResetInventory = useResetInventory;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const inventory_1 = require("../queryKeys/inventory");
/**
 * Export inventory to Excel (presigned download URL).
 *
 * Use a repository-scoped client (default repositoryPrefix).
 */
function useInventoryExcelExport(client) {
    return (0, react_query_1.useMutation)({
        mutationFn: () => (0, shared_core_1.exportInventoryToExcel)(client),
    });
}
/**
 * Get presigned PUT URL for Excel/CSV import upload.
 *
 * Use a root client (repositoryPrefix: '').
 */
function useExcelImportPresignedPutUrl(client) {
    return (0, react_query_1.useMutation)({
        mutationFn: (params) => (0, shared_core_1.getExcelImportPresignedPutUrl)(client, params),
    });
}
/**
 * Reset inventory by deleting ALL items for the current lab.
 * This is a destructive operation and should be admin-only.
 *
 * Invalidates inventory queries after successful reset.
 */
function useResetInventory(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: () => (0, shared_core_1.resetInventory)(client),
        onSuccess: () => {
            // Invalidate all inventory-related queries
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.inventory });
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.tags });
            queryClient.invalidateQueries({ queryKey: inventory_1.inventoryKeys.customGroups });
        },
    });
}
//# sourceMappingURL=excel.js.map