import type { ApiClient } from '../../ApiClient';
import type { DeviceRegistration, InventoryNotification, NotificationPreferences, ServerResponse, Topic } from '../../../types/notifications';
export declare function registerDevice(client: ApiClient, registration: DeviceRegistration): Promise<ServerResponse>;
export declare function deregisterDevice(client: ApiClient, deviceId: string): Promise<ServerResponse>;
export declare function subscribeToTopic(client: ApiClient, topicId: string): Promise<ServerResponse>;
export declare function listInventoryNotifications(client: ApiClient, limit?: number): Promise<InventoryNotification[]>;
export declare function markNotificationRead(client: ApiClient, notificationType: 'inventory', notificationId: string): Promise<ServerResponse>;
export declare function createInventoryNotification(client: ApiClient, payload: {
    type: string;
    title: string;
    message: string;
    itemIds?: string[];
    urgency: 'high' | 'medium' | 'low';
    data?: Record<string, any>;
}): Promise<ServerResponse>;
export declare function getNotificationPreferences(client: ApiClient): Promise<NotificationPreferences>;
export declare function updateNotificationPreferences(client: ApiClient, preferences: Record<string, any>): Promise<NotificationPreferences>;
export declare function createTopic(client: ApiClient, topicData: {
    name: string;
    type: 'inventory';
    description?: string;
}): Promise<Topic>;
export declare function listTopics(client: ApiClient, type?: 'inventory'): Promise<Topic[]>;
export declare function sendToTopic(client: ApiClient, data: {
    topicId: string;
    title: string;
    message: string;
    data?: Record<string, any>;
}): Promise<ServerResponse>;
//# sourceMappingURL=notifications.d.ts.map