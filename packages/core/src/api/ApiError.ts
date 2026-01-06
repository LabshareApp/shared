export class ApiError<TBody = unknown> extends Error {
  readonly status: number;
  readonly body: TBody;

  constructor(message: string, status: number, body: TBody) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  /**
   * Checks if this error is a network error (no internet connection)
   */
  isNetworkError(): boolean {
    return this.status === 0 && (
      this.message === 'Network Error' ||
      (typeof this.body === 'string' && this.body.toLowerCase().includes('internet connection'))
    );
  }

  /**
   * Gets a user-friendly error message
   */
  getUserMessage(): string {
    if (this.isNetworkError()) {
      return typeof this.body === 'string' ? this.body : 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    if (typeof this.body === 'string') {
      return this.body;
    }
    if (this.body && typeof this.body === 'object' && 'message' in this.body) {
      return String((this.body as { message: unknown }).message);
    }
    return this.message || 'An error occurred. Please try again.';
  }
}
