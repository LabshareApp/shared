import type { ApiClient } from '../../ApiClient';
import type {
  MachineTag,
  CreateMachineTagData,
  UpdateMachineTagData,
  Machine,
  CreateMachineData,
  UpdateMachineData,
  Reservation,
  CreateReservationData,
  UpdateReservationData,
  RecurringRule,
  CreateRecurringRuleData,
  UpdateRecurringRuleData,
  ListReservationsParams,
  ListMyReservationsParams,
  CheckAvailabilityParams,
  CheckAvailabilityResponse,
  ListMachinesParams,
  RejectReservationData,
  SetMachineApproversData,
  SetMachineApproversResponse,
  ApproveReservationData,
  ApproveReservationResponse,
  DeactivateRecurringRuleParams,
  MachineImagePresignedUrlRequest,
  MachineImagePresignedUrlResponse,
  MachineImageViewUrlRequest,
  MachineImageViewUrlResponse,
  CheckOutReservationData,
  SlotColors,
} from '../../../types/reservations';
import { DEFAULT_SLOT_COLORS } from '../../../types/reservations';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

// =============================================================================
// Machine Tags
// =============================================================================

/**
 * Fetch all machine tags for the authenticated lab.
 */
export async function fetchMachineTags(client: ApiClient): Promise<MachineTag[]> {
  const response = await client.request<MachineTag[]>({
    method: 'GET',
    path: '/reservations/tags',
  });
  return validateArrayResponse<MachineTag>(response, 'fetchMachineTags');
}

/**
 * Create a new machine tag.
 */
export async function createMachineTag(
  client: ApiClient,
  data: CreateMachineTagData
): Promise<MachineTag> {
  const response = await client.request<MachineTag>({
    method: 'POST',
    path: '/reservations/create-tag',
    body: data,
  });
  return validateObjectResponse(response, 'createMachineTag', ['id', 'name']) as MachineTag;
}

/**
 * Update a machine tag.
 */
export async function updateMachineTag(
  client: ApiClient,
  id: string,
  data: UpdateMachineTagData
): Promise<void> {
  await client.request({
    method: 'PUT',
    path: '/reservations/update-tag',
    query: { id },
    body: data,
  });
}

/**
 * Delete a machine tag.
 */
export async function deleteMachineTag(client: ApiClient, id: string): Promise<void> {
  await client.request({
    method: 'DELETE',
    path: '/reservations/delete-tag',
    query: { id },
  });
}

// =============================================================================
// Machines
// =============================================================================

/**
 * Fetch all machines for the authenticated lab.
 * Set includeCollaborators=true to also include machines from accepted collaborator labs.
 */
export async function fetchMachines(
  client: ApiClient,
  params?: ListMachinesParams
): Promise<Machine[]> {
  const query: Record<string, string> = {};
  if (params?.activeOnly) {
    query.activeOnly = 'true';
  }
  if (params?.includeCollaborators) {
    query.includeCollaborators = 'true';
  }

  const response = await client.request<Machine[]>({
    method: 'GET',
    path: '/reservations/machines',
    query: Object.keys(query).length > 0 ? query : undefined,
  });
  return validateArrayResponse<Machine>(response, 'fetchMachines');
}

/**
 * Fetch machines from collaborating labs only.
 * Returns machines from labs with accepted collaboration where:
 * - Machine is active
 * - Machine's sharingPolicy allows access from the requesting lab
 */
export async function fetchCollaboratorMachines(
  client: ApiClient,
  params?: { activeOnly?: boolean }
): Promise<Machine[]> {
  const query: Record<string, string> = {};
  if (params?.activeOnly) {
    query.activeOnly = 'true';
  }

  const response = await client.request<Machine[]>({
    method: 'GET',
    path: '/reservations/machines/collaborator',
    query: Object.keys(query).length > 0 ? query : undefined,
  });
  return validateArrayResponse<Machine>(response, 'fetchCollaboratorMachines');
}

/**
 * Fetch a single machine by ID.
 * Set allowCollaborator=true to allow fetching machines from collaborating labs.
 */
export async function fetchMachine(
  client: ApiClient,
  id: string,
  options?: { allowCollaborator?: boolean }
): Promise<Machine> {
  const query: Record<string, string> = { id };
  if (options?.allowCollaborator) {
    query.allowCollaborator = 'true';
  }
  const response = await client.request<Machine>({
    method: 'GET',
    path: '/reservations/machine',
    query,
  });
  return validateObjectResponse(response, 'fetchMachine', ['id', 'name']) as Machine;
}

/**
 * Create a new machine.
 */
export async function createMachine(
  client: ApiClient,
  data: CreateMachineData
): Promise<Machine> {
  const response = await client.request<Machine>({
    method: 'POST',
    path: '/reservations/create-machine',
    body: data,
  });
  return validateObjectResponse(response, 'createMachine', ['id', 'name']) as Machine;
}

