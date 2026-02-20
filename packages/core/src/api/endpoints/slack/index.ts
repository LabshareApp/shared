/**
 * Slack Integration API Endpoints
 *
 * Provides API client functions for Slack integration management.
 */

import type { ApiClient } from '../../ApiClient';
import { validateObjectResponse } from '../../responseValidation';
import type {
  SlackIntegration,
  SlackConnectRequest,
  SlackUpdateSettingsRequest,
  SlackOAuthURLResponse,
  SlackChannelsResponse,
  SlackMessageResponse,
} from '../../../types/slack';

// ============================================================================
// Get Integration
// ============================================================================

/**
 * Get the current Slack integration for the lab
 * Returns null if no integration exists
 */
export async function getSlackIntegration(
  client: ApiClient
): Promise<SlackIntegration | null> {
  const response = await client.request<SlackIntegration | null>({
    method: 'GET',
    path: '/integrations/slack',
  });

  // API returns null if no integration
  if (response === null || response === undefined) {
    return null;
  }

  return response;
}

// ============================================================================
// OAuth Flow
// ============================================================================

/**
 * Get the Slack OAuth URL for connecting a workspace
 */
export async function getSlackOAuthURL(
  client: ApiClient,
  redirectUri: string
): Promise<string> {
  const response = await client.request<SlackOAuthURLResponse>({
    method: 'GET',
    path: '/integrations/slack/oauth-url',
    query: { redirectUri },
  });

  const validated = validateObjectResponse(response, 'getSlackOAuthURL', ['url']);
  return (validated as SlackOAuthURLResponse).url;
}

/**
 * Connect Slack workspace using OAuth code
 */
export async function connectSlack(
  client: ApiClient,
  request: SlackConnectRequest
): Promise<SlackIntegration> {
  const response = await client.request<SlackIntegration>({
    method: 'POST',
    path: '/integrations/slack/connect',
    body: request,
  });

  return validateObjectResponse(response, 'connectSlack', ['id', 'teamId']) as SlackIntegration;
}

// ============================================================================
// Settings Management
// ============================================================================

/**
 * Update Slack notification settings
 */
export async function updateSlackSettings(
  client: ApiClient,
  settings: SlackUpdateSettingsRequest
): Promise<SlackIntegration> {
  const response = await client.request<SlackIntegration>({
    method: 'PUT',
    path: '/integrations/slack/settings',
    body: settings,
  });

  return validateObjectResponse(response, 'updateSlackSettings', ['id', 'teamId']) as SlackIntegration;
}

/**
 * Disconnect Slack workspace
 */
export async function disconnectSlack(
  client: ApiClient
): Promise<void> {
  await client.request<SlackMessageResponse>({
    method: 'DELETE',
    path: '/integrations/slack/disconnect',
  });
}

// ============================================================================
// Channels
// ============================================================================

/**
 * List available Slack channels
 */
export async function listSlackChannels(
  client: ApiClient
): Promise<SlackChannelsResponse> {
  const response = await client.request<SlackChannelsResponse>({
    method: 'GET',
    path: '/integrations/slack/channels',
  });

  return validateObjectResponse(response, 'listSlackChannels', ['channels']) as SlackChannelsResponse;
}

// ============================================================================
// Testing
// ============================================================================

/**
 * Send a test message to verify the integration
 */
export async function testSlackConnection(
  client: ApiClient,
  channelId?: string
): Promise<void> {
  await client.request<SlackMessageResponse>({
    method: 'POST',
    path: '/integrations/slack/test',
    body: channelId ? { channelId } : {},
  });
}
