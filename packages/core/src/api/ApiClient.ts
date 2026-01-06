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
  signal?: AbortSignal; // Add signal support for request cancellation
}

export class ApiClient {
  private readonly axios: AxiosInstance;
  private readonly repositoryPrefix: string;
  private readonly tokenProvider: TokenProvider;
  private readonly logger?: Logger;
  private retryCountMap: Map<string, number> = new Map(); // Track retry counts per request

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

    // Add request interceptor to add token
    this.axios.interceptors.request.use(
      async (config) => {
        const token = await this.tokenProvider.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for automatic token refresh on 401
    this.axios.interceptors.response.use(
      (response) => {
        // Clear retry count on successful response
        const requestKey = this.getRequestKey(response.config);
        this.retryCountMap.delete(requestKey);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) {
          return Promise.reject(error);
        }

        const requestKey = this.getRequestKey(originalRequest);
        const retryCount = this.retryCountMap.get(requestKey) || 0;
        const maxRetries = 2;

        // If error is 401 and we haven't exceeded max retries, try to refresh token
        if (
          error?.response?.status === 401 &&
          retryCount < maxRetries &&
          this.tokenProvider.refreshSession &&
          originalRequest
        ) {
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
          } catch (refreshError) {
            this.logger?.error('api.token_refresh_failed', { error: refreshError });
            
            // If refresh fails and we've exhausted retries, trigger logout
            if (retryCount >= maxRetries - 1) {
              // Call onSessionExpired callback if provided
              if (this.tokenProvider.onSessionExpired) {
                this.tokenProvider.onSessionExpired();
              }
            }
          }
        } else if (error?.response?.status === 401 && retryCount >= maxRetries) {
          // Max retries exceeded, trigger logout
          if (this.tokenProvider.onSessionExpired) {
            this.tokenProvider.onSessionExpired();
          }
        }

        // Clear retry count on final failure
        this.retryCountMap.delete(requestKey);
        return Promise.reject(error);
      }
    );
  }

  private getRequestKey(config: any): string {
    // Create a unique key for the request based on method and URL
    return `${config.method}:${config.url}`;
  }

  async request<T>(req: ApiRequest): Promise<T> {
    const startedAt = Date.now();
    const url = `${this.repositoryPrefix}${req.path}`;

    // Token will be added by request interceptor, but we still get it here
    // for logging purposes. The interceptor ensures it's fresh.
    const token = await this.tokenProvider.getAccessToken();

    const config: AxiosRequestConfig = {
      url,
      method: req.method as Method,
      params: req.query,
      data: req.body,
      signal: req.signal, // Add signal support for request cancellation
      // Token is set by request interceptor, but include it here as fallback
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
      // Don't log cancellation errors as errors
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        this.logger?.debug('api.request_cancelled', {
          method: req.method,
          path: req.path,
        });
        throw err;
      }

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
