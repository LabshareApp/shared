import type { SessionCoordinator } from './SessionCoordinator';
export interface TokenProvider {
    getAccessToken(): Promise<string | null>;
    refreshSession?(): Promise<string | null>;
    onSessionExpired?(): void;
    /**
     * Optional session coordinator to prevent duplicate logout handling
     * and distinguish user-initiated vs automatic session expiration.
     * If provided, onSessionExpired will check this before triggering logout.
     */
    sessionCoordinator?: SessionCoordinator;
    /**
     * Optional method to check if we're in a login grace period.
     * During the grace period, 401 errors should not trigger session expiration
     * or aggressive retry loops - the session may still be stabilizing.
     */
    isInGracePeriod?(): boolean;
}
//# sourceMappingURL=TokenProvider.d.ts.map