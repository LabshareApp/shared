import type { ApiClient, DeviceRegistration, InventoryNotification, NotificationPreferences, ServerResponse, Topic } from '@labshare/shared-core';
export declare function useRegisterDevice(client: ApiClient): import("@tanstack/react-query").UseMutationResult<ServerResponse, Error, DeviceRegistration, unknown>;
export declare function useDeregisterDevice(client: ApiClient): import("@tanstack/react-query").UseMutationResult<ServerResponse, Error, {
    deviceId: string;
}, unknown>;
export declare function useSubscribeToTopic(client: ApiClient): import("@tanstack/react-query").UseMutationResult<ServerResponse, Error, {
    topicId: string;
}, unknown>;
export declare function useInventoryNotifications(client: ApiClient, params: {
    labId: string | null | undefined;
    limit?: number;
}): import("@tanstack/react-query").UseQueryResult<InventoryNotification[], Error>;
export declare function useMarkNotificationRead(client: ApiClient, params: {
    notificationType: 'inventory';
    labId: string | null | undefined;
    limit?: number;
}): import("@tanstack/react-query").UseMutationResult<ServerResponse, Error, {
    notificationId: string;
}, unknown>;
export declare function useCreateInventoryNotification(client: ApiClient): import("@tanstack/react-query").UseMutationResult<ServerResponse, Error, {
    type: string;
    title: string;
    message: string;
    itemIds?: string[];
    urgency: "high" | "medium" | "low";
    data?: Record<string, any>;
}, unknown>;
export declare function useNotificationPreferences(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<NotificationPreferences, Error>;
export declare function useUpdateNotificationPreferences(client: ApiClient): import("@tanstack/react-query").UseMutationResult<NotificationPreferences, Error, Record<string, any>, unknown>;
export declare function useCreateTopic(client: ApiClient): import("@tanstack/react-query").UseMutationResult<Topic, Error, {
    name: string;
    type: "inventory";
    description?: string;
}, unknown>;
export declare function useTopics(client: ApiClient, type?: 'inventory'): import("@tanstack/react-query").UseQueryResult<Topic[], Error>;
export declare function useSendToTopic(client: ApiClient): import("@tanstack/react-query").UseMutationResult<ServerResponse, Error, {
    topicId: string;
    title: string;
    message: string;
    data?: Record<string, any>;
}, unknown>;
//# sourceMappingURL=notifications.d.ts.map