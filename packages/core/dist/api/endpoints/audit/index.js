"use strict";
/**
 * Audit Log API Endpoints
 * Provides access to audit logs for HIPAA/SOC2 compliance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = getAuditLogs;
exports.getResourceAuditHistory = getResourceAuditHistory;
exports.exportAuditLogs = exportAuditLogs;
exports.buildAuditLogsExportUrl = buildAuditLogsExportUrl;
/**
 * Query audit logs with filters
 * Requires admin role
 */
async function getAuditLogs(client, query) {
    const queryParams = {};
    if (query) {
        if (query.userId)
            queryParams.userId = query.userId;
        if (query.resourceType)
            queryParams.resourceType = query.resourceType;
        if (query.resourceId)
            queryParams.resourceId = query.resourceId;
        if (query.eventType)
            queryParams.eventType = query.eventType;
        if (query.startDate)
            queryParams.startDate = query.startDate;
        if (query.endDate)
            queryParams.endDate = query.endDate;
        if (query.success !== undefined)
            queryParams.success = String(query.success);
        if (query.page)
            queryParams.page = String(query.page);
        if (query.pageSize)
            queryParams.pageSize = String(query.pageSize);
    }
    return client.request({
        method: 'GET',
        path: '/audit-logs',
        query: queryParams,
    });
}
/**
 * Get audit history for a specific resource
 * Requires admin role
 */
async function getResourceAuditHistory(client, resourceType, resourceId) {
    return client.request({
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
async function exportAuditLogs(client, options) {
    const queryParams = {
        format: (options === null || options === void 0 ? void 0 : options.format) || 'json',
    };
    if (options) {
        if (options.userId)
            queryParams.userId = options.userId;
        if (options.resourceType)
            queryParams.resourceType = options.resourceType;
        if (options.resourceId)
            queryParams.resourceId = options.resourceId;
        if (options.eventType)
            queryParams.eventType = options.eventType;
        if (options.startDate)
            queryParams.startDate = options.startDate;
        if (options.endDate)
            queryParams.endDate = options.endDate;
        if (options.success !== undefined)
            queryParams.success = String(options.success);
    }
    return client.request({
        method: 'GET',
        path: '/audit-logs/export',
        query: queryParams,
    });
}
/**
 * Build URL for CSV export (for direct download via browser)
 * Requires admin role
 */
function buildAuditLogsExportUrl(baseUrl, options) {
    const params = new URLSearchParams();
    params.append('format', 'csv');
    if (options) {
        if (options.userId)
            params.append('userId', options.userId);
        if (options.resourceType)
            params.append('resourceType', options.resourceType);
        if (options.resourceId)
            params.append('resourceId', options.resourceId);
        if (options.eventType)
            params.append('eventType', options.eventType);
        if (options.startDate)
            params.append('startDate', options.startDate);
        if (options.endDate)
            params.append('endDate', options.endDate);
        if (options.success !== undefined)
            params.append('success', String(options.success));
    }
    return `${baseUrl}/repository/audit-logs/export?${params.toString()}`;
}
//# sourceMappingURL=index.js.map