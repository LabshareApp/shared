import type { ApiClient, AuditLog, AuditLogQuery, AuditLogResult, ResourceAuditHistory, AuditResourceType, AuditEventType } from '@labshare/shared-core';
/**
 * Hook to query audit logs with filters
 * Requires admin role
 */
export declare function useAuditLogs(client: ApiClient, params: {
    labId: string | null | undefined;
    userId?: string | null;
    resourceType?: AuditResourceType | null;
    resourceId?: string | null;
    eventType?: AuditEventType | null;
    startDate?: string | null;
    endDate?: string | null;
    success?: boolean | null;
    page?: number;
    pageSize?: number;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<AuditLogResult, Error>;
/**
 * Hook to get audit history for a specific resource
 * Requires admin role
 */
export declare function useResourceAuditHistory(client: ApiClient, params: {
    resourceType: AuditResourceType | null | undefined;
    resourceId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<ResourceAuditHistory | null, Error>;
/**
 * Hook to export audit logs
 * Requires admin role
 */
export declare function useAuditLogsExport(client: ApiClient, params: {
    query: AuditLogQuery;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<{
    exportDate: string;
    totalCount: number;
    logs: AuditLog[];
}, Error>;
//# sourceMappingURL=audit.d.ts.map