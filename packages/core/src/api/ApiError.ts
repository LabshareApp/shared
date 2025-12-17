export class ApiError<TBody = unknown> extends Error {
  readonly status: number;
  readonly body: TBody;

  constructor(message: string, status: number, body: TBody) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}
