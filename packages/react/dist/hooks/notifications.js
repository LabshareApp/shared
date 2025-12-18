"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegisterDevice = useRegisterDevice;
exports.useDeregisterDevice = useDeregisterDevice;
exports.useSubscribeToTopic = useSubscribeToTopic;
exports.useInventoryNotifications = useInventoryNotifications;
exports.useMarkNotificationRead = useMarkNotificationRead;
exports.useCreateInventoryNotification = useCreateInventoryNotification;
exports.useNotificationPreferences = useNotificationPreferences;
exports.useUpdateNotificationPreferences = useUpdateNotificationPreferences;
exports.useCreateTopic = useCreateTopic;
exports.useTopics = useTopics;
exports.useSendToTopic = useSendToTopic;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const notifications_1 = require("../queryKeys/notifications");
function useRegisterDevice(client) {
    const qc = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (registration) => (0, shared_core_1.registerDevice)(client, registration),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: notifications_1.notificationKeys.deviceRegistration() });
        },
    });
}
function useDeregisterDevice(client) {
    return (0, react_query_1.useMutation)({
        mutationFn: ({ deviceId }) => (0, shared_core_1.deregisterDevice)(client, deviceId),
    });
}
function useSubscribeToTopic(client) {
    return (0, react_query_1.useMutation)({
        mutationFn: ({ topicId }) => (0, shared_core_1.subscribeToTopic)(client, topicId),
    });
}
function useInventoryNotifications(client, params) {
    var _a;
    const limit = (_a = params.limit) !== null && _a !== void 0 ? _a : 20;
    return (0, react_query_1.useQuery)({
        queryKey: notifications_1.notificationKeys.inventoryNotifications(params.labId, limit),
        queryFn: () => (0, shared_core_1.listInventoryNotifications)(client, limit),
        enabled: !!params.labId,
    });
}
function useMarkNotificationRead(client, params) {
    var _a;
    const qc = (0, react_query_1.useQueryClient)();
    const limit = (_a = params.limit) !== null && _a !== void 0 ? _a : 20;
    const key = notifications_1.notificationKeys.inventoryNotifications(params.labId, limit);
    return (0, react_query_1.useMutation)({
        mutationFn: ({ notificationId }) => (0, shared_core_1.markNotificationRead)(client, params.notificationType, notificationId),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
}
function useCreateInventoryNotification(client) {
    const qc = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (payload) => (0, shared_core_1.createInventoryNotification)(client, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['inventoryNotifications'] }),
    });
}
function useNotificationPreferences(client, options) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: notifications_1.notificationKeys.notificationPreferences(),
        queryFn: () => (0, shared_core_1.getNotificationPreferences)(client),
        enabled: (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true,
    });
}
function useUpdateNotificationPreferences(client) {
    const qc = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (prefs) => (0, shared_core_1.updateNotificationPreferences)(client, prefs),
        onSuccess: () => qc.invalidateQueries({ queryKey: notifications_1.notificationKeys.notificationPreferences() }),
    });
}
function useCreateTopic(client) {
    const qc = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createTopic)(client, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: notifications_1.notificationKeys.topics('inventory') }),
    });
}
function useTopics(client, type) {
    return (0, react_query_1.useQuery)({
        queryKey: notifications_1.notificationKeys.topics(type),
        queryFn: () => (0, shared_core_1.listTopics)(client, type),
        enabled: true,
    });
}
function useSendToTopic(client) {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.sendToTopic)(client, data),
    });
}
//# sourceMappingURL=notifications.js.map