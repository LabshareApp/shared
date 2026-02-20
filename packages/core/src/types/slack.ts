/**
 * Slack Integration Types
 *
 * Type definitions for Slack workspace integration.
 */

/**
 * Slack integration configuration for a lab
 */
export interface SlackIntegration {
  id: string;
  labId: string;
  teamId: string;
  teamName?: string;
  botUserId?: string;
  defaultChannelId?: string;
  defaultChannelName?: string;
  notifyOnCheckout: boolean;
  notifyOnReservation: boolean;
  notifyOnInvoice: boolean;
  notifyOnOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Slack channel information
 */
export interface SlackChannel {
  id: string;
  name: string;
  isPrivate: boolean;
}

/**
 * Request to connect Slack workspace (OAuth code exchange)
 */
export interface SlackConnectRequest {
  code: string;
  redirectUri: string;
}

/**
 * Request to update Slack notification settings
 */
export interface SlackUpdateSettingsRequest {
  defaultChannelId?: string;
  defaultChannelName?: string;
  notifyOnCheckout?: boolean;
  notifyOnReservation?: boolean;
  notifyOnInvoice?: boolean;
  notifyOnOverdue?: boolean;
}

/**
 * Response containing Slack OAuth URL
 */
export interface SlackOAuthURLResponse {
  url: string;
}

/**
 * Response containing available Slack channels
 */
export interface SlackChannelsResponse {
  channels: SlackChannel[];
}

/**
 * Generic message response
 */
export interface SlackMessageResponse {
  message: string;
}
