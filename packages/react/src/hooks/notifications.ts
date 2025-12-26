import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  DeviceRegistration,
  InventoryNotification,
  NotificationPreferences,
  ServerResponse,
  Topic,
} from '@labshare/shared-core';
import {
  createInventoryNotification,
  createTopic,
  deregisterDevice,
  getNotificationPreferences,
  listInventoryNotifications,
  listTopics,
  markNotificationRead,
  registerDevice,
  sendToTopic,
  subscribeToTopic,
  updateNotificationPreferences,
} from '@labshare/shared-core';

import { notificationKeys } from '../queryKeys/notifications';

export function useRegisterDevice(client: ApiClient) {
  const qc = useQueryClient();
  return useMutation<ServerResponse, Error, DeviceRegistration>({
    mutationFn: (registration) => registerDevice(client, registration),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.deviceRegistration() });
    },
  });
}

export function useDeregisterDevice(client: ApiClient) {
  return useMutation<ServerResponse, Error, { deviceId: string }>({
    mutationFn: ({ deviceId }) => deregisterDevice(client, deviceId),
  });
}

export function useSubscribeToTopic(client: ApiClient) {
  return useMutation<ServerResponse, Error, { topicId: string }>({
    mutationFn: ({ topicId }) => subscribeToTopic(client, topicId),
  });
}

export function useInventoryNotifications(client: ApiClient, params: { labId: string | null | undefined; limit?: number }) {
  const limit = params.limit ?? 20;
  return useQuery<InventoryNotification[], Error>({
    queryKey: notificationKeys.inventoryNotifications(params.labId, limit),
    queryFn: () => listInventoryNotifications(client, limit),
    enabled: !!params.labId,
  });
}

export function useMarkNotificationRead(
  client: ApiClient,
  params: { notificationType: 'inventory'; labId: string | null | undefined; limit?: number }
) {
  const qc = useQueryClient();
  const limit = params.limit ?? 20;
  const key = notificationKeys.inventoryNotifications(params.labId, limit);

  return useMutation<ServerResponse, Error, { notificationId: string }>({
    mutationFn: ({ notificationId }) => markNotificationRead(client, params.notificationType, notificationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useCreateInventoryNotification(client: ApiClient) {
  const qc = useQueryClient();
  return useMutation<
    ServerResponse,
    Error,
    {
      type: string;
      title: string;
      message: string;
      itemIds?: string[];
      urgency: 'high' | 'medium' | 'low';
      data?: Record<string, any>;
    }
  >({
    mutationFn: (payload) => createInventoryNotification(client, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventoryNotifications'] }),
  });
}

export function useNotificationPreferences(client: ApiClient, options?: { enabled?: boolean }) {
  return useQuery<NotificationPreferences, Error>({
    queryKey: notificationKeys.notificationPreferences(),
    queryFn: () => getNotificationPreferences(client),
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateNotificationPreferences(client: ApiClient) {
  const qc = useQueryClient();
  return useMutation<NotificationPreferences, Error, Record<string, any>>({
    mutationFn: (prefs) => updateNotificationPreferences(client, prefs),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.notificationPreferences() }),
  });
}

export function useCreateTopic(client: ApiClient) {
  const qc = useQueryClient();
  return useMutation<Topic, Error, { name: string; type: 'inventory'; description?: string }>({
    mutationFn: (data) => createTopic(client, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.topics('inventory') }),
  });
}

export function useTopics(client: ApiClient, type?: 'inventory') {
  return useQuery<Topic[], Error>({
    queryKey: notificationKeys.topics(type),
    queryFn: () => listTopics(client, type),
    enabled: true,
  });
}

export function useSendToTopic(client: ApiClient) {
  return useMutation<ServerResponse, Error, { topicId: string; title: string; message: string; data?: Record<string, any> }>(
    {
      mutationFn: (data) => sendToTopic(client, data),
    }
  );
}



