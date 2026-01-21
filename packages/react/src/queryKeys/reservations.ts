/**
 * Query keys for the Reservation System
 */
export const reservationKeys = {
  // Base keys
  machines: ['machines'] as const,
  machineTags: ['machineTags'] as const,
  reservations: ['reservations'] as const,
  recurringRules: ['recurringRules'] as const,

  // Machine Tags
  machineTagsAll: () => ['machineTags', 'all'] as const,

  // Machines
  machinesAll: (activeOnly?: boolean) => ['machines', 'all', activeOnly ?? false] as const,
  machineDetail: (machineId: string | null) => ['machines', 'detail', machineId] as const,

  // Reservations
  reservationsList: (machineId: string, start?: string, end?: string) =>
    ['reservations', 'list', machineId, start ?? null, end ?? null] as const,
  reservationDetail: (reservationId: string | null) =>
    ['reservations', 'detail', reservationId] as const,
  myReservations: (includeHistory?: boolean) =>
    ['reservations', 'my', includeHistory ?? false] as const,
  pendingApprovals: () => ['reservations', 'pendingApprovals'] as const,
  availability: (machineId: string, start: string, end: string, slotIndex?: number) =>
    ['reservations', 'availability', machineId, start, end, slotIndex ?? null] as const,

  // Recurring Rules
  recurringRulesAll: () => ['recurringRules', 'all'] as const,
  recurringRuleDetail: (ruleId: string | null) => ['recurringRules', 'detail', ruleId] as const,
};
