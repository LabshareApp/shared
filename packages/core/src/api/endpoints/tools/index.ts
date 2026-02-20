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

// Helper to normalize MongoDB _id to id
type WithMongoId<T> = Omit<T, 'id'> & { _id?: string; id?: string };

function normalizeId<T extends { id: string }>(obj: WithMongoId<T>): T {
  const idValue = (obj as any)?._id || (obj as any)?.id;
  if (!idValue) return obj as unknown as T;
  return { ...(obj as any), _id: idValue, id: idValue } as T;
}

function normalizeArray<T extends { id: string }>(arr: WithMongoId<T>[]): T[] {
  return arr.map(normalizeId);
}

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
    tools: WithMongoId<Tool>[];
    totalCount: number;
    page: number;
    limit: number;
  }>({
    method: 'GET',
    path: '/tools',
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  return {
    tools: normalizeArray(response.tools || []),
    totalCount: response.totalCount ?? 0,
    page: response.page ?? 1,
    limit: response.limit ?? 20,
  };
}

/**
 * Fetch a single tool by ID.
 */
export async function getTool(client: ApiClient, id: string): Promise<Tool> {
  const response = await client.request<WithMongoId<Tool>>({
    method: 'GET',
    path: '/tools/get',
    query: { id },
  });
  const validated = validateObjectResponse(response, 'getTool', ['name', 'category']);
  return normalizeId(validated as WithMongoId<Tool>);
}

/**
 * Create a new tool.
 */
export async function createTool(
  client: ApiClient,
  data: CreateToolData
): Promise<Tool> {
  const response = await client.request<WithMongoId<Tool>>({
    method: 'POST',
    path: '/tools',
    body: data,
  });
  const validated = validateObjectResponse(response, 'createTool', ['name', 'category']);
  return normalizeId(validated as WithMongoId<Tool>);
}

/**
 * Update a tool.
 */
export async function updateTool(
  client: ApiClient,
  id: string,
  data: UpdateToolData
): Promise<Tool> {
  const response = await client.request<WithMongoId<Tool>>({
    method: 'PUT',
    path: '/tools/update',
    query: { id },
    body: data,
  });
  const validated = validateObjectResponse(response, 'updateTool', ['name', 'category']);
  return normalizeId(validated as WithMongoId<Tool>);
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
  const response = await client.request<WithMongoId<ToolCheckout>>({
    method: 'POST',
    path: '/tools/checkout',
    query: { id },
    body: data,
  });
  const validated = validateObjectResponse(response, 'checkoutTool', ['toolId', 'userId']);
  return normalizeId(validated as WithMongoId<ToolCheckout>);
}

/**
 * Return a checked out tool.
 */
export async function returnTool(
  client: ApiClient,
  id: string,
  data?: ReturnToolData
): Promise<ToolCheckout> {
  const response = await client.request<WithMongoId<ToolCheckout>>({
    method: 'POST',
    path: '/tools/return',
    query: { id },
    body: data,
  });
  const validated = validateObjectResponse(response, 'returnTool', ['toolId', 'userId']);
  return normalizeId(validated as WithMongoId<ToolCheckout>);
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
    checkouts: WithMongoId<ToolCheckout>[];
    totalCount: number;
    page: number;
    limit: number;
  }>({
    method: 'GET',
    path: '/tools/checkouts',
    query,
  });

  return {
    checkouts: normalizeArray(response.checkouts || []),
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
    tools: WithMongoId<Tool>[];
    totalCount: number;
    page: number;
    limit: number;
  }>({
    method: 'GET',
    path: '/tools/available',
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  return {
    tools: normalizeArray(response.tools || []),
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
    checkouts: WithMongoId<ToolCheckout>[];
    count: number;
  }>({
    method: 'GET',
    path: '/tools/my-checkouts',
    query: Object.keys(query).length > 0 ? query : undefined,
  });

  return {
    checkouts: normalizeArray(response.checkouts || []),
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
