import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { ApiError } from './ApiError';
import type { TokenProvider } from './TokenProvider';
import type { Logger } from '../utils/logger';

export interface ApiClientConfig {
  baseUrl: string;
  repositoryPrefix?: string;
  tokenProvider: TokenProvider;
  logger?: Logger;
  timeoutMs?: number;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string; // e.g. '/items/list'
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

export class ApiClient {
  private readonly axios: AxiosInstance;
  private readonly repositoryPrefix: string;
  private readonly tokenProvider: TokenProvider;
  private readonly logger?: Logger;

  constructor(config: ApiClientConfig) {
    this.repositoryPrefix = config.repositoryPrefix ?? '/repository';
    this.tokenProvider = config.tokenProvider;
    this.logger = config.logger;

    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs ?? 30000,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async request<T>(req: ApiRequest): Promise<T> {
    const startedAt = Date.now();
    const url = `${this.repositoryPrefix}${req.path}`;

    const token = await this.tokenProvider.getAccessToken();

    const config: AxiosRequestConfig = {
      url,
      method: req.method as Method,
      params: req.query,
      data: req.body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    };

    this.logger?.debug('api.request', {
      method: req.method,
      path: req.path,
    });

    try {
      const res: AxiosResponse<T> = await this.axios.request<T>(config);
      this.logger?.debug('api.response', {
        method: req.method,
        path: req.path,
        status: res.status,
        ms: Date.now() - startedAt,
      });
      return res.data;
    } catch (err: any) {
      const status = err?.response?.status ?? 0;
      const body = err?.response?.data ?? err?.message ?? String(err);

      this.logger?.error('api.error', {
        method: req.method,
        path: req.path,
        status,
        ms: Date.now() - startedAt,
      });

      // User-facing message should not leak HTTP details.
      throw new ApiError('An error occurred', status, body);
    }
  }
}
