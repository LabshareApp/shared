import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method, InternalAxiosRequestConfig } from 'axios';
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
  private readonly maxRetryMapSize = 1000; // Limit map size to prevent memory leaks

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
            
            // If refresh succeeded and we got a new token, retry the request
            if (newToken) {
              // Remove the old Authorization header so the request interceptor sets a fresh one
              delete originalRequest.headers?.Authorization;
              // Retry the request - the request interceptor will add the fresh token
              const retryResponse = await this.axios.request(originalRequest);
              // Clear retry count on successful retry
              this.retryCountMap.delete(requestKey);
              return retryResponse;
            }
            
            // If refresh returned null, session has expired
            this.logger?.error('api.token_refresh_returned_null', {});
            // Clear retry count before calling onSessionExpired
            this.retryCountMap.delete(requestKey);
            // Call onSessionExpired callback if provided (respecting session coordinator)
            if (this.tokenProvider.onSessionExpired) {
              // If session coordinator is provided, check if we should skip (user-initiated logout)
              const shouldSkip = this.tokenProvider.sessionCoordinator?.isUserInitiated() ||
                                this.tokenProvider.sessionCoordinator?.isLogoutInProgress();
              if (!shouldSkip) {
                this.tokenProvider.onSessionExpired();
              }
            }
            return Promise.reject(new ApiError('Session expired', 401, 'Your session has expired. Please sign in again.'));
          } catch (refreshError) {
            this.logger?.error('api.token_refresh_failed', { error: refreshError });
            // Clear retry count before calling onSessionExpired
            this.retryCountMap.delete(requestKey);
            // If refresh throws an error, trigger logout immediately
            // Call onSessionExpired callback if provided (respecting session coordinator)
            if (this.tokenProvider.onSessionExpired) {
              // If session coordinator is provided, check if we should skip (user-initiated logout)
              const shouldSkip = this.tokenProvider.sessionCoordinator?.isUserInitiated() ||
                                this.tokenProvider.sessionCoordinator?.isLogoutInProgress();
              if (!shouldSkip) {
                this.tokenProvider.onSessionExpired();
              }
            }
            return Promise.reject(new ApiError('Session expired', 401, 'Your session has expired. Please sign in again.'));
          }
        } else if (
          error?.response?.status === 401 &&
          !this.tokenProvider.refreshSession
        ) {
          // 401 but no refresh method available - session expired
          this.retryCountMap.delete(requestKey);
          if (this.tokenProvider.onSessionExpired) {
            // If session coordinator is provided, check if we should skip (user-initiated logout)
            const shouldSkip = this.tokenProvider.sessionCoordinator?.isUserInitiated() ||
                              this.tokenProvider.sessionCoordinator?.isLogoutInProgress();
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
      }
    );
  }

  private getRequestKey(config: InternalAxiosRequestConfig): string {
    // Create a unique key for the request based on method, URL, and query params
    const queryString = config.params 
      ? new URLSearchParams(config.params as Record<string, string>).toString() 
      : '';
    const url = config.url || '';
    const method = config.method || 'GET';
    return `${method}:${url}${queryString ? `?${queryString}` : ''}`;
  }

  private cleanupRetryCountMap(): void {
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

      // Check for network errors (no internet connection)
      // This includes timeout errors, connection refused, and other network-related failures
      const isNetworkError = 
        !err?.response && // No response means request never reached server
        (err?.code === 'ERR_NETWORK' || 
         err?.code === 'ECONNABORTED' || 
         err?.code === 'ETIMEDOUT' ||
         err?.code === 'ENOTFOUND' ||
         err?.code === 'ECONNREFUSED' ||
         err?.code === 'EHOSTUNREACH' ||
         err?.code === 'ENETUNREACH' ||
         err?.code === 'EAI_AGAIN' ||
         err?.code === 'TIMEOUT' ||
         err?.message?.toLowerCase().includes('network') ||
         err?.message?.toLowerCase().includes('connection') ||
         err?.message?.toLowerCase().includes('timeout') ||
         err?.message?.toLowerCase().includes('failed to connect') ||
         err?.message?.toLowerCase().includes('network request failed'));

      if (isNetworkError) {
        this.logger?.error('api.network_error', {
          method: req.method,
          path: req.path,
          code: err?.code,
          message: err?.message,
          ms: Date.now() - startedAt,
        });
        throw new ApiError(
          'Network Error',
          0,
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      }

      const status = err?.response?.status ?? 0;
      const rawBody = err?.response?.data ?? err?.message ?? String(err);

      // Sanitize error message to prevent leaking internal details
      let userMessage: string;
      if (typeof rawBody === 'string') {
        // Remove potential stack traces, file paths, etc.
        userMessage = rawBody
          .split('\n')[0] // Take only first line
          .replace(/at\s+.*/gi, '') // Remove stack trace patterns
          .replace(/file:\/\/.*/gi, '') // Remove file paths
          .trim();
      } else if (typeof rawBody === 'object' && rawBody !== null) {
        // If it's an object, try to extract a user-friendly message
        const bodyObj = rawBody as { message?: string; error?: string };
        userMessage = bodyObj.message || bodyObj.error || 'An error occurred';
      } else {
        userMessage = String(rawBody);
      }

      // Limit message length
      if (userMessage.length > 200) {
        userMessage = userMessage.substring(0, 200) + '...';
      }

      this.logger?.error('api.error', {
        method: req.method,
        path: req.path,
        status,
        ms: Date.now() - startedAt,
      });

      // User-facing message should not leak HTTP details
      throw new ApiError('An error occurred', status, userMessage);
    }
  }
}
