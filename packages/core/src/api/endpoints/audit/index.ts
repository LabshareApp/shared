/**
 * Audit Log API Endpoints
 * Provides access to audit logs for HIPAA/SOC2 compliance
 */

import type { ApiClient } from '../../ApiClient';
import type {
  AuditLog,
  AuditLogQuery,
  AuditLogResult,
  AuditExportOptions,
  ResourceAuditHistory,
} from '../../../types/audit';

/**
 * Query audit logs with filters
 * Requires admin role
 */
export async function getAuditLogs(
  client: ApiClient,
  query?: AuditLogQuery
): Promise<AuditLogResult> {
  const queryParams: Record<string, string> = {};

  if (query) {
    if (query.userId) queryParams.userId = query.userId;
    if (query.resourceType) queryParams.resourceType = query.resourceType;
    if (query.resourceId) queryParams.resourceId = query.resourceId;
    if (query.eventType) queryParams.eventType = query.eventType;
    if (query.startDate) queryParams.startDate = query.startDate;
    if (query.endDate) queryParams.endDate = query.endDate;
    if (query.success !== undefined) queryParams.success = String(query.success);
    if (query.page) queryParams.page = String(query.page);
    if (query.pageSize) queryParams.pageSize = String(query.pageSize);
  }

  return client.request<AuditLogResult>({
    method: 'GET',
    path: '/audit-logs',
    query: queryParams,
  });
}

/**
 * Get audit history for a specific resource
 * Requires admin role
 */
export async function getResourceAuditHistory(
  client: ApiClient,
  resourceType: string,
  resourceId: string
): Promise<ResourceAuditHistory> {
  return client.request<ResourceAuditHistory>({
    method: 'GET',
    path: '/audit-logs/resource',
    query: {
      resourceType,
      resourceId,
    },
  });
}

/**
 * Export audit logs for compliance reporting
 * Returns JSON format
 * Requires admin role
 */
export async function exportAuditLogs(
  client: ApiClient,
  options?: AuditExportOptions
): Promise<{ exportDate: string; totalCount: number; logs: AuditLog[] }> {
  const queryParams: Record<string, string> = {
    format: options?.format || 'json',
  };

  if (options) {
    if (options.userId) queryParams.userId = options.userId;
    if (options.resourceType) queryParams.resourceType = options.resourceType;
    if (options.resourceId) queryParams.resourceId = options.resourceId;
    if (options.eventType) queryParams.eventType = options.eventType;
    if (options.startDate) queryParams.startDate = options.startDate;
    if (options.endDate) queryParams.endDate = options.endDate;
    if (options.success !== undefined) queryParams.success = String(options.success);
  }

  return client.request<{ exportDate: string; totalCount: number; logs: AuditLog[] }>({
    method: 'GET',
    path: '/audit-logs/export',
    query: queryParams,
  });
}

/**
 * Build URL for CSV export (for direct download via browser)
 * Requires admin role
 */
export function buildAuditLogsExportUrl(
  baseUrl: string,
  options?: AuditExportOptions
): string {
  const params = new URLSearchParams();
  params.append('format', 'csv');

  if (options) {
    if (options.userId) params.append('userId', options.userId);
    if (options.resourceType) params.append('resourceType', options.resourceType);
    if (options.resourceId) params.append('resourceId', options.resourceId);
    if (options.eventType) params.append('eventType', options.eventType);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.success !== undefined) params.append('success', String(options.success));
  }

  return `${baseUrl}/repository/audit-logs/export?${params.toString()}`;
}
