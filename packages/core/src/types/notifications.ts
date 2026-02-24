export type NotificationType = 'GENERIC' | 'LOW_STOCK' | 'EXPIRATION_WARNING';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  itemId?: string;
}

export interface DeviceRegistration {
  token: string;
  platform: string; // "ios" or "android"
  deviceId: string;
  isDevelopmentBuild?: boolean;
}

export interface ServerResponse {
  success: boolean;
  message?: string;
  endpointArn?: string;
  deviceId?: string;
  notificationId?: string;
  preferenceId?: string;
  topicId?: string;
  error?: string;
}

export interface BaseNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  createdBy: string;
  readBy: string[];
  data?: Record<string, any>;
  labId: string;
}

export interface InventoryNotification extends BaseNotification {
  itemIds?: string[];
  urgency: 'high' | 'medium' | 'low';
}

export interface Topic {
  id: string;
  name: string;
  displayName: string;
  type: 'inventory';
  description?: string;
  topicArn: string;
  labId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export interface NotificationPreferences {
  id?: string;
  userId: string;
  labId: string;
  inventory: {
    enabled: boolean;
    expiringItems: boolean;
    lowInventory: boolean;
    uploadComplete: boolean;
  };
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PushNotificationData {
  type?: string;
  title?: string;
  body?: string;
  screen?: string;
  itemId?: string;
  labId?: string;
  notificationId?: string;
  [key: string]: any;
}




