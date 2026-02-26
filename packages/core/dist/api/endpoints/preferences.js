"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWorkspacePrefs = fetchWorkspacePrefs;
exports.updateWorkspacePrefs = updateWorkspacePrefs;
/**
 * Fetch the user's workspace appearance preferences.
 * Returns an empty map if none are saved or on error.
 */
async function fetchWorkspacePrefs(client) {
    var _a;
    try {
        const response = await client.request({
            method: 'GET',
            path: '/preferences/workspace',
        });
        return (_a = response === null || response === void 0 ? void 0 : response.workspacePrefs) !== null && _a !== void 0 ? _a : {};
    }
    catch {
        return {};
    }
}
/**
 * Update the user's workspace appearance preferences.
 */
async function updateWorkspacePrefs(client, prefs) {
    await client.request({
        method: 'PUT',
        path: '/preferences/workspace',
        body: { workspacePrefs: prefs },
    });
}
//# sourceMappingURL=preferences.js.map