export interface JWTPayload {
  sub: string;
  lab_id?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);

  if (typeof atob === 'function') return atob(padded);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const B: any = (globalThis as any).Buffer;
  if (B) return B.from(padded, 'base64').toString('utf8');
  throw new Error('No base64 decoder available');
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  const exp = payload?.exp;
  if (!exp) return true;
  return Date.now() / 1000 > exp;
}

export function getTokenLabId(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload) return null;
  const p = payload as Record<string, unknown>;
  return (
    (p.lab_id as string | undefined) ||
    (p.labId as string | undefined) ||
    (p.lab as string | undefined) ||
    null
  );
}

export function getTokenUserId(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.sub ?? null;
}

