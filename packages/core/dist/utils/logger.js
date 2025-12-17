"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createLogger = createLogger;
const levelOrder = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    silent: 50,
};
function defaultLevelFromEnv() {
    var _a;
    const env = (_a = process === null || process === void 0 ? void 0 : process.env) !== null && _a !== void 0 ? _a : {};
    const explicit = env.LOG_LEVEL;
    if (explicit && explicit in levelOrder)
        return explicit;
    const runtimeEnv = (env.NEXT_PUBLIC_ENV ||
        env.EXPO_PUBLIC_ENV ||
        env.NODE_ENV ||
        '').toLowerCase();
    if (runtimeEnv === 'prod' || runtimeEnv === 'production')
        return 'warn';
    return 'info';
}
function shouldLog(minLevel, msgLevel) {
    return levelOrder[msgLevel] >= levelOrder[minLevel];
}
function safeFields(fields) {
    if (!fields)
        return undefined;
    // Minimal redaction (expand later in Phase 2/8).
    const redactedKeys = new Set(['authorization', 'access_token', 'refresh_token', 'token']);
    const out = {};
    for (const [k, v] of Object.entries(fields)) {
        out[k] = redactedKeys.has(k.toLowerCase()) ? '[REDACTED]' : v;
    }
    return out;
}
function createLogger(options) {
    var _a, _b;
    const level = (_a = options === null || options === void 0 ? void 0 : options.level) !== null && _a !== void 0 ? _a : defaultLevelFromEnv();
    const prefix = (_b = options === null || options === void 0 ? void 0 : options.prefix) !== null && _b !== void 0 ? _b : 'labshare';
    const log = (msgLevel, event, fields) => {
        if (!shouldLog(level, msgLevel))
            return;
        const payload = safeFields(fields);
        const line = payload ? { event, ...payload } : { event };
        const tag = `[${prefix}]`;
        if (msgLevel === 'debug')
            console.debug(tag, line);
        else if (msgLevel === 'info')
            console.info(tag, line);
        else if (msgLevel === 'warn')
            console.warn(tag, line);
        else if (msgLevel === 'error')
            console.error(tag, line);
    };
    return {
        debug: (event, fields) => log('debug', event, fields),
        info: (event, fields) => log('info', event, fields),
        warn: (event, fields) => log('warn', event, fields),
        error: (event, fields) => log('error', event, fields),
    };
}
exports.logger = createLogger();
//# sourceMappingURL=logger.js.map