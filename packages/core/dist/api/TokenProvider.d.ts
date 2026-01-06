export interface TokenProvider {
    getAccessToken(): Promise<string | null>;
    refreshSession?(): Promise<string | null>;
    onSessionExpired?(): void;
}
//# sourceMappingURL=TokenProvider.d.ts.map