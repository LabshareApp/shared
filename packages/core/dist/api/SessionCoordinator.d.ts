/**
 * SessionCoordinator
 *
 * Coordinates user-initiated logouts vs automatic session expiration to prevent
 * race conditions and duplicate logout handling.
 *
 * This solves the problem of distinguishing between:
 * 1. User clicking "Log Out" button (should not show "Session Expired" message)
 * 2. Automatic session expiration from 401 errors (should show message)
 *
 * Used by both mobile and web apps to avoid duplicating this logic.
 */
export declare class SessionCoordinator {
    private isUserInitiatedLogout;
    private isLoggingOut;
    private logoutFlagResetTimer;
    /**
     * Mark that a logout is user-initiated.
     * Call this BEFORE calling signOut() when user explicitly logs out.
     *
     * This prevents the session expired message from showing and prevents
     * duplicate logout handling if 401 errors occur during logout.
     *
     * The flag is automatically reset after 10 seconds to handle edge cases.
     */
    markUserInitiatedLogout(): void;
    /**
     * Check if logout is currently user-initiated.
     * Used by session expiration handlers to determine whether to show
     * session expired messages.
     */
    isUserInitiated(): boolean;
    /**
     * Mark that logout process is starting.
     * Used to prevent concurrent logout attempts.
     */
    startLogout(): boolean;
    /**
     * Mark that logout process has completed.
     */
    endLogout(): void;
    /**
     * Check if logout is currently in progress.
     */
    isLogoutInProgress(): boolean;
    /**
     * Reset all flags. Call this after logout completes successfully.
     */
    reset(): void;
    /**
     * Cleanup timers. Call this when the app is unmounting or cleaning up.
     */
    cleanup(): void;
}
export declare const sessionCoordinator: SessionCoordinator;
//# sourceMappingURL=SessionCoordinator.d.ts.map