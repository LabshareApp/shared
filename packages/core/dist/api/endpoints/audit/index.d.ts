/**
 * Audit Log API Endpoints
 * Provides access to audit logs for HIPAA/SOC2 compliance
 */
import type { ApiClient } from '../../ApiClient';
import type { AuditLog, AuditLogQuery, AuditLogResult, AuditExportOptions, ResourceAuditHistory } from '../../../types/audit';
/**
 * Query audit logs with filters
 * Requires admin role
 */
export declare function getAuditLogs(client: ApiClient, query?: AuditLogQuery): Promise<AuditLogResult>;
/**
 * Get audit history for a specific resource
 * Requires admin role
 */
export declare function getResourceAuditHistory(client: ApiClient, resourceType: string, resourceId: string): Promise<ResourceAuditHistory>;
/**
 * Export audit logs for compliance reporting
 * Returns JSON format
 * Requires admin role
 */
export declare function exportAuditLogs(client: ApiClient, options?: AuditExportOptions): Promise<{
    exportDate: string;
    totalCount: number;
    logs: AuditLog[];
}>;
/**
 * Build URL for CSV export (for direct download via browser)
 * Requires admin role
 */
export declare function buildAuditLogsExportUrl(baseUrl: string, options?: AuditExportOptions): string;
//# sourceMappingURL=index.d.ts.map