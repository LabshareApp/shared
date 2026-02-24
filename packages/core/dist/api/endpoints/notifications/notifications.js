"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDevice = registerDevice;
exports.deregisterDevice = deregisterDevice;
exports.subscribeToTopic = subscribeToTopic;
exports.listInventoryNotifications = listInventoryNotifications;
exports.markNotificationRead = markNotificationRead;
exports.createInventoryNotification = createInventoryNotification;
exports.getNotificationPreferences = getNotificationPreferences;
exports.updateNotificationPreferences = updateNotificationPreferences;
exports.createTopic = createTopic;
exports.listTopics = listTopics;
exports.sendToTopic = sendToTopic;
const responseValidation_1 = require("../../responseValidation");
// IMPORTANT: these endpoints are NOT under /repository; callers should create an ApiClient with
// repositoryPrefix: '' (empty string), so paths like '/notifications/...' resolve correctly.
async function registerDevice(client, registration) {
    const res = await client.request({
        method: 'POST',
        path: '/notifications/register-device',
        body: registration,
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'registerDevice', ['success']);
}
async function deregisterDevice(client, deviceId) {
    const res = await client.request({
        method: 'POST',
        path: '/notifications/deregister-device',
        body: { deviceId },
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'deregisterDevice', ['success']);
}
async function subscribeToTopic(client, topicId) {
    const res = await client.request({
        method: 'POST',
        path: '/notifications/topics/subscribe',
        body: { topicId },
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'subscribeToTopic', ['success']);
}
async function listInventoryNotifications(client, limit = 20) {
    const res = await client.request({
        method: 'GET',
        path: '/notifications/inventory/list',
        query: { limit },
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'listInventoryNotifications');
}
async function markNotificationRead(client, notificationType, notificationId) {
    const res = await client.request({
        method: 'POST',
        path: `/notifications/${notificationType}/mark-read`,
        body: { notificationId },
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'markNotificationRead', ['success']);
}
async function createInventoryNotification(client, payload) {
    const res = await client.request({
        method: 'POST',
        path: '/notifications/inventory/create',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'createInventoryNotification', ['success']);
}
async function getNotificationPreferences(client) {
    const res = await client.request({
        method: 'GET',
        path: '/notifications/preferences',
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'getNotificationPreferences');
}
async function updateNotificationPreferences(client, preferences) {
    const res = await client.request({
        method: 'PUT',
        path: '/notifications/preferences',
        body: preferences,
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'updateNotificationPreferences');
}
async function createTopic(client, topicData) {
    const res = await client.request({
        method: 'POST',
        path: '/notifications/topics/create',
        body: topicData,
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'createTopic', ['id', 'name']);
}
async function listTopics(client, type) {
    const res = await client.request({
        method: 'GET',
        path: '/notifications/topics/list',
        query: type ? { type } : undefined,
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'listTopics');
}
async function sendToTopic(client, data) {
    const res = await client.request({
        method: 'POST',
        path: '/notifications/topics/send',
        body: data,
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'sendToTopic', ['success']);
}
//# sourceMappingURL=notifications.js.map