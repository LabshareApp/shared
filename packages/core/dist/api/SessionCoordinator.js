"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCoordinator = exports.SessionCoordinator = void 0;
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
class SessionCoordinator {
    constructor() {
        this.isUserInitiatedLogout = false;
        this.isLoggingOut = false;
        this.logoutFlagResetTimer = null;
    }
    /**
     * Mark that a logout is user-initiated.
     * Call this BEFORE calling signOut() when user explicitly logs out.
     *
     * This prevents the session expired message from showing and prevents
     * duplicate logout handling if 401 errors occur during logout.
     *
     * The flag is automatically reset after 10 seconds to handle edge cases.
     */
    markUserInitiatedLogout() {
        this.isUserInitiatedLogout = true;
        // Clear any existing timer
        if (this.logoutFlagResetTimer) {
            clearTimeout(this.logoutFlagResetTimer);
        }
        // Reset flag after 10 seconds to prevent it from getting stuck
        this.logoutFlagResetTimer = setTimeout(() => {
            this.isUserInitiatedLogout = false;
            this.logoutFlagResetTimer = null;
        }, 10000);
    }
    /**
     * Check if logout is currently user-initiated.
     * Used by session expiration handlers to determine whether to show
     * session expired messages.
     */
    isUserInitiated() {
        return this.isUserInitiatedLogout;
    }
    /**
     * Mark that logout process is starting.
     * Used to prevent concurrent logout attempts.
     */
    startLogout() {
        if (this.isLoggingOut) {
            return false; // Already logging out
        }
        this.isLoggingOut = true;
        return true;
    }
    /**
     * Mark that logout process has completed.
     */
    endLogout() {
        this.isLoggingOut = false;
    }
    /**
     * Check if logout is currently in progress.
     */
    isLogoutInProgress() {
        return this.isLoggingOut;
    }
    /**
     * Reset all flags. Call this after logout completes successfully.
     */
    reset() {
        this.isUserInitiatedLogout = false;
        this.isLoggingOut = false;
        if (this.logoutFlagResetTimer) {
            clearTimeout(this.logoutFlagResetTimer);
            this.logoutFlagResetTimer = null;
        }
    }
    /**
     * Cleanup timers. Call this when the app is unmounting or cleaning up.
     */
    cleanup() {
        if (this.logoutFlagResetTimer) {
            clearTimeout(this.logoutFlagResetTimer);
            this.logoutFlagResetTimer = null;
        }
    }
}
exports.SessionCoordinator = SessionCoordinator;
// Global singleton instance for use across the app
// Both mobile and web can import this same instance
exports.sessionCoordinator = new SessionCoordinator();
//# sourceMappingURL=SessionCoordinator.js.map