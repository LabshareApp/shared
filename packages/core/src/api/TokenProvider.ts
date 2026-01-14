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
}
