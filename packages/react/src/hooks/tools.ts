import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  Tool,
  ToolCheckout,
  ToolListResponse,
  CheckoutListResponse,
  MyCheckoutsResponse,
  CreateToolData,
  UpdateToolData,
  CheckoutToolData,
  ReturnToolData,
  LogAccessData,
  ListToolsParams,
  ListCheckoutsParams,
  ToolRequiredFields,
  MaintenanceRequest,
  MaintenanceRequestListResponse,
  CreateMaintenanceRequestData,
  UpdateMaintenanceRequestData,
  ListMaintenanceRequestsParams,
} from '@labshare/shared-core';
import {
  fetchTools,
  getTool,
  createTool,
  updateTool,
  deleteTool,
  checkoutTool,
  returnTool,
  getToolCheckouts,
  getAvailableTools,
  getMyCheckouts,
  logToolAccess,
  fetchToolRequiredFields,
  updateToolRequiredFields,
  generateToolImagePresignedUrl,
  getToolImageViewUrl,
  createMaintenanceRequest,
  getMaintenanceRequest,
  listMaintenanceRequests,
  updateMaintenanceRequest,
  getToolMaintenanceHistory,
  type GenerateToolImagePresignedUrlRequest,
  type GenerateToolImagePresignedUrlResponse,
  type GetToolImageViewUrlResponse,
} from '@labshare/shared-core';

import { toolKeys } from '../queryKeys/tools';

// =============================================================================
// Tool Query Hooks
// =============================================================================

export function useTools(
  client: ApiClient,
  params?: ListToolsParams & { enabled?: boolean }
) {
  const { enabled, ...queryParams } = params ?? {};
  return useQuery<ToolListResponse, Error>({
    queryKey: toolKeys.toolsList(queryParams as Record<string, unknown>),
    queryFn: async () => fetchTools(client, queryParams),
    enabled: enabled ?? true,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTool(
  client: ApiClient,
  params: { toolId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.toolId ? String(params.toolId) : null;

  return useQuery<Tool | null, Error>({
    queryKey: toolKeys.toolDetail(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      return getTool(client, normalizedId);
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 60 * 1000,
  });
}

export function useAvailableTools(
  client: ApiClient,
  params?: { page?: number; limit?: number; enabled?: boolean }
) {
  const { enabled, ...queryParams } = params ?? {};
  return useQuery<ToolListResponse, Error>({
    queryKey: toolKeys.availableTools(queryParams as Record<string, unknown>),
    queryFn: async () => getAvailableTools(client, queryParams),
    enabled: enabled ?? true,
    staleTime: 60 * 1000,
  });
}

export function useToolCheckouts(
  client: ApiClient,
  params: { toolId: string; checkoutParams?: ListCheckoutsParams; enabled?: boolean }
) {
  return useQuery<CheckoutListResponse, Error>({
    queryKey: toolKeys.toolCheckouts(params.toolId, params.checkoutParams as Record<string, unknown>),
    queryFn: async () => getToolCheckouts(client, params.toolId, params.checkoutParams),
    enabled: params.enabled ?? !!params.toolId,
    staleTime: 60 * 1000,
  });
}

export function useMyCheckouts(
  client: ApiClient,
  params?: { allLabs?: boolean; enabled?: boolean }
) {
  return useQuery<MyCheckoutsResponse, Error>({
    queryKey: toolKeys.myCheckouts(params?.allLabs),
    queryFn: async () => getMyCheckouts(client, params),
    enabled: params?.enabled ?? true,
    staleTime: 60 * 1000,
  });
}

// =============================================================================
// Tool Required Fields Hooks
// =============================================================================

export function useToolRequiredFields(
  client: ApiClient,
  options?: { enabled?: boolean }
) {
  return useQuery<ToolRequiredFields, Error>({
    queryKey: toolKeys.requiredFields(),
    queryFn: async () => fetchToolRequiredFields(client),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

// =============================================================================
// Tool Mutation Hooks
// =============================================================================

export function useToolMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createToolMutation = useMutation({
    mutationFn: (data: CreateToolData) => createTool(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolKeys.tools });
    },
  });

  const updateToolMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateToolData }) =>
      updateTool(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: toolKeys.tools });
      queryClient.invalidateQueries({ queryKey: toolKeys.toolDetail(variables.id) });
    },
  });

  const deleteToolMutation = useMutation({
    mutationFn: (id: string) => deleteTool(client, id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: toolKeys.tools });
      queryClient.removeQueries({ queryKey: toolKeys.toolDetail(variables) });
    },
  });

  const checkoutToolMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: CheckoutToolData }) =>
      checkoutTool(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: toolKeys.tools });
      queryClient.invalidateQueries({ queryKey: toolKeys.toolDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: toolKeys.checkouts });
    },
  });

  const returnToolMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ReturnToolData }) =>
      returnTool(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: toolKeys.tools });
      queryClient.invalidateQueries({ queryKey: toolKeys.toolDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: toolKeys.checkouts });
    },
  });

  const logAccessMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LogAccessData }) =>
      logToolAccess(client, id, data),
  });

  const updateRequiredFieldsMutation = useMutation({
    mutationFn: (fields: ToolRequiredFields) => updateToolRequiredFields(client, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolKeys.requiredFields() });
    },
  });

  return {
    createToolMutation,
    updateToolMutation,
    deleteToolMutation,
    checkoutToolMutation,
    returnToolMutation,
    logAccessMutation,
    updateRequiredFieldsMutation,
  };
}