/**
 * Update a machine.
 */
export async function updateMachine(
  client: ApiClient,
  id: string,
  data: UpdateMachineData
): Promise<void> {
  await client.request({
    method: 'PUT',
    path: '/reservations/update-machine',
    query: { id },
    body: data,
  });
}

/**
 * Delete (deactivate) a machine.
 */
export async function deleteMachine(client: ApiClient, id: string): Promise<void> {
  await client.request({
    method: 'DELETE',
    path: '/reservations/delete-machine',
    query: { id },
  });
}

/**
 * Set approvers for a machine.
 * Only the machine owner can set approvers.
 */
export async function setMachineApprovers(
  client: ApiClient,
  id: string,
  data: SetMachineApproversData
): Promise<SetMachineApproversResponse> {
  const response = await client.request<SetMachineApproversResponse>({
    method: 'PUT',
    path: '/reservations/machine-approvers',
    query: { id },
    body: data,
  });
  return response;
}

// =============================================================================
// Reservations
// =============================================================================

/**
 * Fetch reservations for a machine within a date range.
 */
export async function fetchReservations(
  client: ApiClient,
  params: ListReservationsParams
): Promise<Reservation[]> {
  const query: Record<string, string> = {
    machineId: params.machineId,
  };
  if (params.start) {
    query.start = params.start;
  }
  if (params.end) {
    query.end = params.end;
  }

  const response = await client.request<Reservation[]>({
    method: 'GET',
    path: '/reservations/list',
    query,
  });
  return validateArrayResponse<Reservation>(response, 'fetchReservations');
}

/**
 * Fetch the current user's reservations.
 */
export async function fetchMyReservations(
  client: ApiClient,
  params?: ListMyReservationsParams
): Promise<Reservation[]> {
  const query: Record<string, string> = {};
  if (params?.includeHistory) {
    query.includeHistory = 'true';
  }

  const response = await client.request<Reservation[]>({
    method: 'GET',
    path: '/reservations/my-reservations',
    query: Object.keys(query).length > 0 ? query : undefined,
  });
  return validateArrayResponse<Reservation>(response, 'fetchMyReservations');
}

/**
 * Fetch a single reservation by ID.
 */
export async function fetchReservation(client: ApiClient, id: string): Promise<Reservation> {
  const response = await client.request<Reservation>({
    method: 'GET',
    path: '/reservations/reservation',
    query: { id },
  });
  return validateObjectResponse(response, 'fetchReservation', ['id', 'machineId']) as Reservation;
}

/**
 * Check availability for a time slot.
 */
export async function checkAvailability(
  client: ApiClient,
  params: CheckAvailabilityParams
): Promise<CheckAvailabilityResponse> {
  const query: Record<string, string> = {
    machineId: params.machineId,
    start: params.start,
    end: params.end,
  };
  if (params.slotIndex !== undefined) {
    query.slotIndex = String(params.slotIndex);
  }

  const response = await client.request<CheckAvailabilityResponse>({
    method: 'GET',
    path: '/reservations/check-availability',
    query,
  });
  return validateObjectResponse(response, 'checkAvailability', ['available']) as CheckAvailabilityResponse;
}

/**
 * Create a new reservation.
 */
export async function createReservation(
  client: ApiClient,
  data: CreateReservationData
): Promise<Reservation> {
  const response = await client.request<Reservation>({
    method: 'POST',
    path: '/reservations/create',
    body: data,
  });
  return validateObjectResponse(response, 'createReservation', ['id', 'machineId']) as Reservation;
}

/**
 * Update a reservation.
 */
export async function updateReservation(
  client: ApiClient,
  id: string,
  data: UpdateReservationData
): Promise<void> {
  await client.request({
    method: 'PUT',
    path: '/reservations/update',
    query: { id },
    body: data,
  });
}

/**
 * Cancel a reservation.
 */
export async function cancelReservation(client: ApiClient, id: string): Promise<void> {
  await client.request({
    method: 'POST',
    path: '/reservations/cancel',
    query: { id },
  });
}

/**
 * Fetch pending approval requests (for machine owners).
 */
export async function fetchPendingApprovals(client: ApiClient): Promise<Reservation[]> {
  const response = await client.request<Reservation[]>({
    method: 'GET',
    path: '/reservations/pending-approvals',
  });
  return validateArrayResponse<Reservation>(response, 'fetchPendingApprovals');
}

/**
 * Approve a reservation request.
 * For multi-approver machines, this may return approval progress.
 */
export async function approveReservation(
  client: ApiClient,
  id: string,
  data?: ApproveReservationData
): Promise<ApproveReservationResponse> {
  const response = await client.request<ApproveReservationResponse>({
    method: 'POST',
    path: '/reservations/approve',
    query: { id },
    body: data,
  });
  return response;
}

/**
 * Reject a reservation request.
 */
