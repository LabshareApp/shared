/**
 * Query keys for the Tools System
 */
export declare const toolKeys: {
    tools: readonly ["tools"];
    checkouts: readonly ["toolCheckouts"];
    maintenance: readonly ["toolMaintenance"];
    toolsList: (params?: Record<string, unknown>) => readonly ["tools", "list", Record<string, unknown>];
    toolDetail: (toolId: string | null) => readonly ["tools", "detail", string | null];
    availableTools: (params?: Record<string, unknown>) => readonly ["tools", "available", Record<string, unknown>];
    toolCheckouts: (toolId: string, params?: Record<string, unknown>) => readonly ["toolCheckouts", "list", string, Record<string, unknown>];
    myCheckouts: (allLabs?: boolean) => readonly ["toolCheckouts", "my", boolean];
    maintenanceList: (params?: Record<string, unknown>) => readonly ["toolMaintenance", "list", Record<string, unknown>];
    maintenanceDetail: (requestId: string | null) => readonly ["toolMaintenance", "detail", string | null];
    toolMaintenanceHistory: (toolId: string) => readonly ["toolMaintenance", "history", string];
    requiredFields: () => readonly ["tools", "requiredFields"];
};
//# sourceMappingURL=tools.d.ts.map