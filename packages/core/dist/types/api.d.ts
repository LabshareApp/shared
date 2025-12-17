export interface ApiResponse<T = any> {
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedApiResponse<T> {
    items: T[];
    totalCount: number;
    page?: number;
    limit?: number;
}
export interface CreateResponse {
    id: string;
    message?: string;
}
export interface DeleteResponse {
    message: string;
    deletedCount?: number;
}
export interface BulkOperationResponse {
    matchedCount: number;
    updatedCount: number;
}
//# sourceMappingURL=api.d.ts.map