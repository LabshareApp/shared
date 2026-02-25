"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShareLink = createShareLink;
exports.getPublicShareLink = getPublicShareLink;
exports.deleteShareLink = deleteShareLink;
exports.listShareLinks = listShareLinks;
exports.submitShareLinkRequest = submitShareLinkRequest;
/**
 * Create a share link for an item (authenticated).
 */
async function createShareLink(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/share-links',
        body: data,
    });
    return response;
}
/**
 * Get public share link data by token (no auth required).
 */
async function getPublicShareLink(client, token) {
    const response = await client.request({
        method: 'GET',
        path: '/share-link',
        query: { token },
    });
    return response;
}
/**
 * Delete (deactivate) a share link (authenticated).
 */
async function deleteShareLink(client, token) {
    await client.request({
        method: 'DELETE',
        path: '/share-links',
        query: { token },
    });
}
/**
 * List all active share links for an item (authenticated).
 */
async function listShareLinks(client, itemId, itemType) {
    const response = await client.request({
        method: 'GET',
        path: '/share-links',
        query: { itemId, itemType },
    });
    return {
        shareLinks: response.shareLinks || [],
    };
}
/**
 * Submit a request via a share link (no auth required).
 */
async function submitShareLinkRequest(client, token, data) {
    const response = await client.request({
        method: 'POST',
        path: '/share-link-request',
        query: { token },
        body: data,
    });
    return response;
}
//# sourceMappingURL=shareLinks.js.map