import type { TokenProvider } from './TokenProvider';
import type { Logger } from '../utils/logger';
/** Optional provider that returns the active lab ID for the X-Lab-Id header. */
export type LabIdProvider = () => string | null | undefined;
export interface ApiClientConfig {
    baseUrl: string;
    repositoryPrefix?: string;
    tokenProvider: TokenProvider;
    labIdProvider?: LabIdProvider;
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
    private readonly labIdProvider?;
    private readonly logger?;
    private retryCountMap;
    private readonly maxRetryMapSize;
    constructor(config: ApiClientConfig);
    private getRequestKey;
    private cleanupRetryCountMap;
    request<T>(req: ApiRequest): Promise<T>;
}
//# sourceMappingURL=ApiClient.d.ts.map