import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  Machine,
  MachineTag,
  Reservation,
  RecurringRule,
  CreateMachineData,
  UpdateMachineData,
  CreateMachineTagData,
  UpdateMachineTagData,
  CreateReservationData,
  UpdateReservationData,
  CreateRecurringRuleData,
  UpdateRecurringRuleData,
  ListReservationsParams,
  ListMyReservationsParams,
  CheckAvailabilityParams,
  CheckAvailabilityResponse,
  ListMachinesParams,
  RejectReservationData,
  DeactivateRecurringRuleParams,
  MachineImagePresignedUrlRequest,
  MachineImagePresignedUrlResponse,
  MachineImageViewUrlRequest,
  MachineImageViewUrlResponse,
} from '@labshare/shared-core';
import {
  fetchMachineTags,
  createMachineTag,
  updateMachineTag,
  deleteMachineTag,
  fetchMachines,
  fetchMachine,
  createMachine,
  updateMachine,
  deleteMachine,
  fetchReservations,
  fetchMyReservations,
  fetchReservation,
  checkAvailability,
  createReservation,
  updateReservation,
  cancelReservation,
  fetchPendingApprovals,
  approveReservation,
  rejectReservation,
  checkInReservation,
  checkOutReservation,
  fetchRecurringRules,
  fetchRecurringRule,
  createRecurringRule,
  updateRecurringRule,
  deactivateRecurringRule,
  generateMachineImagePresignedUrl,
  getMachineImageViewUrl,
  type ApiError,
} from '@labshare/shared-core';

import { reservationKeys } from '../queryKeys/reservations';

// =============================================================================
// Machine Tags Hooks
// =============================================================================

export function useMachineTags(client: ApiClient, options?: { enabled?: boolean }) {
  return useQuery<MachineTag[], Error>({
    queryKey: reservationKeys.machineTagsAll(),
    queryFn: async () => fetchMachineTags(client),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 60 * 1000, // 30 minutes (tags change infrequently)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useMachineTagMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createTagMutation = useMutation({
    mutationFn: (data: CreateMachineTagData) => createMachineTag(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.machineTagsAll() });
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMachineTagData }) =>
      updateMachineTag(client, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.machineTagsAll() });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => deleteMachineTag(client, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.machineTagsAll() });
    },
  });

  return {
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  };
}

// =============================================================================
// Machines Hooks
// =============================================================================

export function useMachines(
  client: ApiClient,
  params?: ListMachinesParams & { enabled?: boolean }
) {
  return useQuery<Machine[], Error>({
    queryKey: reservationKeys.machinesAll(params?.activeOnly),
    queryFn: async () => fetchMachines(client, params),
    enabled: params?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useMachine(
  client: ApiClient,
  params: { machineId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.machineId ? String(params.machineId) : null;

  return useQuery<Machine | null, ApiError | Error>({
    queryKey: reservationKeys.machineDetail(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      try {
        return await fetchMachine(client, normalizedId);
      } catch (e: any) {
        if (e?.status === 404) return null;
        throw e;
      }
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMachineMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createMachineMutation = useMutation({
    mutationFn: (data: CreateMachineData) => createMachine(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.machines });
    },
  });

  const updateMachineMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMachineData }) =>
      updateMachine(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.machines });
      queryClient.invalidateQueries({ queryKey: reservationKeys.machineDetail(variables.id) });
    },
  });

  const deleteMachineMutation = useMutation({
    mutationFn: (id: string) => deleteMachine(client, id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.machines });
      queryClient.removeQueries({ queryKey: reservationKeys.machineDetail(variables) });
    },
  });

  return {
    createMachineMutation,
    updateMachineMutation,
    deleteMachineMutation,
  };
}

// =============================================================================
// Reservations Hooks
// =============================================================================

