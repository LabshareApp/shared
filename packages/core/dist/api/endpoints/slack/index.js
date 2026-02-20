"use strict";
/**
 * Slack Integration API Endpoints
 *
 * Provides API client functions for Slack integration management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlackIntegration = getSlackIntegration;
exports.getSlackOAuthURL = getSlackOAuthURL;
exports.connectSlack = connectSlack;
exports.updateSlackSettings = updateSlackSettings;
exports.disconnectSlack = disconnectSlack;
exports.listSlackChannels = listSlackChannels;
exports.testSlackConnection = testSlackConnection;
const responseValidation_1 = require("../../responseValidation");
// ============================================================================
// Get Integration
// ============================================================================
/**
 * Get the current Slack integration for the lab
 * Returns null if no integration exists
 */
async function getSlackIntegration(client) {
    const response = await client.request({
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
async function getSlackOAuthURL(client, redirectUri) {
    const response = await client.request({
        method: 'GET',
        path: '/integrations/slack/oauth-url',
        query: { redirectUri },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'getSlackOAuthURL', ['url']);
    return validated.url;
}
/**
 * Connect Slack workspace using OAuth code
 */
async function connectSlack(client, request) {
    const response = await client.request({
        method: 'POST',
        path: '/integrations/slack/connect',
        body: request,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'connectSlack', ['id', 'teamId']);
}
// ============================================================================
// Settings Management
// ============================================================================
/**
 * Update Slack notification settings
 */
async function updateSlackSettings(client, settings) {
    const response = await client.request({
        method: 'PUT',
        path: '/integrations/slack/settings',
        body: settings,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'updateSlackSettings', ['id', 'teamId']);
}
/**
 * Disconnect Slack workspace
 */
async function disconnectSlack(client) {
    await client.request({
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
async function listSlackChannels(client) {
    const response = await client.request({
        method: 'GET',
        path: '/integrations/slack/channels',
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'listSlackChannels', ['channels']);
}
// ============================================================================
// Testing
// ============================================================================
/**
 * Send a test message to verify the integration
 */
async function testSlackConnection(client, channelId) {
    await client.request({
        method: 'POST',
        path: '/integrations/slack/test',
        body: channelId ? { channelId } : {},
    });
}
//# sourceMappingURL=index.js.map