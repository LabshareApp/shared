/**
 * React Query Keys for Slack Integration
 */
export declare const slackKeys: {
    all: readonly ["slack"];
    integration: () => readonly ["slack", "integration"];
    channels: () => readonly ["slack", "channels"];
    oauthUrl: (redirectUri: string) => readonly ["slack", "oauth-url", string];
};
export declare const slackIntegration: () => readonly ["slack", "integration"];
export declare const slackChannels: () => readonly ["slack", "channels"];
export declare const slackOAuthUrl: (redirectUri: string) => readonly ["slack", "oauth-url", string];
//# sourceMappingURL=slack.d.ts.map