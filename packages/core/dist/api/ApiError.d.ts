export declare class ApiError<TBody = unknown> extends Error {
    readonly status: number;
    readonly body: TBody;
    constructor(message: string, status: number, body: TBody);
    /**
     * Checks if this error is a network error (no internet connection)
     */
    isNetworkError(): boolean;
    /**
     * Gets a user-friendly error message
     */
    getUserMessage(): string;
}
//# sourceMappingURL=ApiError.d.ts.map