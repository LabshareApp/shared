export interface AnalyticsAdapter {
  setUserId(userId: string): void;
  track(event: string, properties?: Record<string, unknown>): void;
}

