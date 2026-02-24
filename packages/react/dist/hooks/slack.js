"use strict";
/**
 * React Query Hooks for Slack Integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSlackIntegration = useSlackIntegration;
exports.useSlackOAuthURL = useSlackOAuthURL;
exports.useSlackChannels = useSlackChannels;
exports.useConnectSlack = useConnectSlack;
exports.useUpdateSlackSettings = useUpdateSlackSettings;
exports.useDisconnectSlack = useDisconnectSlack;
exports.useTestSlackConnection = useTestSlackConnection;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const slack_1 = require("../queryKeys/slack");
// ============================================================================
// Query Hooks
// ============================================================================
/**
 * Hook to get the current Slack integration
 */
function useSlackIntegration(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: (0, slack_1.slackIntegration)(),
        queryFn: () => (0, shared_core_1.getSlackIntegration)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 60000, // 1 minute
    });
}
/**
 * Hook to get the Slack OAuth URL
 */
function useSlackOAuthURL(client, redirectUri, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: (0, slack_1.slackOAuthUrl)(redirectUri),
        queryFn: () => (0, shared_core_1.getSlackOAuthURL)(client, redirectUri),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : !!redirectUri,
        staleTime: 300000, // 5 minutes - URL doesn't change often
    });
}
/**
 * Hook to list available Slack channels
 */
function useSlackChannels(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: (0, slack_1.slackChannels)(),
        queryFn: () => (0, shared_core_1.listSlackChannels)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
        staleTime: 60000, // 1 minute
    });
}
// ============================================================================
// Mutation Hooks
// ============================================================================
/**
 * Hook to connect Slack workspace
 */
function useConnectSlack(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (request) => (0, shared_core_1.connectSlack)(client, request),
        onSuccess: (data) => {
            queryClient.setQueryData((0, slack_1.slackIntegration)(), data);
            // Invalidate channels since we now have a connection
            queryClient.invalidateQueries({ queryKey: (0, slack_1.slackChannels)() });
        },
    });
}
/**
 * Hook to update Slack settings
 */
function useUpdateSlackSettings(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (settings) => (0, shared_core_1.updateSlackSettings)(client, settings),
        onSuccess: (data) => {
            queryClient.setQueryData((0, slack_1.slackIntegration)(), data);
        },
    });
}
/**
 * Hook to disconnect Slack
 */
function useDisconnectSlack(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: () => (0, shared_core_1.disconnectSlack)(client),
        onSuccess: () => {
            queryClient.setQueryData((0, slack_1.slackIntegration)(), null);
            // Invalidate channels since connection is gone
            queryClient.invalidateQueries({ queryKey: (0, slack_1.slackChannels)() });
        },
    });
}
/**
 * Hook to test Slack connection
 */
function useTestSlackConnection(client) {
    return (0, react_query_1.useMutation)({
        mutationFn: (channelId) => (0, shared_core_1.testSlackConnection)(client, channelId),
    });
}
//# sourceMappingURL=slack.js.map