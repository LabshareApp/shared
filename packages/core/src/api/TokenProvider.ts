export interface TokenProvider {
  getAccessToken(): Promise<string | null>;
  refreshSession?(): Promise<string | null>;
}
