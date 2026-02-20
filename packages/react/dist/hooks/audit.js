"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditLogs = useAuditLogs;
exports.useResourceAuditHistory = useResourceAuditHistory;
exports.useAuditLogsExport = useAuditLogsExport;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const audit_1 = require("../queryKeys/audit");
/**
 * Hook to query audit logs with filters
 * Requires admin role
 */
function useAuditLogs(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: (0, audit_1.auditLogsList)({
            labId: params.labId,
            userId: params.userId,
            resourceType: params.resourceType,
            resourceId: params.resourceId,
            eventType: params.eventType,
            startDate: params.startDate,
            endDate: params.endDate,
            success: params.success,
            page: params.page,
            pageSize: params.pageSize,
        }),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            const query = {};
            if (params.userId)
                query.userId = params.userId;
            if (params.resourceType)
                query.resourceType = params.resourceType;
            if (params.resourceId)
                query.resourceId = params.resourceId;
            if (params.eventType)
                query.eventType = params.eventType;
            if (params.startDate)
                query.startDate = params.startDate;
            if (params.endDate)
                query.endDate = params.endDate;
            if (params.success !== undefined && params.success !== null)
                query.success = params.success;
            if (params.page)
                query.page = params.page;
            if (params.pageSize)
                query.pageSize = params.pageSize;
            return (0, shared_core_1.getAuditLogs)(client, query);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.labId,
        staleTime: 30000, // 30 seconds - audit logs change infrequently
    });
}
/**
 * Hook to get audit history for a specific resource
 * Requires admin role
 */
function useResourceAuditHistory(client, params) {
    var _a, _b, _c;
    return (0, react_query_1.useQuery)({
        queryKey: (0, audit_1.auditResourceHistory)((_a = params.resourceType) !== null && _a !== void 0 ? _a : null, (_b = params.resourceId) !== null && _b !== void 0 ? _b : null),
        queryFn: async () => {
            if (!params.resourceType || !params.resourceId)
                return null;
            return (0, shared_core_1.getResourceAuditHistory)(client, params.resourceType, params.resourceId);
        },
        enabled: (_c = params.enabled) !== null && _c !== void 0 ? _c : !!(params.resourceType && params.resourceId),
        staleTime: 30000,
    });
}
/**
 * Hook to export audit logs
 * Requires admin role
 */
function useAuditLogsExport(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: (0, audit_1.auditExport)(params.query),
        queryFn: async () => {
            return (0, shared_core_1.exportAuditLogs)(client, params.query);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : false, // Manual trigger only
        staleTime: Infinity, // Export data doesn't change
    });
}
//# sourceMappingURL=audit.js.map