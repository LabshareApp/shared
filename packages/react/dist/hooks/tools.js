"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTools = useTools;
exports.useTool = useTool;
exports.useAvailableTools = useAvailableTools;
exports.useToolCheckouts = useToolCheckouts;
exports.useMyCheckouts = useMyCheckouts;
exports.useToolRequiredFields = useToolRequiredFields;
exports.useToolMutations = useToolMutations;
exports.useToolImageUpload = useToolImageUpload;
exports.useMaintenanceRequests = useMaintenanceRequests;
exports.useMaintenanceRequest = useMaintenanceRequest;
exports.useToolMaintenanceHistory = useToolMaintenanceHistory;
exports.useMaintenanceMutations = useMaintenanceMutations;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const tools_1 = require("../queryKeys/tools");
// =============================================================================
// Tool Query Hooks
// =============================================================================
function useTools(client, params) {
    const { enabled, ...queryParams } = params !== null && params !== void 0 ? params : {};
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.toolsList(queryParams),
        queryFn: async () => (0, shared_core_1.fetchTools)(client, queryParams),
        enabled: enabled !== null && enabled !== void 0 ? enabled : true,
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}
function useTool(client, params) {
    var _a;
    const normalizedId = params.toolId ? String(params.toolId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.toolDetail(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            return (0, shared_core_1.getTool)(client, normalizedId);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 60 * 1000,
    });
}
function useAvailableTools(client, params) {
    const { enabled, ...queryParams } = params !== null && params !== void 0 ? params : {};
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.availableTools(queryParams),
        queryFn: async () => (0, shared_core_1.getAvailableTools)(client, queryParams),
        enabled: enabled !== null && enabled !== void 0 ? enabled : true,
        staleTime: 60 * 1000,
    });
}
function useToolCheckouts(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.toolCheckouts(params.toolId, params.checkoutParams),
        queryFn: async () => (0, shared_core_1.getToolCheckouts)(client, params.toolId, params.checkoutParams),
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.toolId,
        staleTime: 60 * 1000,
    });
}
function useMyCheckouts(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.myCheckouts(params === null || params === void 0 ? void 0 : params.allLabs),
        queryFn: async () => (0, shared_core_1.getMyCheckouts)(client, params),
        enabled: (_a = params === null || params === void 0 ? void 0 : params.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 60 * 1000,
    });
}
// =============================================================================
// Tool Required Fields Hooks
// =============================================================================
function useToolRequiredFields(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.requiredFields(),
        queryFn: async () => (0, shared_core_1.fetchToolRequiredFields)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 5 * 60 * 1000,
    });
}
// =============================================================================
// Tool Mutation Hooks
// =============================================================================
function useToolMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createToolMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createTool)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.tools });
        },
    });
    const updateToolMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.updateTool)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.tools });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.toolDetail(variables.id) });
        },
    });
    const deleteToolMutation = (0, react_query_1.useMutation)({
        mutationFn: (id) => (0, shared_core_1.deleteTool)(client, id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.tools });
            queryClient.removeQueries({ queryKey: tools_1.toolKeys.toolDetail(variables) });
        },
    });
    const checkoutToolMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.checkoutTool)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.tools });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.toolDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.checkouts });
        },
    });
    const returnToolMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.returnTool)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.tools });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.toolDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.checkouts });
        },
    });
    const logAccessMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.logToolAccess)(client, id, data),
    });
    const updateRequiredFieldsMutation = (0, react_query_1.useMutation)({
        mutationFn: (fields) => (0, shared_core_1.updateToolRequiredFields)(client, fields),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.requiredFields() });
        },
    });
    return {
        createToolMutation,
        updateToolMutation,
        deleteToolMutation,
        checkoutToolMutation,
        returnToolMutation,
        logAccessMutation,
        updateRequiredFieldsMutation,
    };
}
// =============================================================================
// Tool Image Hooks
// =============================================================================
function useToolImageUpload(client) {
    const generatePresignedUrlMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.generateToolImagePresignedUrl)(client, data),
    });
    const getViewUrlMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.getToolImageViewUrl)(client, data),
    });
    return {
        generatePresignedUrlMutation,
        getViewUrlMutation,
    };
}
// =============================================================================
// Maintenance Hooks
// =============================================================================
function useMaintenanceRequests(client, params) {
    const { enabled, ...queryParams } = params !== null && params !== void 0 ? params : {};
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.maintenanceList(queryParams),
        queryFn: async () => (0, shared_core_1.listMaintenanceRequests)(client, queryParams),
        enabled: enabled !== null && enabled !== void 0 ? enabled : true,
        staleTime: 60 * 1000,
    });
}
function useMaintenanceRequest(client, params) {
    var _a;
    const normalizedId = params.requestId ? String(params.requestId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.maintenanceDetail(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                return null;
            return (0, shared_core_1.getMaintenanceRequest)(client, normalizedId);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 60 * 1000,
    });
}
function useToolMaintenanceHistory(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: tools_1.toolKeys.toolMaintenanceHistory(params.toolId),
        queryFn: async () => (0, shared_core_1.getToolMaintenanceHistory)(client, params.toolId),
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.toolId,
        staleTime: 60 * 1000,
    });
}
function useMaintenanceMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const createMaintenanceRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createMaintenanceRequest)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.maintenance });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.tools });
        },
    });
    const updateMaintenanceRequestMutation = (0, react_query_1.useMutation)({
        mutationFn: ({ id, data }) => (0, shared_core_1.updateMaintenanceRequest)(client, id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.maintenance });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.maintenanceDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: tools_1.toolKeys.tools });
        },
    });
    return {
        createMaintenanceRequestMutation,
        updateMaintenanceRequestMutation,
    };
}
//# sourceMappingURL=tools.js.map