export async function rejectReservation(
  client: ApiClient,
  id: string,
  data?: RejectReservationData
): Promise<void> {
  await client.request({
    method: 'POST',
    path: '/reservations/reject',
    query: { id },
    body: data,
  });
}

/**
 * Check in to a reservation.
 */
export async function checkInReservation(client: ApiClient, id: string): Promise<void> {
  await client.request({
    method: 'POST',
    path: '/reservations/check-in',
    query: { id },
  });
}

/**
 * Check out from a reservation.
 * Optionally pass consumable usage data to decrement inventory.
 */
export async function checkOutReservation(
  client: ApiClient,
  id: string,
  data?: CheckOutReservationData
): Promise<void> {
  await client.request({
    method: 'POST',
    path: '/reservations/check-out',
    query: { id },
    body: data,
  });
}

// =============================================================================
// Recurring Rules
// =============================================================================

/**
 * Fetch active recurring rules for the authenticated lab.
 */
export async function fetchRecurringRules(client: ApiClient): Promise<RecurringRule[]> {
  const response = await client.request<RecurringRule[]>({
    method: 'GET',
    path: '/reservations/recurring-rules',
  });
  return validateArrayResponse<RecurringRule>(response, 'fetchRecurringRules');
}

/**
 * Fetch a single recurring rule by ID.
 */
export async function fetchRecurringRule(client: ApiClient, id: string): Promise<RecurringRule> {
  const response = await client.request<RecurringRule>({
    method: 'GET',
    path: '/reservations/recurring-rule',
    query: { id },
  });
  return validateObjectResponse(response, 'fetchRecurringRule', ['id', 'machineId']) as RecurringRule;
}

/**
 * Create a new recurring rule.
 */
export async function createRecurringRule(
  client: ApiClient,
  data: CreateRecurringRuleData
): Promise<RecurringRule> {
  const response = await client.request<RecurringRule>({
    method: 'POST',
    path: '/reservations/create-recurring',
    body: data,
  });
  return validateObjectResponse(response, 'createRecurringRule', ['id', 'machineId']) as RecurringRule;
}

/**
 * Update a recurring rule.
 */
export async function updateRecurringRule(
  client: ApiClient,
  id: string,
  data: UpdateRecurringRuleData
): Promise<void> {
  await client.request({
    method: 'PUT',
    path: '/reservations/update-recurring',
    query: { id },
    body: data,
  });
}

/**
 * Deactivate a recurring rule.
 */
export async function deactivateRecurringRule(
  client: ApiClient,
  id: string,
  params?: DeactivateRecurringRuleParams
): Promise<void> {
  const query: Record<string, string> = { id };
  if (params?.deleteFuture) {
    query.deleteFuture = 'true';
  }

  await client.request({
    method: 'POST',
    path: '/reservations/deactivate-recurring',
    query,
  });
}

// =============================================================================
// Machine Image Upload
// =============================================================================

/**
 * Generate a presigned URL for uploading a machine image.
 */
export async function generateMachineImagePresignedUrl(
  client: ApiClient,
  data: MachineImagePresignedUrlRequest
): Promise<MachineImagePresignedUrlResponse> {
  const response = await client.request<MachineImagePresignedUrlResponse>({
    method: 'POST',
    path: '/reservations/generate-presigned-url/machine-image',
    body: data,
  });
  return validateObjectResponse(response, 'generateMachineImagePresignedUrl', ['uploadUrl', 's3Url']) as MachineImagePresignedUrlResponse;
}

/**
 * Get a presigned URL for viewing a machine image.
 */
export async function getMachineImageViewUrl(
  client: ApiClient,
  data: MachineImageViewUrlRequest
): Promise<MachineImageViewUrlResponse> {
  const response = await client.request<MachineImageViewUrlResponse>({
    method: 'POST',
    path: '/reservations/get-machine-image-view-url',
    body: data,
  });
  return validateObjectResponse(response, 'getMachineImageViewUrl', ['url', 'expiresAt']) as MachineImageViewUrlResponse;
}

// =============================================================================
// Slot Colors (User Preferences)
// =============================================================================

/**
 * Fetch the user's slot color preferences.
 * Returns default colors if no preferences are saved.
 */
export async function fetchSlotColors(client: ApiClient): Promise<SlotColors> {
  try {
    const response = await client.request<{ slotColors?: SlotColors }>({
      method: 'GET',
      path: '/preferences/slot-colors',
    });
    return response?.slotColors ?? DEFAULT_SLOT_COLORS;
  } catch {
    // Return defaults if endpoint doesn't exist or fails
    return DEFAULT_SLOT_COLORS;
  }
}

/**
 * Update the user's slot color preferences.
 */
export async function updateSlotColors(
  client: ApiClient,
  colors: SlotColors
): Promise<void> {
  await client.request({
    method: 'PUT',
    path: '/preferences/slot-colors',
    body: { slotColors: colors },
  });
}
