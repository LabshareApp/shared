"use strict";
/**
 * Audit Logging Types for HIPAA/SOC2 Compliance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUDIT_RETENTION_YEARS = exports.AUDIT_RESOURCE_LABELS = exports.AUDIT_EVENT_LABELS = void 0;
/**
 * Constants for audit event display
 */
exports.AUDIT_EVENT_LABELS = {
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
exports.AUDIT_RESOURCE_LABELS = {
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
exports.AUDIT_RETENTION_YEARS = 7;
//# sourceMappingURL=audit.js.map