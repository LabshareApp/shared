"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditExport = exports.auditResourceHistory = exports.auditLogsList = exports.auditRoot = void 0;
const auditRoot = () => ['audit'];
exports.auditRoot = auditRoot;
const auditLogsList = (params) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return [
        ...(0, exports.auditRoot)(),
        'list',
        (_a = params.labId) !== null && _a !== void 0 ? _a : null,
        (_b = params.userId) !== null && _b !== void 0 ? _b : null,
        (_c = params.resourceType) !== null && _c !== void 0 ? _c : null,
        (_d = params.resourceId) !== null && _d !== void 0 ? _d : null,
        (_e = params.eventType) !== null && _e !== void 0 ? _e : null,
        (_f = params.startDate) !== null && _f !== void 0 ? _f : null,
        (_g = params.endDate) !== null && _g !== void 0 ? _g : null,
        (_h = params.success) !== null && _h !== void 0 ? _h : null,
        (_j = params.page) !== null && _j !== void 0 ? _j : null,
        (_k = params.pageSize) !== null && _k !== void 0 ? _k : null,
    ];
};
exports.auditLogsList = auditLogsList;
const auditResourceHistory = (resourceType, resourceId) => [...(0, exports.auditRoot)(), 'resource', resourceType !== null && resourceType !== void 0 ? resourceType : null, resourceId !== null && resourceId !== void 0 ? resourceId : null];
exports.auditResourceHistory = auditResourceHistory;
const auditExport = (params) => [...(0, exports.auditRoot)(), 'export', params];
exports.auditExport = auditExport;
//# sourceMappingURL=audit.js.map