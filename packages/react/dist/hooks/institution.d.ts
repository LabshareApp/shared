import type { ApiClient, CollaborationHistoryResponse, InstitutionOrderRequestsResponse, InstitutionInventoryResponse } from '@labshare/shared-core';
/**
 * Hook to fetch collaboration history with statistics (admin only)
 */
export declare function useCollaborationHistory(client: ApiClient, params: {
    institutionId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<CollaborationHistoryResponse, Error>;
/**
 * Hook to search order requests across all institution labs (admin only)
 */
export declare function useInstitutionOrderRequests(client: ApiClient, params: {
    institutionId: string | null | undefined;
    view: 'current' | 'placed' | 'archived';
    labIds?: string[];
    query?: string;
    page?: number;
    limit?: number;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InstitutionOrderRequestsResponse, Error>;
/**
 * Hook to search inventory across all institution labs (admin only)
 */
export declare function useInstitutionInventorySearch(client: ApiClient, params: {
    institutionId: string | null | undefined;
    labIds?: string[];
    query?: string;
    page?: number;
    limit?: number;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InstitutionInventoryResponse, Error>;
//# sourceMappingURL=institution.d.ts.map