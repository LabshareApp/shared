import type { AuditLogQuery, AuditResourceType, AuditEventType } from '@labshare/shared-core';

export const auditRoot = () => ['audit'] as const;

export const auditLogsList = (params: {
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
}) =>
  [
    ...auditRoot(),
    'list',
    params.labId ?? null,
    params.userId ?? null,
    params.resourceType ?? null,
    params.resourceId ?? null,
    params.eventType ?? null,
    params.startDate ?? null,
    params.endDate ?? null,
    params.success ?? null,
    params.page ?? null,
    params.pageSize ?? null,
  ] as const;

export const auditResourceHistory = (resourceType: string | null, resourceId: string | null) =>
  [...auditRoot(), 'resource', resourceType ?? null, resourceId ?? null] as const;

export const auditExport = (params: AuditLogQuery) =>
  [...auditRoot(), 'export', params] as const;
