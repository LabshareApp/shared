"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = require("./ApiError");
class ApiClient {
    constructor(config) {
        var _a, _b;
        this.retryCountMap = new Map(); // Track retry counts per request
        this.maxRetryMapSize = 1000; // Limit map size to prevent memory leaks
        this.repositoryPrefix = (_a = config.repositoryPrefix) !== null && _a !== void 0 ? _a : '/repository';
        this.tokenProvider = config.tokenProvider;
        this.logger = config.logger;
        this.axios = axios_1.default.create({
            baseURL: config.baseUrl,
            timeout: (_b = config.timeoutMs) !== null && _b !== void 0 ? _b : 30000,
            headers: {
                Accept: 'application/json',
            },
        });
        // Add request interceptor to add token
        this.axios.interceptors.request.use(async (config) => {
            const token = await this.tokenProvider.getAccessToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));
        // Add response interceptor for automatic token refresh on 401
        this.axios.interceptors.response.use((response) => {
            // Clear retry count on successful response
            const requestKey = this.getRequestKey(response.config);
            this.retryCountMap.delete(requestKey);
            return response;
        }, async (error) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            const originalRequest = error.config;
            if (!originalRequest) {
                return Promise.reject(error);
            }
            const requestKey = this.getRequestKey(originalRequest);
            const retryCount = this.retryCountMap.get(requestKey) || 0;
            const maxRetries = 2;
            // During grace period (right after login), skip aggressive 401 handling
            // The session may still be stabilizing - let the calling code handle errors gracefully
            if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && ((_c = (_b = this.tokenProvider).isInGracePeriod) === null || _c === void 0 ? void 0 : _c.call(_b))) {
                (_d = this.logger) === null || _d === void 0 ? void 0 : _d.debug('api.401_during_grace_period', { path: originalRequest.url });
                this.retryCountMap.delete(requestKey);
                return Promise.reject(error);
            }
            // If error is 401 and we haven't exceeded max retries, try to refresh token
            if (((_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.status) === 401 &&
                retryCount < maxRetries &&
                this.tokenProvider.refreshSession &&
                originalRequest) {
                // Increment retry count
                this.retryCountMap.set(requestKey, retryCount + 1);
                try {
                    const newToken = await this.tokenProvider.refreshSession();
                    // If refresh succeeded and we got a new token, retry the request
                    if (newToken) {
                        // Remove the old Authorization header so the request interceptor sets a fresh one
                        (_f = originalRequest.headers) === null || _f === void 0 ? true : delete _f.Authorization;
                        // Retry the request - the request interceptor will add the fresh token
                        const retryResponse = await this.axios.request(originalRequest);
                        // Clear retry count on successful retry
                        this.retryCountMap.delete(requestKey);
                        return retryResponse;
                    }
                    // If refresh returned null, session has expired
                    (_g = this.logger) === null || _g === void 0 ? void 0 : _g.error('api.token_refresh_returned_null', {});
                    // Clear retry count before calling onSessionExpired
                    this.retryCountMap.delete(requestKey);
                    // Call onSessionExpired callback if provided (respecting session coordinator)
                    if (this.tokenProvider.onSessionExpired) {
                        // If session coordinator is provided, check if we should skip (user-initiated logout)
                        const shouldSkip = ((_h = this.tokenProvider.sessionCoordinator) === null || _h === void 0 ? void 0 : _h.isUserInitiated()) ||
                            ((_j = this.tokenProvider.sessionCoordinator) === null || _j === void 0 ? void 0 : _j.isLogoutInProgress());
                        if (!shouldSkip) {
                            this.tokenProvider.onSessionExpired();
                        }
                    }
                    return Promise.reject(new ApiError_1.ApiError('Session expired', 401, 'Your session has expired. Please sign in again.'));
                }
                catch (refreshError) {
                    (_k = this.logger) === null || _k === void 0 ? void 0 : _k.error('api.token_refresh_failed', { error: refreshError });
                    // Clear retry count before calling onSessionExpired
                    this.retryCountMap.delete(requestKey);
                    // If refresh throws an error, trigger logout immediately
                    // Call onSessionExpired callback if provided (respecting session coordinator)
                    if (this.tokenProvider.onSessionExpired) {
                        // If session coordinator is provided, check if we should skip (user-initiated logout)
                        const shouldSkip = ((_l = this.tokenProvider.sessionCoordinator) === null || _l === void 0 ? void 0 : _l.isUserInitiated()) ||
                            ((_m = this.tokenProvider.sessionCoordinator) === null || _m === void 0 ? void 0 : _m.isLogoutInProgress());
                        if (!shouldSkip) {
                            this.tokenProvider.onSessionExpired();
                        }
                    }
                    return Promise.reject(new ApiError_1.ApiError('Session expired', 401, 'Your session has expired. Please sign in again.'));
                }
            }
            else if (((_o = error === null || error === void 0 ? void 0 : error.response) === null || _o === void 0 ? void 0 : _o.status) === 401 &&
                !this.tokenProvider.refreshSession) {
                // 401 but no refresh method available - session expired
                this.retryCountMap.delete(requestKey);
                if (this.tokenProvider.onSessionExpired) {
                    // If session coordinator is provided, check if we should skip (user-initiated logout)
                    const shouldSkip = ((_p = this.tokenProvider.sessionCoordinator) === null || _p === void 0 ? void 0 : _p.isUserInitiated()) ||
                        ((_q = this.tokenProvider.sessionCoordinator) === null || _q === void 0 ? void 0 : _q.isLogoutInProgress());
                    if (!shouldSkip) {
                        this.tokenProvider.onSessionExpired();
                    }
                }
            }
            // Clear retry count on final failure
            this.retryCountMap.delete(requestKey);
            // Periodic cleanup to prevent memory leaks
            this.cleanupRetryCountMap();
            return Promise.reject(error);
        });
    }
    getRequestKey(config) {
        // Create a unique key for the request based on method, URL, and query params
        const queryString = config.params
            ? new URLSearchParams(config.params).toString()
            : '';
        const url = config.url || '';
        const method = config.method || 'GET';
        return `${method}:${url}${queryString ? `?${queryString}` : ''}`;
    }
    cleanupRetryCountMap() {
        // If map gets too large, clear old entries (keep most recent 500)
        if (this.retryCountMap.size > this.maxRetryMapSize) {
            const entries = Array.from(this.retryCountMap.entries());
            // Keep the most recent entries
            const toKeep = entries.slice(-500);
            this.retryCountMap.clear();
            toKeep.forEach(([key, value]) => {
                this.retryCountMap.set(key, value);
            });
        }
    }
    async request(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const startedAt = Date.now();
        const url = `${this.repositoryPrefix}${req.path}`;
        // Token will be added by request interceptor, but we still get it here
        // for logging purposes. The interceptor ensures it's fresh.
        const token = await this.tokenProvider.getAccessToken();
        const config = {
            url,
            method: req.method,
            params: req.query,
            data: req.body,
            signal: req.signal, // Add signal support for request cancellation
            // Token is set by request interceptor, but include it here as fallback
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug('api.request', {
            method: req.method,
            path: req.path,
        });
        try {
            const res = await this.axios.request(config);
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.debug('api.response', {
                method: req.method,
                path: req.path,
                status: res.status,
                ms: Date.now() - startedAt,
            });
            return res.data;
        }
        catch (err) {
            // Don't log cancellation errors as errors
            if ((err === null || err === void 0 ? void 0 : err.name) === 'AbortError' || (err === null || err === void 0 ? void 0 : err.code) === 'ERR_CANCELED') {
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.debug('api.request_cancelled', {
                    method: req.method,
                    path: req.path,
                });
                throw err;
            }
            // Check for network errors (no internet connection)
            // This includes timeout errors, connection refused, and other network-related failures
            const isNetworkError = !(err === null || err === void 0 ? void 0 : err.response) && // No response means request never reached server
                ((err === null || err === void 0 ? void 0 : err.code) === 'ERR_NETWORK' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'ECONNABORTED' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'ETIMEDOUT' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'ENOTFOUND' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'ECONNREFUSED' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'EHOSTUNREACH' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'ENETUNREACH' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'EAI_AGAIN' ||
                    (err === null || err === void 0 ? void 0 : err.code) === 'TIMEOUT' ||
                    ((_d = err === null || err === void 0 ? void 0 : err.message) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes('network')) ||
                    ((_e = err === null || err === void 0 ? void 0 : err.message) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes('connection')) ||
                    ((_f = err === null || err === void 0 ? void 0 : err.message) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes('timeout')) ||
                    ((_g = err === null || err === void 0 ? void 0 : err.message) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes('failed to connect')) ||
                    ((_h = err === null || err === void 0 ? void 0 : err.message) === null || _h === void 0 ? void 0 : _h.toLowerCase().includes('network request failed')));
            if (isNetworkError) {
                (_j = this.logger) === null || _j === void 0 ? void 0 : _j.error('api.network_error', {
                    method: req.method,
                    path: req.path,
                    code: err === null || err === void 0 ? void 0 : err.code,
                    message: err === null || err === void 0 ? void 0 : err.message,
                    ms: Date.now() - startedAt,
                });
                throw new ApiError_1.ApiError('Network Error', 0, 'Unable to connect to the server. Please check your internet connection and try again.');
            }
            const status = (_l = (_k = err === null || err === void 0 ? void 0 : err.response) === null || _k === void 0 ? void 0 : _k.status) !== null && _l !== void 0 ? _l : 0;
            const rawBody = (_p = (_o = (_m = err === null || err === void 0 ? void 0 : err.response) === null || _m === void 0 ? void 0 : _m.data) !== null && _o !== void 0 ? _o : err === null || err === void 0 ? void 0 : err.message) !== null && _p !== void 0 ? _p : String(err);
            // Sanitize error message to prevent leaking internal details
            let userMessage;
            if (typeof rawBody === 'string') {
                // Remove potential stack traces, file paths, etc.
                userMessage = rawBody
                    .split('\n')[0] // Take only first line
                    .replace(/at\s+.*/gi, '') // Remove stack trace patterns
                    .replace(/file:\/\/.*/gi, '') // Remove file paths
                    .trim();
            }
            else if (typeof rawBody === 'object' && rawBody !== null) {
                // If it's an object, try to extract a user-friendly message
                const bodyObj = rawBody;
                userMessage = bodyObj.message || bodyObj.error || 'An error occurred';
            }
            else {
                userMessage = String(rawBody);
            }
            // Limit message length
            if (userMessage.length > 200) {
                userMessage = userMessage.substring(0, 200) + '...';
            }
            (_q = this.logger) === null || _q === void 0 ? void 0 : _q.error('api.error', {
                method: req.method,
                path: req.path,
                status,
                ms: Date.now() - startedAt,
            });
            // User-facing message should not leak HTTP details
            throw new ApiError_1.ApiError('An error occurred', status, userMessage);
        }
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=ApiClient.js.map