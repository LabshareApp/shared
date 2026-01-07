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
    path: string;
    query?: Record<string, string | number | boolean | undefined | null>;
    body?: unknown;
    signal?: AbortSignal;
}
export declare class ApiClient {
    private readonly axios;
    private readonly repositoryPrefix;
    private readonly tokenProvider;
    private readonly logger?;
    private retryCountMap;
    private readonly maxRetryMapSize;
    constructor(config: ApiClientConfig);
    private getRequestKey;
    private cleanupRetryCountMap;
    request<T>(req: ApiRequest): Promise<T>;
}
//# sourceMappingURL=ApiClient.d.ts.map