export interface JWTPayload {
    sub: string;
    lab_id?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}
export declare function decodeJWT(token: string): JWTPayload | null;
export declare function isTokenExpired(token: string): boolean;
/**
 * Checks if a token is expiring soon (within the specified buffer time).
 * This is useful for proactive token refresh to avoid 401 errors.
 *
 * @param token - The JWT token to check
 * @param bufferSeconds - Number of seconds before expiration to consider "soon" (default: 300 = 5 minutes)
 * @returns true if token is expiring within the buffer time or already expired
 */
export declare function isTokenExpiringSoon(token: string, bufferSeconds?: number): boolean;
export declare function getTokenLabId(token: string): string | null;
export declare function getTokenUserId(token: string): string | null;
//# sourceMappingURL=jwt.d.ts.map