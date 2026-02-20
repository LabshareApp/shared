/**
 * Audit Logging Types for HIPAA/SOC2 Compliance
 */

/**
 * Event types for audit logs
 */
export type AuditEventType = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'AUTH' | 'EXPORT';

/**
 * Resource types that can be audited
 */
export type AuditResourceType =
  | 'INVENTORY'
  | 'ORDER_REQUEST'
  | 'GRANT'
  | 'TAG'
  | 'PROFILE'
  | 'LAB'
  | 'MEMBERSHIP'
  | 'INVITATION'
  | 'RESERVATION'
  | 'MACHINE'
  | 'TOOL'
  | 'TOOL_CHECKOUT'
  | 'INVOICE'
  | 'AUDIT_LOG';

/**
 * Represents a single field change in an update operation
 */
export interface AuditFieldChange {
  field: string;
  oldValue?: unknown;
  newValue?: unknown;
}

/**
 * Audit log entry stored in MongoDB
 */
export interface AuditLog {
  id: string;
  timestamp: string; // ISO 8601 date string
  eventType: AuditEventType;
  resourceType: AuditResourceType;
  resourceId?: string;
  userId: string;
  userEmail?: string;
  labId?: string;
  institutionId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  success: boolean;
  errorMessage?: string;
  changes?: AuditFieldChange[];
  details?: Record<string, unknown>;
  retentionDate?: string; // ISO 8601 date string - when log expires (typically 7 years for HIPAA)
  createdAt: string;
}

/**
 * Query parameters for filtering audit logs
 */
export interface AuditLogQuery {
  userId?: string;
  labId?: string;
  resourceType?: AuditResourceType;
  resourceId?: string;
  eventType?: AuditEventType;
  startDate?: string; // ISO 8601 date string
  endDate?: string;   // ISO 8601 date string
  success?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Paginated audit log result
 */
export interface AuditLogResult {
  logs: AuditLog[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Resource audit history (all events for a specific resource)
 */
export interface ResourceAuditHistory {
  logs: AuditLog[];
  resourceType: AuditResourceType;
  resourceId: string;
}

/**
 * Export options for audit log export
 */
export interface AuditExportOptions extends AuditLogQuery {
  format?: 'json' | 'csv';
}

/**
 * Constants for audit event display
 */
export const AUDIT_EVENT_LABELS: Record<AuditEventType, string> = {
  READ: 'Viewed',
  CREATE: 'Created',
  UPDATE: 'Updated',
  DELETE: 'Deleted',
  AUTH: 'Authentication',
  EXPORT: 'Exported',
};

/**
 * Constants for resource type display
 */
export const AUDIT_RESOURCE_LABELS: Record<AuditResourceType, string> = {
  INVENTORY: 'Inventory Item',
  ORDER_REQUEST: 'Order Request',
  GRANT: 'Grant',
  TAG: 'Tag',
  PROFILE: 'User Profile',
  LAB: 'Lab',
  MEMBERSHIP: 'Lab Membership',
  INVITATION: 'Invitation',
  RESERVATION: 'Reservation',
  MACHINE: 'Machine',
  TOOL: 'Tool',
  TOOL_CHECKOUT: 'Tool Checkout',
  INVOICE: 'Invoice',
  AUDIT_LOG: 'Audit Log',
};

/**
 * Default retention period in years (for HIPAA compliance)
 */
export const AUDIT_RETENTION_YEARS = 7;
