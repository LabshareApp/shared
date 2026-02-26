import type { ApiClient } from '../../ApiClient';
import type {
  Tool,
  ToolCheckout,
  CreateToolData,
  UpdateToolData,
  CheckoutToolData,
  ReturnToolData,
  LogAccessData,
  ToolListResponse,
  CheckoutListResponse,
  MyCheckoutsResponse,
  ListToolsParams,
  ListCheckoutsParams,
} from '../../../types/tools';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

// =============================================================================
// Tool CRUD
// =============================================================================

/**
 * Fetch all tools for the authenticated lab.
 */
export async function fetchTools(
  client: ApiClient,
  params?: ListToolsParams
): Promise<ToolListResponse> {
  const query: Record<string, string> = {};
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);
  if (params?.status) query.status = params.status;
  if (params?.category) query.category = params.category;
  if (params?.search) query.search = params.search;
  if (params?.includeShared) query.includeShared = 'true';

  const response = await client.request<{
    tools: Tool[];
    totalCount: number;
    page: number;
    limit: number;
  }>({
    method: 'GET',
    path: '/tools',
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  return {
    tools: response.tools || [],
    totalCount: response.totalCount ?? 0,
    page: response.page ?? 1,
    limit: response.limit ?? 20,
  };
}

/**
 * Fetch a single tool by ID.
 */
export async function getTool(client: ApiClient, id: string): Promise<Tool> {
  const response = await client.request<Tool>({
    method: 'GET',
    path: '/tools/get',
    query: { id },
  });
  return validateObjectResponse(response, 'getTool', ['name', 'category']) as Tool;
}

/**
 * Create a new tool.
 */
export async function createTool(
  client: ApiClient,
  data: CreateToolData
): Promise<Tool> {
  const response = await client.request<Tool>({
    method: 'POST',
    path: '/tools/create',
    body: data,
  });
  return validateObjectResponse(response, 'createTool', ['name', 'category']) as Tool;
}

/**
 * Update a tool.
 */
export async function updateTool(
  client: ApiClient,
  id: string,
  data: UpdateToolData
): Promise<Tool> {
  const response = await client.request<Tool>({
    method: 'PUT',
    path: '/tools/update',
    query: { id },
    body: data,
  });
  return validateObjectResponse(response, 'updateTool', ['name', 'category']) as Tool;
}

/**
 * Delete a tool.
 */
export async function deleteTool(client: ApiClient, id: string): Promise<void> {
  await client.request({
    method: 'DELETE',
    path: '/tools/delete',
    query: { id },
  });
}

// =============================================================================
// Checkout/Return
// =============================================================================

/**
 * Checkout a tool.
 */
export async function checkoutTool(
  client: ApiClient,
  id: string,
  data?: CheckoutToolData
): Promise<ToolCheckout> {
  const response = await client.request<ToolCheckout>({
    method: 'POST',
    path: '/tools/checkout',
    query: { id },
    body: data,
  });
  return validateObjectResponse(response, 'checkoutTool', ['toolId', 'userId']) as ToolCheckout;
}

/**
 * Return a checked out tool.
 */
export async function returnTool(
  client: ApiClient,
  id: string,
  data?: ReturnToolData
): Promise<ToolCheckout> {
  const response = await client.request<ToolCheckout>({
    method: 'POST',
    path: '/tools/return',
    query: { id },
    body: data,
  });
  return validateObjectResponse(response, 'returnTool', ['toolId', 'userId']) as ToolCheckout;
}

/**
 * Get checkout history for a tool.
 */
export async function getToolCheckouts(
  client: ApiClient,
  id: string,
  params?: ListCheckoutsParams
): Promise<CheckoutListResponse> {
  const query: Record<string, string> = { id };
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const response = await client.request<{
    checkouts: ToolCheckout[];
    totalCount: number;
    page: number;
    limit: number;
  }>({
    method: 'GET',
    path: '/tools/checkouts',
    query,
  });

  return {
    checkouts: response.checkouts || [],
    totalCount: response.totalCount ?? 0,
    page: response.page ?? 1,
    limit: response.limit ?? 20,
  };
}

// =============================================================================
// Available Tools / My Checkouts
// =============================================================================

/**
 * Get tools available to borrow from other labs.
 */
export async function getAvailableTools(
  client: ApiClient,
  params?: { page?: number; limit?: number }
): Promise<ToolListResponse> {
  const query: Record<string, string> = {};
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const response = await client.request<{
    tools: Tool[];
    totalCount: number;
    page: number;
    limit: number;
  }>({
    method: 'GET',
    path: '/tools/available',
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  return {
    tools: response.tools || [],
    totalCount: response.totalCount ?? 0,
    page: response.page ?? 1,
    limit: response.limit ?? 20,
  };
}

/**
 * Get current user's active checkouts.
 */
export async function getMyCheckouts(
  client: ApiClient,
  params?: { allLabs?: boolean }
): Promise<MyCheckoutsResponse> {
  const query: Record<string, string> = {};
  if (params?.allLabs) query.allLabs = 'true';

  const response = await client.request<{
    checkouts: ToolCheckout[];
    count: number;
  }>({
    method: 'GET',
    path: '/tools/my-checkouts',
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  return {
    checkouts: response.checkouts || [],
    count: response.count ?? 0,
  };
}

// =============================================================================
// Access Logging
// =============================================================================

/**
 * Log an access event for a tool (ID swipe, view).
 */
export async function logToolAccess(
  client: ApiClient,
  id: string,
  data: LogAccessData
): Promise<void> {
  await client.request({
    method: 'POST',
    path: '/tools/log-access',
    query: { id },
    body: data,
  });
}

// =============================================================================
// Tool Image Presigned URLs
// =============================================================================

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
export async function generateToolImagePresignedUrl(
  client: ApiClient,
  data: GenerateToolImagePresignedUrlRequest
): Promise<GenerateToolImagePresignedUrlResponse> {
  const response = await client.request<GenerateToolImagePresignedUrlResponse>({
    method: 'POST',
    path: '/tools/generate-presigned-url/tool-image',
    body: data,
  });
  return validateObjectResponse(response, 'generateToolImagePresignedUrl', ['uploadUrl', 's3Url', 'objectKey']) as GenerateToolImagePresignedUrlResponse;
}

/**
 * Get a presigned URL for viewing a tool image from S3.
 */
export async function getToolImageViewUrl(
  client: ApiClient,
  data: { s3Url: string }
): Promise<GetToolImageViewUrlResponse> {
  const response = await client.request<GetToolImageViewUrlResponse>({
    method: 'POST',
    path: '/tools/get-tool-image-view-url',
    body: data,
  });
  return validateObjectResponse(response, 'getToolImageViewUrl', ['url', 'expiresAt']) as GetToolImageViewUrlResponse;
}

// =============================================================================
// Maintenance Requests
// =============================================================================

import type {
  MaintenanceRequest,
  CreateMaintenanceRequestData,
  UpdateMaintenanceRequestData,
  MaintenanceRequestListResponse,
  ListMaintenanceRequestsParams,
} from '../../../types/maintenance';

/**
 * Create a maintenance request for a tool.
 */
export async function createMaintenanceRequest(
  client: ApiClient,
  data: CreateMaintenanceRequestData
): Promise<MaintenanceRequest> {
  const response = await client.request<MaintenanceRequest>({
    method: 'POST',
    path: '/tools/maintenance-requests',
    body: data,
  });
  return response;
}

/**
 * Get a maintenance request by ID.
 */
export async function getMaintenanceRequest(
  client: ApiClient,
  requestId: string
): Promise<MaintenanceRequest> {
  const response = await client.request<MaintenanceRequest>({
    method: 'GET',
    path: '/tools/maintenance-requests',
    query: { id: requestId },
  });
  return response;
}

/**
 * List maintenance requests with optional filters.
 */
export async function listMaintenanceRequests(
  client: ApiClient,
  params?: ListMaintenanceRequestsParams
): Promise<MaintenanceRequestListResponse> {
  const response = await client.request<MaintenanceRequestListResponse>({
    method: 'GET',
    path: '/tools/maintenance-requests/list',
    query: params as Record<string, string | number | undefined>,
  });
  return {
    requests: response.requests || [],
    totalCount: response.totalCount ?? 0,
  };
}

/**
 * Update a maintenance request (change status, assign, resolve).
 */
export async function updateMaintenanceRequest(
  client: ApiClient,
  requestId: string,
  data: UpdateMaintenanceRequestData
): Promise<MaintenanceRequest> {
  const response = await client.request<MaintenanceRequest>({
    method: 'PUT',
    path: '/tools/maintenance-requests',
    query: { id: requestId },
    body: data,
  });
  return response;
}

/**
 * Get maintenance requests for a specific tool.
 */
export async function getToolMaintenanceHistory(
  client: ApiClient,
  toolId: string
): Promise<MaintenanceRequest[]> {
  const response = await listMaintenanceRequests(client, { toolId });
  return response.requests;
}

// =============================================================================
// Tool Required Fields
// =============================================================================

import type { ToolRequiredFields } from '../../../types/tools';

const DEFAULT_TOOL_REQUIRED_FIELDS: ToolRequiredFields = {
  description: false,
  serialNumber: false,
  location: false,
  imageUrl: false,
  maxCheckoutDays: false,
};

/**
 * Fetch the lab's tool required field settings.
 */
export async function fetchToolRequiredFields(
  client: ApiClient
): Promise<ToolRequiredFields> {
  try {
    const response = await client.request<ToolRequiredFields>({
      method: 'GET',
      path: '/tools/required-fields',
    });
    return { ...DEFAULT_TOOL_REQUIRED_FIELDS, ...response };
  } catch {
    return DEFAULT_TOOL_REQUIRED_FIELDS;
  }
}

/**
 * Update the lab's tool required field settings.
 */
export async function updateToolRequiredFields(
  client: ApiClient,
  fields: ToolRequiredFields
): Promise<ToolRequiredFields> {
  const response = await client.request<ToolRequiredFields>({
    method: 'PUT',
    path: '/tools/required-fields',
    body: fields,
  });
  return { ...DEFAULT_TOOL_REQUIRED_FIELDS, ...response };
}
