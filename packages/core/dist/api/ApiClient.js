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
    }
    async request(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const startedAt = Date.now();
        const url = `${this.repositoryPrefix}${req.path}`;
        const token = await this.tokenProvider.getAccessToken();
        const config = {
            url,
            method: req.method,
            params: req.query,
            data: req.body,
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