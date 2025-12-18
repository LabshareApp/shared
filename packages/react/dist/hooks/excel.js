"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInventoryExcelExport = useInventoryExcelExport;
exports.useExcelImportPresignedPutUrl = useExcelImportPresignedPutUrl;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
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
//# sourceMappingURL=excel.js.map