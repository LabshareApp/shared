/**
 * React Query Hooks for Slack Integration
 */
import type { ApiClient } from '@labshare/shared-core';
/**
 * Hook to get the current Slack integration
 */
export declare function useSlackIntegration(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<any, Error>;
/**
 * Hook to get the Slack OAuth URL
 */
export declare function useSlackOAuthURL(client: ApiClient, redirectUri: string, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<string, Error>;
/**
 * Hook to list available Slack channels
 */
export declare function useSlackChannels(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<SlackChannelsResponse, Error>;
/**
 * Hook to connect Slack workspace
 */
export declare function useConnectSlack(client: ApiClient): import("@tanstack/react-query").UseMutationResult<SlackIntegration, Error, SlackConnectRequest, unknown>;
/**
 * Hook to update Slack settings
 */
export declare function useUpdateSlackSettings(client: ApiClient): import("@tanstack/react-query").UseMutationResult<SlackIntegration, Error, SlackUpdateSettingsRequest, unknown>;
/**
 * Hook to disconnect Slack
 */
export declare function useDisconnectSlack(client: ApiClient): import("@tanstack/react-query").UseMutationResult<void, Error, void, unknown>;
/**
 * Hook to test Slack connection
 */
export declare function useTestSlackConnection(client: ApiClient): import("@tanstack/react-query").UseMutationResult<void, Error, string | undefined, unknown>;
//# sourceMappingURL=slack.d.ts.map