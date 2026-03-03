import type { ApiClient, Tool, ToolCheckout, ToolListResponse, CheckoutListResponse, MyCheckoutsResponse, CreateToolData, UpdateToolData, CheckoutToolData, ReturnToolData, LogAccessData, ListToolsParams, ListCheckoutsParams, ToolRequiredFields, MaintenanceRequest, MaintenanceRequestListResponse, CreateMaintenanceRequestData, UpdateMaintenanceRequestData, ListMaintenanceRequestsParams } from '@labshare/shared-core';
import { type GenerateToolImagePresignedUrlRequest, type GenerateToolImagePresignedUrlResponse, type GetToolImageViewUrlResponse } from '@labshare/shared-core';
export declare function useTools(client: ApiClient, params?: ListToolsParams & {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<ToolListResponse, Error>;
export declare function useTool(client: ApiClient, params: {
    toolId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Tool | null, Error>;
export declare function useAvailableTools(client: ApiClient, params?: {
    page?: number;
    limit?: number;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<ToolListResponse, Error>;
export declare function useToolCheckouts(client: ApiClient, params: {
    toolId: string;
    checkoutParams?: ListCheckoutsParams;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<CheckoutListResponse, Error>;
export declare function useMyCheckouts(client: ApiClient, params?: {
    allLabs?: boolean;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<MyCheckoutsResponse, Error>;
export declare function useToolRequiredFields(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<ToolRequiredFields, Error>;
export declare function useToolMutations(client: ApiClient): {
    createToolMutation: import("@tanstack/react-query").UseMutationResult<Tool, Error, CreateToolData, unknown>;
    updateToolMutation: import("@tanstack/react-query").UseMutationResult<Tool, Error, {
        id: string;
        data: UpdateToolData;
    }, unknown>;
    deleteToolMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    checkoutToolMutation: import("@tanstack/react-query").UseMutationResult<ToolCheckout, Error, {
        id: string;
        data?: CheckoutToolData;
    }, unknown>;
    returnToolMutation: import("@tanstack/react-query").UseMutationResult<ToolCheckout, Error, {
        id: string;
        data?: ReturnToolData;
    }, unknown>;
    logAccessMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        data: LogAccessData;
    }, unknown>;
    updateRequiredFieldsMutation: import("@tanstack/react-query").UseMutationResult<ToolRequiredFields, Error, ToolRequiredFields, unknown>;
};
export declare function useToolImageUpload(client: ApiClient): {
    generatePresignedUrlMutation: import("@tanstack/react-query").UseMutationResult<GenerateToolImagePresignedUrlResponse, Error, GenerateToolImagePresignedUrlRequest, unknown>;
    getViewUrlMutation: import("@tanstack/react-query").UseMutationResult<GetToolImageViewUrlResponse, Error, {
        s3Url: string;
    }, unknown>;
};
export declare function useMaintenanceRequests(client: ApiClient, params?: ListMaintenanceRequestsParams & {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<MaintenanceRequestListResponse, Error>;
export declare function useMaintenanceRequest(client: ApiClient, params: {
    requestId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<MaintenanceRequest | null, Error>;
export declare function useToolMaintenanceHistory(client: ApiClient, params: {
    toolId: string;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<MaintenanceRequest[], Error>;
export declare function useMaintenanceMutations(client: ApiClient): {
    createMaintenanceRequestMutation: import("@tanstack/react-query").UseMutationResult<MaintenanceRequest, Error, CreateMaintenanceRequestData, unknown>;
    updateMaintenanceRequestMutation: import("@tanstack/react-query").UseMutationResult<MaintenanceRequest, Error, {
        id: string;
        data: UpdateMaintenanceRequestData;
    }, unknown>;
};
//# sourceMappingURL=tools.d.ts.map