export function useReservations(
  client: ApiClient,
  params: ListReservationsParams & { enabled?: boolean }
) {
  return useQuery<Reservation[], Error>({
    queryKey: reservationKeys.reservationsList(params.machineId, params.start, params.end),
    queryFn: async () => fetchReservations(client, params),
    enabled: params.enabled ?? !!params.machineId,
    staleTime: 60 * 1000, // 1 minute (reservations change frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMyReservations(
  client: ApiClient,
  params?: ListMyReservationsParams & { enabled?: boolean }
) {
  return useQuery<Reservation[], Error>({
    queryKey: reservationKeys.myReservations(params?.includeHistory),
    queryFn: async () => fetchMyReservations(client, params),
    enabled: params?.enabled ?? true,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useReservation(
  client: ApiClient,
  params: { reservationId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.reservationId ? String(params.reservationId) : null;

  return useQuery<Reservation | null, ApiError | Error>({
    queryKey: reservationKeys.reservationDetail(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      try {
        return await fetchReservation(client, normalizedId);
      } catch (e: any) {
        if (e?.status === 404) return null;
        throw e;
      }
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCheckAvailability(
  client: ApiClient,
  params: CheckAvailabilityParams & { enabled?: boolean }
) {
  return useQuery<CheckAvailabilityResponse, Error>({
    queryKey: reservationKeys.availability(
      params.machineId,
      params.start,
      params.end,
      params.slotIndex
    ),
    queryFn: async () => checkAvailability(client, params),
    enabled: params.enabled ?? (!!params.machineId && !!params.start && !!params.end),
    staleTime: 30 * 1000, // 30 seconds (availability can change quickly)
    gcTime: 60 * 1000, // 1 minute
  });
}

export function usePendingApprovals(client: ApiClient, options?: { enabled?: boolean }) {
  return useQuery<Reservation[], Error>({
    queryKey: reservationKeys.pendingApprovals(),
    queryFn: async () => fetchPendingApprovals(client),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useReservationMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createReservationMutation = useMutation({
    mutationFn: (data: CreateReservationData) => createReservation(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
      queryClient.invalidateQueries({ queryKey: reservationKeys.pendingApprovals() });
    },
  });

  const updateReservationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReservationData }) =>
      updateReservation(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservationDetail(variables.id) });
    },
  });

  const cancelReservationMutation = useMutation({
    mutationFn: (id: string) => cancelReservation(client, id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservationDetail(variables) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.pendingApprovals() });
    },
  });

  const approveReservationMutation = useMutation({
    mutationFn: (id: string) => approveReservation(client, id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservationDetail(variables) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.pendingApprovals() });
    },
  });

  const rejectReservationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: RejectReservationData }) =>
      rejectReservation(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservationDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.pendingApprovals() });
    },
  });

  const checkInMutation = useMutation({
    mutationFn: (id: string) => checkInReservation(client, id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservationDetail(variables) });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (id: string) => checkOutReservation(client, id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservationDetail(variables) });
    },
  });

  return {
    createReservationMutation,
    updateReservationMutation,
    cancelReservationMutation,
    approveReservationMutation,
    rejectReservationMutation,
    checkInMutation,
    checkOutMutation,
  };
}

// =============================================================================
// Recurring Rules Hooks
// =============================================================================

export function useRecurringRules(client: ApiClient, options?: { enabled?: boolean }) {
  return useQuery<RecurringRule[], Error>({
    queryKey: reservationKeys.recurringRulesAll(),
    queryFn: async () => fetchRecurringRules(client),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useRecurringRule(
  client: ApiClient,
  params: { ruleId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.ruleId ? String(params.ruleId) : null;

  return useQuery<RecurringRule | null, ApiError | Error>({
    queryKey: reservationKeys.recurringRuleDetail(normalizedId),
    queryFn: async () => {
      if (!normalizedId) return null;
      try {
        return await fetchRecurringRule(client, normalizedId);
      } catch (e: any) {
        if (e?.status === 404) return null;
        throw e;
      }
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecurringRuleMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const createRuleMutation = useMutation({
    mutationFn: (data: CreateRecurringRuleData) => createRecurringRule(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.recurringRules });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringRuleData }) =>
      updateRecurringRule(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.recurringRules });
      queryClient.invalidateQueries({ queryKey: reservationKeys.recurringRuleDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
    },
  });

  const deactivateRuleMutation = useMutation({
    mutationFn: ({ id, params }: { id: string; params?: DeactivateRecurringRuleParams }) =>
      deactivateRecurringRule(client, id, params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.recurringRules });
      queryClient.invalidateQueries({ queryKey: reservationKeys.recurringRuleDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.reservations });
    },
  });

  return {
    createRuleMutation,
    updateRuleMutation,
    deactivateRuleMutation,
  };
}

// =============================================================================
// Machine Image Upload Hooks
// =============================================================================

export function useMachineImageUpload(client: ApiClient) {
  const generatePresignedUrlMutation = useMutation({
    mutationFn: (data: MachineImagePresignedUrlRequest) =>
      generateMachineImagePresignedUrl(client, data),
  });

  const getViewUrlMutation = useMutation({
    mutationFn: (data: MachineImageViewUrlRequest) => getMachineImageViewUrl(client, data),
  });

  return {
    generatePresignedUrlMutation,
    getViewUrlMutation,
  };
}
