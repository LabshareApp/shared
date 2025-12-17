"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = decodeJWT;
exports.isTokenExpired = isTokenExpired;
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