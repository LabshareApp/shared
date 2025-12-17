export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface Logger {
  debug(event: string, fields?: Record<string, unknown>): void;
  info(event: string, fields?: Record<string, unknown>): void;
  warn(event: string, fields?: Record<string, unknown>): void;
  error(event: string, fields?: Record<string, unknown>): void;
}

// We want to read env vars in both Node (Next SSR/build) and browser-like bundles,
// without forcing a Node typings dependency in shared/core.
declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50,
};

function defaultLevelFromEnv(): LogLevel {
  const env = process?.env ?? {};
  const explicit = env.LOG_LEVEL as LogLevel | undefined;
  if (explicit && explicit in levelOrder) return explicit;

  const runtimeEnv = (
    env.NEXT_PUBLIC_ENV ||
    env.EXPO_PUBLIC_ENV ||
    env.NODE_ENV ||
    ''
  ).toLowerCase();
  if (runtimeEnv === 'prod' || runtimeEnv === 'production') return 'warn';
  return 'info';
}

function shouldLog(minLevel: LogLevel, msgLevel: LogLevel): boolean {
  return levelOrder[msgLevel] >= levelOrder[minLevel];
}

function safeFields(fields?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!fields) return undefined;

  // Minimal redaction (expand later in Phase 2/8).
  const redactedKeys = new Set(['authorization', 'access_token', 'refresh_token', 'token']);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = redactedKeys.has(k.toLowerCase()) ? '[REDACTED]' : v;
  }
  return out;
}

export function createLogger(options?: { level?: LogLevel; prefix?: string }): Logger {
  const level = options?.level ?? defaultLevelFromEnv();
  const prefix = options?.prefix ?? 'labshare';

  const log = (msgLevel: LogLevel, event: string, fields?: Record<string, unknown>) => {
    if (!shouldLog(level, msgLevel)) return;
    const payload = safeFields(fields);
    const line = payload ? { event, ...payload } : { event };

    const tag = `[${prefix}]`;
    if (msgLevel === 'debug') console.debug(tag, line);
    else if (msgLevel === 'info') console.info(tag, line);
    else if (msgLevel === 'warn') console.warn(tag, line);
    else if (msgLevel === 'error') console.error(tag, line);
  };

  return {
    debug: (event, fields) => log('debug', event, fields),
    info: (event, fields) => log('info', event, fields),
    warn: (event, fields) => log('warn', event, fields),
    error: (event, fields) => log('error', event, fields),
  };
}

export const logger = createLogger();
