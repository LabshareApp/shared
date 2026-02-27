import type { ApiClient } from '../../ApiClient';
import type { Tool, ToolCheckout, CreateToolData, UpdateToolData, CheckoutToolData, ReturnToolData, LogAccessData, ToolListResponse, CheckoutListResponse, MyCheckoutsResponse, ListToolsParams, ListCheckoutsParams, ToolRequiredFields } from '../../../types/tools';
/**
 * Fetch all tools for the authenticated lab.
 */
export declare function fetchTools(client: ApiClient, params?: ListToolsParams): Promise<ToolListResponse>;
/**
 * Fetch a single tool by ID.
 */
export declare function getTool(client: ApiClient, id: string): Promise<Tool>;
/**
 * Create a new tool.
 */
export declare function createTool(client: ApiClient, data: CreateToolData): Promise<Tool>;
/**
 * Update a tool.
 */
export declare function updateTool(client: ApiClient, id: string, data: UpdateToolData): Promise<Tool>;
/**
 * Delete a tool.
 */
export declare function deleteTool(client: ApiClient, id: string): Promise<void>;
/**
 * Checkout a tool.
 */
export declare function checkoutTool(client: ApiClient, id: string, data?: CheckoutToolData): Promise<ToolCheckout>;
/**
 * Return a checked out tool.
 */
export declare function returnTool(client: ApiClient, id: string, data?: ReturnToolData): Promise<ToolCheckout>;
/**
 * Get checkout history for a tool.
 */
export declare function getToolCheckouts(client: ApiClient, id: string, params?: ListCheckoutsParams): Promise<CheckoutListResponse>;
/**
 * Get tools available to borrow from other labs.
 */
export declare function getAvailableTools(client: ApiClient, params?: {
    page?: number;
    limit?: number;
}): Promise<ToolListResponse>;
/**
 * Get current user's active checkouts.
 */
export declare function getMyCheckouts(client: ApiClient, params?: {
    allLabs?: boolean;
}): Promise<MyCheckoutsResponse>;
/**
 * Log an access event for a tool (ID swipe, view).
 */
export declare function logToolAccess(client: ApiClient, id: string, data: LogAccessData): Promise<void>;
export interface GenerateToolImagePresignedUrlRequest {
    fileName?: string;
    extension: string;
}
export interface GenerateToolImagePresignedUrlResponse {
    uploadUrl: string;
    s3Url: string;
    objectKey: string;
    expiresAt: number;
}
export interface GetToolImageViewUrlResponse {
    url: string;
    expiresAt: number;
}
/**
 * Generate a presigned URL for uploading a tool image to S3.
 */
export declare function generateToolImagePresignedUrl(client: ApiClient, data: GenerateToolImagePresignedUrlRequest): Promise<GenerateToolImagePresignedUrlResponse>;
/**
 * Get a presigned URL for viewing a tool image from S3.
 */
export declare function getToolImageViewUrl(client: ApiClient, data: {
    s3Url: string;
}): Promise<GetToolImageViewUrlResponse>;
import type { MaintenanceRequest, CreateMaintenanceRequestData, UpdateMaintenanceRequestData, MaintenanceRequestListResponse, ListMaintenanceRequestsParams } from '../../../types/maintenance';
/**
 * Create a maintenance request for a tool.
 */
export declare function createMaintenanceRequest(client: ApiClient, data: CreateMaintenanceRequestData): Promise<MaintenanceRequest>;
/**
 * Get a maintenance request by ID.
 */
export declare function getMaintenanceRequest(client: ApiClient, requestId: string): Promise<MaintenanceRequest>;
/**
 * List maintenance requests with optional filters.
 */
export declare function listMaintenanceRequests(client: ApiClient, params?: ListMaintenanceRequestsParams): Promise<MaintenanceRequestListResponse>;
/**
 * Update a maintenance request (change status, assign, resolve).
 */
export declare function updateMaintenanceRequest(client: ApiClient, requestId: string, data: UpdateMaintenanceRequestData): Promise<MaintenanceRequest>;
/**
 * Get maintenance requests for a specific tool.
 */
export declare function getToolMaintenanceHistory(client: ApiClient, toolId: string): Promise<MaintenanceRequest[]>;
/**
 * Fetch the lab's tool required field settings.
 */
export declare function fetchToolRequiredFields(client: ApiClient): Promise<ToolRequiredFields>;
/**
 * Update the lab's tool required field settings.
 */
export declare function updateToolRequiredFields(client: ApiClient, fields: ToolRequiredFields): Promise<ToolRequiredFields>;
//# sourceMappingURL=index.d.ts.map