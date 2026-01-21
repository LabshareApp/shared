"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationKeys = void 0;
/**
 * Query keys for the Reservation System
 */
exports.reservationKeys = {
    // Base keys
    machines: ['machines'],
    machineTags: ['machineTags'],
    reservations: ['reservations'],
    recurringRules: ['recurringRules'],
    // Machine Tags
    machineTagsAll: () => ['machineTags', 'all'],
    // Machines
    machinesAll: (activeOnly) => ['machines', 'all', activeOnly !== null && activeOnly !== void 0 ? activeOnly : false],
    machineDetail: (machineId) => ['machines', 'detail', machineId],
    // Reservations
    reservationsList: (machineId, start, end) => ['reservations', 'list', machineId, start !== null && start !== void 0 ? start : null, end !== null && end !== void 0 ? end : null],
    reservationDetail: (reservationId) => ['reservations', 'detail', reservationId],
    myReservations: (includeHistory) => ['reservations', 'my', includeHistory !== null && includeHistory !== void 0 ? includeHistory : false],
    pendingApprovals: () => ['reservations', 'pendingApprovals'],
    availability: (machineId, start, end, slotIndex) => ['reservations', 'availability', machineId, start, end, slotIndex !== null && slotIndex !== void 0 ? slotIndex : null],
    // Recurring Rules
    recurringRulesAll: () => ['recurringRules', 'all'],
    recurringRuleDetail: (ruleId) => ['recurringRules', 'detail', ruleId],
};
//# sourceMappingURL=reservations.js.map