"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = decodeJWT;
exports.isTokenExpired = isTokenExpired;
exports.isTokenExpiringSoon = isTokenExpiringSoon;
exports.getTokenLabId = getTokenLabId;
exports.getTokenUserId = getTokenUserId;
function base64UrlDecode(input) {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    if (typeof atob === 'function')
        return atob(padded);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const B = globalThis.Buffer;
    if (B)
        return B.from(padded, 'base64').toString('utf8');
    throw new Error('No base64 decoder available');
}
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const payloadJson = base64UrlDecode(parts[1]);
        return JSON.parse(payloadJson);
    }
    catch {
        return null;
    }
}
function isTokenExpired(token) {
    const payload = decodeJWT(token);
    const exp = payload === null || payload === void 0 ? void 0 : payload.exp;
    if (!exp)
        return true;
    return Date.now() / 1000 > exp;
}
/**
 * Checks if a token is expiring soon (within the specified buffer time).
 * This is useful for proactive token refresh to avoid 401 errors.
 *
 * @param token - The JWT token to check
 * @param bufferSeconds - Number of seconds before expiration to consider "soon" (default: 300 = 5 minutes)
 * @returns true if token is expiring within the buffer time or already expired
 */
function isTokenExpiringSoon(token, bufferSeconds = 300) {
    const payload = decodeJWT(token);
    const exp = payload === null || payload === void 0 ? void 0 : payload.exp;
    if (!exp)
        return true; // If no expiration, treat as expiring soon
    const now = Date.now() / 1000;
    return now > (exp - bufferSeconds);
}
function getTokenLabId(token) {
    const payload = decodeJWT(token);
    if (!payload)
        return null;
    const p = payload;
    return (p.lab_id ||
        p.labId ||
        p.lab ||
        null);
}
function getTokenUserId(token) {
    var _a;
    const payload = decodeJWT(token);
    return (_a = payload === null || payload === void 0 ? void 0 : payload.sub) !== null && _a !== void 0 ? _a : null;
}
//# sourceMappingURL=jwt.js.map