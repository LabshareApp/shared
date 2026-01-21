/**
 * Query keys for the Reservation System
 */
export declare const reservationKeys: {
    machines: readonly ["machines"];
    machineTags: readonly ["machineTags"];
    reservations: readonly ["reservations"];
    recurringRules: readonly ["recurringRules"];
    machineTagsAll: () => readonly ["machineTags", "all"];
    machinesAll: (activeOnly?: boolean) => readonly ["machines", "all", boolean];
    machineDetail: (machineId: string | null) => readonly ["machines", "detail", string | null];
    reservationsList: (machineId: string, start?: string, end?: string) => readonly ["reservations", "list", string, string | null, string | null];
    reservationDetail: (reservationId: string | null) => readonly ["reservations", "detail", string | null];
    myReservations: (includeHistory?: boolean) => readonly ["reservations", "my", boolean];
    pendingApprovals: () => readonly ["reservations", "pendingApprovals"];
    availability: (machineId: string, start: string, end: string, slotIndex?: number) => readonly ["reservations", "availability", string, string, string, number | null];
    recurringRulesAll: () => readonly ["recurringRules", "all"];
    recurringRuleDetail: (ruleId: string | null) => readonly ["recurringRules", "detail", string | null];
};
//# sourceMappingURL=reservations.d.ts.map