"use strict";
/**
 * React Query Keys for Slack Integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackOAuthUrl = exports.slackChannels = exports.slackIntegration = exports.slackKeys = void 0;
exports.slackKeys = {
    all: ['slack'],
    integration: () => [...exports.slackKeys.all, 'integration'],
    channels: () => [...exports.slackKeys.all, 'channels'],
    oauthUrl: (redirectUri) => [...exports.slackKeys.all, 'oauth-url', redirectUri],
};
// Convenience functions for query keys
const slackIntegration = () => exports.slackKeys.integration();
exports.slackIntegration = slackIntegration;
const slackChannels = () => exports.slackKeys.channels();
exports.slackChannels = slackChannels;
const slackOAuthUrl = (redirectUri) => exports.slackKeys.oauthUrl(redirectUri);
exports.slackOAuthUrl = slackOAuthUrl;
//# sourceMappingURL=slack.js.map