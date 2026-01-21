"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMachineTags = useMachineTags;
exports.useMachineTagMutations = useMachineTagMutations;
exports.useMachines = useMachines;
exports.useMachine = useMachine;
exports.useMachineMutations = useMachineMutations;
exports.useReservations = useReservations;
exports.useMyReservations = useMyReservations;
exports.useReservation = useReservation;
exports.useCheckAvailability = useCheckAvailability;
exports.usePendingApprovals = usePendingApprovals;
exports.useReservationMutations = useReservationMutations;
exports.useRecurringRules = useRecurringRules;
exports.useRecurringRule = useRecurringRule;
exports.useRecurringRuleMutations = useRecurringRuleMutations;
exports.useMachineImageUpload = useMachineImageUpload;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const reservations_1 = require("../queryKeys/reservations");
// =============================================================================
// Machine Tags Hooks
// =============================================================================
function useMachineTags(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.machineTagsAll(),
        queryFn: async () => (0, shared_core_1.fetchMachineTags)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 30 * 60 * 1000, // 30 minutes (tags change infrequently)
        gcTime: 60 * 60 * 1000, // 1 hour
    });
}
function useMachineTagMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createTagMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createMachineTag)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.machineTagsAll() });
        },
    });
    const updateTagMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.updateMachineTag)(client, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.machineTagsAll() });
        },
    });
    const deleteTagMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => (0, shared_core_1.deleteMachineTag)(client, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.machineTagsAll() });
        },
    });
    return {
        createTagMutation,
        updateTagMutation,
        deleteTagMutation,
    };
}
// =============================================================================
// Machines Hooks
// =============================================================================
function useMachines(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.machinesAll(params === null || params === void 0 ? void 0 : params.activeOnly),
        queryFn: async () => (0, shared_core_1.fetchMachines)(client, params),
        enabled: (_a = params === null || params === void 0 ? void 0 : params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}
function useMachine(client, params) {
    var _a;
    const normalizedId = params.machineId ? String(params.machineId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.machineDetail(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            try {
                return await (0, shared_core_1.fetchMachine)(client, normalizedId);
            }
            catch (e) {
                if ((e === null || e === void 0 ? void 0 : e.status) === 404)
                    return null;
                throw e;
            }
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
function useMachineMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createMachineMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createMachine)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.machines });
        },
    });
    const updateMachineMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.updateMachine)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.machines });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.machineDetail(variables.id) });
        },
    });
    const deleteMachineMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => (0, shared_core_1.deleteMachine)(client, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.machines });
            queryClient.removeQueries({ queryKey: reservations_1.reservationKeys.machineDetail(variables) });
        },
    });
    return {
        createMachineMutation,
        updateMachineMutation,
        deleteMachineMutation,
    };
}
// =============================================================================
// Reservations Hooks
// =============================================================================
function useReservations(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.reservationsList(params.machineId, params.start, params.end),
        queryFn: async () => (0, shared_core_1.fetchReservations)(client, params),
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.machineId,
        staleTime: 60 * 1000, // 1 minute (reservations change frequently)
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}
function useMyReservations(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.myReservations(params === null || params === void 0 ? void 0 : params.includeHistory),
        queryFn: async () => (0, shared_core_1.fetchMyReservations)(client, params),
        enabled: (_a = params === null || params === void 0 ? void 0 : params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}
function useReservation(client, params) {
    var _a;
    const normalizedId = params.reservationId ? String(params.reservationId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.reservationDetail(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            try {
                return await (0, shared_core_1.fetchReservation)(client, normalizedId);
            }
            catch (e) {
                if ((e === null || e === void 0 ? void 0 : e.status) === 404)
                    return null;
                throw e;
            }
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 60 * 1000, // 1 minute
    });
}
function useCheckAvailability(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.availability(params.machineId, params.start, params.end, params.slotIndex),
        queryFn: async () => (0, shared_core_1.checkAvailability)(client, params),
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : (!!params.machineId && !!params.start && !!params.end),
        staleTime: 30 * 1000, // 30 seconds (availability can change quickly)
        gcTime: 60 * 1000, // 1 minute
    });
}
function usePendingApprovals(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.pendingApprovals(),
        queryFn: async () => (0, shared_core_1.fetchPendingApprovals)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}
function useReservationMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createReservationMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createReservation)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.pendingApprovals() });
        },
    });
    const updateReservationMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.updateReservation)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservationDetail(variables.id) });
        },
    });
    const cancelReservationMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => (0, shared_core_1.cancelReservation)(client, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservationDetail(variables) });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.pendingApprovals() });
        },
    });
    const approveReservationMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => (0, shared_core_1.approveReservation)(client, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservationDetail(variables) });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.pendingApprovals() });
        },
    });
    const rejectReservationMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.rejectReservation)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservationDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.pendingApprovals() });
        },
    });
    const checkInMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => (0, shared_core_1.checkInReservation)(client, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservationDetail(variables) });
        },
    });
    const checkOutMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => (0, shared_core_1.checkOutReservation)(client, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservationDetail(variables) });
        },
    });
    return {
        createReservationMutation,
        updateReservationMutation,
        cancelReservationMutation,
        approveReservationMutation,
        rejectReservationMutation,
        checkInMutation,
        checkOutMutation,
    };
}
// =============================================================================
// Recurring Rules Hooks
// =============================================================================
function useRecurringRules(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.recurringRulesAll(),
        queryFn: async () => (0, shared_core_1.fetchRecurringRules)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}
function useRecurringRule(client, params) {
    var _a;
    const normalizedId = params.ruleId ? String(params.ruleId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: reservations_1.reservationKeys.recurringRuleDetail(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            try {
                return await (0, shared_core_1.fetchRecurringRule)(client, normalizedId);
            }
            catch (e) {
                if ((e === null || e === void 0 ? void 0 : e.status) === 404)
                    return null;
                throw e;
            }
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
function useRecurringRuleMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createRuleMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createRecurringRule)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.recurringRules });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
        },
    });
    const updateRuleMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.updateRecurringRule)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.recurringRules });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.recurringRuleDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
        },
    });
    const deactivateRuleMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, params }) => (0, shared_core_1.deactivateRecurringRule)(client, id, params),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.recurringRules });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.recurringRuleDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: reservations_1.reservationKeys.reservations });
        },
    });
    return {
        createRuleMutation,
        updateRuleMutation,
        deactivateRuleMutation,
    };
}
// =============================================================================
// Machine Image Upload Hooks
// =============================================================================
function useMachineImageUpload(client) {
    const generatePresignedUrlMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.generateMachineImagePresignedUrl)(client, data),
    });
    const getViewUrlMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.getMachineImageViewUrl)(client, data),
    });
    return {
        generatePresignedUrlMutation,
        getViewUrlMutation,
    };
}
//# sourceMappingURL=reservations.js.map