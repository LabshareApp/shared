/**
 * React Query Hooks for Slack Integration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@labshare/shared-core';
import type {
  SlackIntegration,
  SlackConnectRequest,
  SlackUpdateSettingsRequest,
  SlackChannelsResponse,
} from '@labshare/shared-core';

import {
  getSlackIntegration,
  getSlackOAuthURL,
  connectSlack,
  updateSlackSettings,
  disconnectSlack,
  listSlackChannels,
  testSlackConnection,
} from '@labshare/shared-core';

import { slackIntegration, slackChannels, slackOAuthUrl } from '../queryKeys/slack';

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to get the current Slack integration
 */
export function useSlackIntegration(
  client: ApiClient,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery<SlackIntegration | null, Error>({
    queryKey: slackIntegration(),
    queryFn: () => getSlackIntegration(client),
    enabled: options?.enabled ?? true,
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Hook to get the Slack OAuth URL
 */
export function useSlackOAuthURL(
  client: ApiClient,
  redirectUri: string,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery<string, Error>({
    queryKey: slackOAuthUrl(redirectUri),
    queryFn: () => getSlackOAuthURL(client, redirectUri),
    enabled: options?.enabled ?? !!redirectUri,
    staleTime: 300_000, // 5 minutes - URL doesn't change often
  });
}

/**
 * Hook to list available Slack channels
 */
export function useSlackChannels(
  client: ApiClient,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery<SlackChannelsResponse, Error>({
    queryKey: slackChannels(),
    queryFn: () => listSlackChannels(client),
    enabled: options?.enabled ?? true,
    staleTime: 60_000, // 1 minute
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to connect Slack workspace
 */
export function useConnectSlack(client: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation<SlackIntegration, Error, SlackConnectRequest>({
    mutationFn: (request) => connectSlack(client, request),
    onSuccess: (data) => {
      queryClient.setQueryData(slackIntegration(), data);
      // Invalidate channels since we now have a connection
      queryClient.invalidateQueries({ queryKey: slackChannels() });
    },
  });
}

/**
 * Hook to update Slack settings
 */
export function useUpdateSlackSettings(client: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation<SlackIntegration, Error, SlackUpdateSettingsRequest>({
    mutationFn: (settings) => updateSlackSettings(client, settings),
    onSuccess: (data) => {
      queryClient.setQueryData(slackIntegration(), data);
    },
  });
}

/**
 * Hook to disconnect Slack
 */
export function useDisconnectSlack(client: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => disconnectSlack(client),
    onSuccess: () => {
      queryClient.setQueryData(slackIntegration(), null);
      // Invalidate channels since connection is gone
      queryClient.invalidateQueries({ queryKey: slackChannels() });
    },
  });
}

/**
 * Hook to test Slack connection
 */
export function useTestSlackConnection(client: ApiClient) {
  return useMutation<void, Error, string | undefined>({
    mutationFn: (channelId) => testSlackConnection(client, channelId),
  });
}
