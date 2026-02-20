import type { AuditLogQuery, AuditResourceType, AuditEventType } from '@labshare/shared-core';
export declare const auditRoot: () => readonly ["audit"];
export declare const auditLogsList: (params: {
    labId: string | null | undefined;
    userId?: string | null;
    resourceType?: AuditResourceType | null;
    resourceId?: string | null;
    eventType?: AuditEventType | null;
    startDate?: string | null;
    endDate?: string | null;
    success?: boolean | null;
    page?: number | null;
    pageSize?: number | null;
}) => readonly ["audit", "list", string | null, string | null, AuditResourceType | null, string | null, AuditEventType | null, string | null, string | null, boolean | null, number | null, number | null];
export declare const auditResourceHistory: (resourceType: string | null, resourceId: string | null) => readonly ["audit", "resource", string | null, string | null];
export declare const auditExport: (params: AuditLogQuery) => readonly ["audit", "export", AuditLogQuery];
//# sourceMappingURL=audit.d.ts.map