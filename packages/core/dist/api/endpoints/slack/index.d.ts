/**
 * Slack Integration API Endpoints
 *
 * Provides API client functions for Slack integration management.
 */
import type { ApiClient } from '../../ApiClient';
import type { SlackIntegration, SlackConnectRequest, SlackUpdateSettingsRequest, SlackChannelsResponse } from '../../../types/slack';
/**
 * Get the current Slack integration for the lab
 * Returns null if no integration exists
 */
export declare function getSlackIntegration(client: ApiClient): Promise<SlackIntegration | null>;
/**
 * Get the Slack OAuth URL for connecting a workspace
 */
export declare function getSlackOAuthURL(client: ApiClient, redirectUri: string): Promise<string>;
/**
 * Connect Slack workspace using OAuth code
 */
export declare function connectSlack(client: ApiClient, request: SlackConnectRequest): Promise<SlackIntegration>;
/**
 * Update Slack notification settings
 */
export declare function updateSlackSettings(client: ApiClient, settings: SlackUpdateSettingsRequest): Promise<SlackIntegration>;
/**
 * Disconnect Slack workspace
 */
export declare function disconnectSlack(client: ApiClient): Promise<void>;
/**
 * List available Slack channels
 */
export declare function listSlackChannels(client: ApiClient): Promise<SlackChannelsResponse>;
/**
 * Send a test message to verify the integration
 */
export declare function testSlackConnection(client: ApiClient, channelId?: string): Promise<void>;
//# sourceMappingURL=index.d.ts.map