import type { ApiClient } from '../../ApiClient';
import type {
  DeviceRegistration,
  InventoryNotification,
  NotificationPreferences,
  ServerResponse,
  Topic,
} from '../../../types/notifications';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

// IMPORTANT: these endpoints are NOT under /repository; callers should create an ApiClient with
// repositoryPrefix: '' (empty string), so paths like '/notifications/...' resolve correctly.

export async function registerDevice(client: ApiClient, registration: DeviceRegistration): Promise<ServerResponse> {
  const res = await client.request<ServerResponse>({
    method: 'POST',
    path: '/notifications/register-device',
    body: registration,
  });
  return validateObjectResponse(res, 'registerDevice', ['success'] as any) as any;
}

export async function deregisterDevice(client: ApiClient, deviceId: string): Promise<ServerResponse> {
  const res = await client.request<ServerResponse>({
    method: 'POST',
    path: '/notifications/deregister-device',
    body: { deviceId },
  });
  return validateObjectResponse(res, 'deregisterDevice', ['success'] as any) as any;
}

export async function subscribeToTopic(client: ApiClient, topicId: string): Promise<ServerResponse> {
  const res = await client.request<ServerResponse>({
    method: 'POST',
    path: '/notifications/topics/subscribe',
    body: { topicId },
  });
  return validateObjectResponse(res, 'subscribeToTopic', ['success'] as any) as any;
}

export async function listInventoryNotifications(
  client: ApiClient,
  limit: number = 20
): Promise<InventoryNotification[]> {
  const res = await client.request<InventoryNotification[]>({
    method: 'GET',
    path: '/notifications/inventory/list',
    query: { limit },
  });
  return validateArrayResponse<InventoryNotification>(res, 'listInventoryNotifications');
}

export async function markNotificationRead(
  client: ApiClient,
  notificationType: 'inventory',
  notificationId: string
): Promise<ServerResponse> {
  const res = await client.request<ServerResponse>({
    method: 'POST',
    path: `/notifications/${notificationType}/mark-read`,
    body: { notificationId },
  });
  return validateObjectResponse(res, 'markNotificationRead', ['success'] as any) as any;
}

export async function createInventoryNotification(
  client: ApiClient,
  payload: {
    type: string;
    title: string;
    message: string;
    itemIds?: string[];
    urgency: 'high' | 'medium' | 'low';
    data?: Record<string, any>;
  }
): Promise<ServerResponse> {
  const res = await client.request<ServerResponse>({
    method: 'POST',
    path: '/notifications/inventory/create',
    body: payload,
  });
  return validateObjectResponse(res, 'createInventoryNotification', ['success'] as any) as any;
}

export async function getNotificationPreferences(client: ApiClient): Promise<NotificationPreferences> {
  const res = await client.request<NotificationPreferences>({
    method: 'GET',
    path: '/notifications/preferences',
  });
  return validateObjectResponse(res, 'getNotificationPreferences') as any;
}

export async function updateNotificationPreferences(
  client: ApiClient,
  preferences: Record<string, any>
): Promise<NotificationPreferences> {
  const res = await client.request<NotificationPreferences>({
    method: 'PUT',
    path: '/notifications/preferences',
    body: preferences,
  });
  return validateObjectResponse(res, 'updateNotificationPreferences') as any;
}

export async function createTopic(
  client: ApiClient,
  topicData: { name: string; type: 'inventory'; description?: string }
): Promise<Topic> {
  const res = await client.request<Topic>({
    method: 'POST',
    path: '/notifications/topics/create',
    body: topicData,
  });
  return validateObjectResponse(res, 'createTopic', ['_id', 'name'] as any) as any;
}

export async function listTopics(client: ApiClient, type?: 'inventory'): Promise<Topic[]> {
  const res = await client.request<Topic[]>({
    method: 'GET',
    path: '/notifications/topics/list',
    query: type ? { type } : undefined,
  });
  return validateArrayResponse<Topic>(res, 'listTopics');
}

export async function sendToTopic(
  client: ApiClient,
  data: { topicId: string; title: string; message: string; data?: Record<string, any> }
): Promise<ServerResponse> {
  const res = await client.request<ServerResponse>({
    method: 'POST',
    path: '/notifications/topics/send',
    body: data,
  });
  return validateObjectResponse(res, 'sendToTopic', ['success'] as any) as any;
}



