export interface JWTPayload {
    sub: string;
    lab_id?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}
export declare function decodeJWT(token: string): JWTPayload | null;
export declare function isTokenExpired(token: string): boolean;
export declare function getTokenLabId(token: string): string | null;
export declare function getTokenUserId(token: string): string | null;
//# sourceMappingURL=jwt.d.ts.map