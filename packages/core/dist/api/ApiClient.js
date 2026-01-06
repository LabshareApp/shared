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
            var _a, _b, _c;
            const originalRequest = error.config;
            if (!originalRequest) {
                return Promise.reject(error);
            }
            const requestKey = this.getRequestKey(originalRequest);
            const retryCount = this.retryCountMap.get(requestKey) || 0;
            const maxRetries = 2;
            // If error is 401 and we haven't exceeded max retries, try to refresh token
            if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 &&
                retryCount < maxRetries &&
                this.tokenProvider.refreshSession &&
                originalRequest) {
                // Increment retry count
                this.retryCountMap.set(requestKey, retryCount + 1);
                try {
                    const newToken = await this.tokenProvider.refreshSession();
                    if (newToken && originalRequest) {
                        // Update the authorization header and retry the request
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.axios.request(originalRequest);
                    }
                }
                catch (refreshError) {
                    (_b = this.logger) === null || _b === void 0 ? void 0 : _b.error('api.token_refresh_failed', { error: refreshError });
                    // If refresh fails and we've exhausted retries, trigger logout
                    if (retryCount >= maxRetries - 1) {
                        // Call onSessionExpired callback if provided
                        if (this.tokenProvider.onSessionExpired) {
                            this.tokenProvider.onSessionExpired();
                        }
                    }
                }
            }
            else if (((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) === 401 && retryCount >= maxRetries) {
                // Max retries exceeded, trigger logout
                if (this.tokenProvider.onSessionExpired) {
                    this.tokenProvider.onSessionExpired();
                }
            }
            // Clear retry count on final failure
            this.retryCountMap.delete(requestKey);
            return Promise.reject(error);
        });
    }
    getRequestKey(config) {
        // Create a unique key for the request based on method and URL
        return `${config.method}:${config.url}`;
    }
    async request(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
            const status = (_e = (_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.status) !== null && _e !== void 0 ? _e : 0;
            const body = (_h = (_g = (_f = err === null || err === void 0 ? void 0 : err.response) === null || _f === void 0 ? void 0 : _f.data) !== null && _g !== void 0 ? _g : err === null || err === void 0 ? void 0 : err.message) !== null && _h !== void 0 ? _h : String(err);
            (_j = this.logger) === null || _j === void 0 ? void 0 : _j.error('api.error', {
                method: req.method,
                path: req.path,
                status,
                ms: Date.now() - startedAt,
            });
            // User-facing message should not leak HTTP details.
            throw new ApiError_1.ApiError('An error occurred', status, body);
        }
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=ApiClient.js.map