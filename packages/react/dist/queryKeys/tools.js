"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolKeys = void 0;
/**
 * Query keys for the Tools System
 */
exports.toolKeys = {
    // Base keys
    tools: ['tools'],
    checkouts: ['toolCheckouts'],
    maintenance: ['toolMaintenance'],
    // Tools
    toolsList: (params) => ['tools', 'list', params !== null && params !== void 0 ? params : {}],
    toolDetail: (toolId) => ['tools', 'detail', toolId],
    availableTools: (params) => ['tools', 'available', params !== null && params !== void 0 ? params : {}],
    // Checkouts
    toolCheckouts: (toolId, params) => ['toolCheckouts', 'list', toolId, params !== null && params !== void 0 ? params : {}],
    myCheckouts: (allLabs) => ['toolCheckouts', 'my', allLabs !== null && allLabs !== void 0 ? allLabs : false],
    // Maintenance
    maintenanceList: (params) => ['toolMaintenance', 'list', params !== null && params !== void 0 ? params : {}],
    maintenanceDetail: (requestId) => ['toolMaintenance', 'detail', requestId],
    toolMaintenanceHistory: (toolId) => ['toolMaintenance', 'history', toolId],
    // Required Fields
    requiredFields: () => ['tools', 'requiredFields'],
};
//# sourceMappingURL=tools.js.map