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
        // Add response interceptor for automatic token refresh on 401
        this.axios.interceptors.response.use((response) => response, async (error) => {
            var _a, _b;
            const originalRequest = error.config;
            // If error is 401 and we haven't already retried, try to refresh token
            if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 &&
                !originalRequest._retry &&
                this.tokenProvider.refreshSession &&
                originalRequest) {
                originalRequest._retry = true;
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
                    // If refresh fails, reject with original error
                }
            }
            return Promise.reject(error);
        });
    }
    async request(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
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
            const status = (_d = (_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 0;
            const body = (_g = (_f = (_e = err === null || err === void 0 ? void 0 : err.response) === null || _e === void 0 ? void 0 : _e.data) !== null && _f !== void 0 ? _f : err === null || err === void 0 ? void 0 : err.message) !== null && _g !== void 0 ? _g : String(err);
            (_h = this.logger) === null || _h === void 0 ? void 0 : _h.error('api.error', {
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