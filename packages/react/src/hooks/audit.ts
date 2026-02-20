import { useQuery } from '@tanstack/react-query';
import type {
  ApiClient,
  AuditLog,
  AuditLogQuery,
  AuditLogResult,
  ResourceAuditHistory,
  AuditResourceType,
  AuditEventType,
} from '@labshare/shared-core';
import {
  getAuditLogs,
  getResourceAuditHistory,
  exportAuditLogs,
} from '@labshare/shared-core';

import { auditLogsList, auditResourceHistory, auditExport } from '../queryKeys/audit';

/**
 * Hook to query audit logs with filters
 * Requires admin role
 */
export function useAuditLogs(
  client: ApiClient,
  params: {
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
  }
) {
  return useQuery<AuditLogResult, Error>({
    queryKey: auditLogsList({
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
      if (!params.labId) throw new Error('labId required');

      const query: AuditLogQuery = {};
      if (params.userId) query.userId = params.userId;
      if (params.resourceType) query.resourceType = params.resourceType;
      if (params.resourceId) query.resourceId = params.resourceId;
      if (params.eventType) query.eventType = params.eventType;
      if (params.startDate) query.startDate = params.startDate;
      if (params.endDate) query.endDate = params.endDate;
      if (params.success !== undefined && params.success !== null) query.success = params.success;
      if (params.page) query.page = params.page;
      if (params.pageSize) query.pageSize = params.pageSize;

      return getAuditLogs(client, query);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30_000, // 30 seconds - audit logs change infrequently
  });
}

/**
 * Hook to get audit history for a specific resource
 * Requires admin role
 */
export function useResourceAuditHistory(
  client: ApiClient,
  params: {
    resourceType: AuditResourceType | null | undefined;
    resourceId: string | null | undefined;
    enabled?: boolean;
  }
) {
  return useQuery<ResourceAuditHistory | null, Error>({
    queryKey: auditResourceHistory(
      params.resourceType ?? null,
      params.resourceId ?? null
    ),
    queryFn: async () => {
      if (!params.resourceType || !params.resourceId) return null;
      return getResourceAuditHistory(client, params.resourceType, params.resourceId);
    },
    enabled: params.enabled ?? !!(params.resourceType && params.resourceId),
    staleTime: 30_000,
  });
}

/**
 * Hook to export audit logs
 * Requires admin role
 */
export function useAuditLogsExport(
  client: ApiClient,
  params: {
    query: AuditLogQuery;
    enabled?: boolean;
  }
) {
  return useQuery<{ exportDate: string; totalCount: number; logs: AuditLog[] }, Error>({
    queryKey: auditExport(params.query),
    queryFn: async () => {
      return exportAuditLogs(client, params.query);
    },
    enabled: params.enabled ?? false, // Manual trigger only
    staleTime: Infinity, // Export data doesn't change
  });
}
