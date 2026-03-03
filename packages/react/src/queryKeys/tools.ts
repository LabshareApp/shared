/**
 * Query keys for the Tools System
 */
export const toolKeys = {
  // Base keys
  tools: ['tools'] as const,
  checkouts: ['toolCheckouts'] as const,
  maintenance: ['toolMaintenance'] as const,

  // Tools
  toolsList: (params?: Record<string, unknown>) => ['tools', 'list', params ?? {}] as const,
  toolDetail: (toolId: string | null) => ['tools', 'detail', toolId] as const,
  availableTools: (params?: Record<string, unknown>) => ['tools', 'available', params ?? {}] as const,

  // Checkouts
  toolCheckouts: (toolId: string, params?: Record<string, unknown>) =>
    ['toolCheckouts', 'list', toolId, params ?? {}] as const,
  myCheckouts: (allLabs?: boolean) => ['toolCheckouts', 'my', allLabs ?? false] as const,

  // Maintenance
  maintenanceList: (params?: Record<string, unknown>) =>
    ['toolMaintenance', 'list', params ?? {}] as const,
  maintenanceDetail: (requestId: string | null) =>
    ['toolMaintenance', 'detail', requestId] as const,
  toolMaintenanceHistory: (toolId: string) =>
    ['toolMaintenance', 'history', toolId] as const,

  // Required Fields
  requiredFields: () => ['tools', 'requiredFields'] as const,
};