// =============================================================================
// Tool Image Hooks
// =============================================================================

export function useToolImageUpload(client: ApiClient) {
  const generatePresignedUrlMutation = useMutation({
    mutationFn: (data: GenerateToolImagePresignedUrlRequest) =>
      generateToolImagePresignedUrl(client, data),
  });

  const getViewUrlMutation = useMutation({
    mutationFn: (data: { s3Url: string }) => getToolImageViewUrl(client, data),
  });

  return {
    generatePresignedUrlMutation,
    getViewUrlMutation,
  };
}

// =============================================================================
// Maintenance Hooks
// =============================================================================

export function useMaintenanceRequests(
  client: ApiClient,
  params?: ListMaintenanceRequestsParams & { enabled?: boolean }
) {
  const { enabled, ...queryParams } = params ?? {};
  return useQuery<MaintenanceRequestListResponse, Error>({
    queryKey: toolKeys.maintenanceList(queryParams as Record<string, unknown>),
    queryFn: async () => listMaintenanceRequests(client, queryParams),
    enabled: enabled ?? true,
    staleTime: 60 * 1000,
  });
}

export function useMaintenanceRequest(
  client: ApiClient,
  params: { requestId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.requestId ? String(params.requestId) : null;

  return useQuery<MaintenanceRequest | null, Error>({
    queryKey: toolKeys.maintenanceDetail(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      return getMaintenanceRequest(client, normalizedId);
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 60 * 1000,
  });
}

export function useToolMaintenanceHistory(
  client: ApiClient,
  params: { toolId: string; enabled?: boolean }
) {
  return useQuery<MaintenanceRequest[], Error>({
    queryKey: toolKeys.toolMaintenanceHistory(params.toolId),
    queryFn: async () => getToolMaintenanceHistory(client, params.toolId),
    enabled: params.enabled ?? !!params.toolId,
    staleTime: 60 * 1000,
  });
}

export function useMaintenanceMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createMaintenanceRequestMutation = useMutation({
    mutationFn: (data: CreateMaintenanceRequestData) =>
      createMaintenanceRequest(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolKeys.maintenance });
      queryClient.invalidateQueries({ queryKey: toolKeys.tools });
    },
  });

  const updateMaintenanceRequestMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaintenanceRequestData }) =>
      updateMaintenanceRequest(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: toolKeys.maintenance });
      queryClient.invalidateQueries({ queryKey: toolKeys.maintenanceDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: toolKeys.tools });
    },
  });

  return {
    createMaintenanceRequestMutation,
    updateMaintenanceRequestMutation,
  };
}
