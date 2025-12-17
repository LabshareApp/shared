export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';
export interface Logger {
    debug(event: string, fields?: Record<string, unknown>): void;
    info(event: string, fields?: Record<string, unknown>): void;
    warn(event: string, fields?: Record<string, unknown>): void;
    error(event: string, fields?: Record<string, unknown>): void;
}
export declare function createLogger(options?: {
    level?: LogLevel;
    prefix?: string;
}): Logger;
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map