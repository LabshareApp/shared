/**
 * React Query Keys for Slack Integration
 */

export const slackKeys = {
  all: ['slack'] as const,
  integration: () => [...slackKeys.all, 'integration'] as const,
  channels: () => [...slackKeys.all, 'channels'] as const,
  oauthUrl: (redirectUri: string) => [...slackKeys.all, 'oauth-url', redirectUri] as const,
};

// Convenience functions for query keys
export const slackIntegration = () => slackKeys.integration();
export const slackChannels = () => slackKeys.channels();
export const slackOAuthUrl = (redirectUri: string) => slackKeys.oauthUrl(redirectUri);
