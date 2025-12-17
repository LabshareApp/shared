export declare class ApiError<TBody = unknown> extends Error {
    readonly status: number;
    readonly body: TBody;
    constructor(message: string, status: number, body: TBody);
}
//# sourceMappingURL=ApiError.d.ts.map