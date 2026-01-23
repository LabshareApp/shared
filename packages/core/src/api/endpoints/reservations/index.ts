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
  DeactivateRecurringRuleParams,
  MachineImagePresignedUrlRequest,
  MachineImagePresignedUrlResponse,
  MachineImageViewUrlRequest,
  MachineImageViewUrlResponse,
  CheckOutReservationData,
} from '../../../types/reservations';
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
// Machine Tags
// =============================================================================

/**
 * Fetch all machine tags for the authenticated lab.
 */
export async function fetchMachineTags(client: ApiClient): Promise<MachineTag[]> {
  const response = await client.request<WithMongoId<MachineTag>[]>({
    method: 'GET',
    path: '/reservations/tags',
  });
  const validated = validateArrayResponse<WithMongoId<MachineTag>>(response, 'fetchMachineTags');
  return normalizeArray(validated);
}

/**
 * Create a new machine tag.
 */
export async function createMachineTag(
  client: ApiClient,
  data: CreateMachineTagData
): Promise<MachineTag> {
  const response = await client.request<WithMongoId<MachineTag>>({
    method: 'POST',
    path: '/reservations/create-tag',
    body: data,
  });
  const validated = validateObjectResponse(response, 'createMachineTag', ['id', 'name'] as any);
  return normalizeId(validated as WithMongoId<MachineTag>);
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

  const response = await client.request<WithMongoId<Machine>[]>({
    method: 'GET',
    path: '/reservations/machines',
    query: Object.keys(query).length > 0 ? query : undefined,
  });
  const validated = validateArrayResponse<WithMongoId<Machine>>(response, 'fetchMachines');
  return normalizeArray(validated);
}

/**
 * Fetch a single machine by ID.
 */
export async function fetchMachine(client: ApiClient, id: string): Promise<Machine> {
  const response = await client.request<WithMongoId<Machine>>({
    method: 'GET',
    path: '/reservations/machine',
    query: { id },
  });
  const validated = validateObjectResponse(response, 'fetchMachine', ['id', 'name'] as any);
  return normalizeId(validated as WithMongoId<Machine>);
}

/**
 * Create a new machine.
 */
export async function createMachine(
  client: ApiClient,
  data: CreateMachineData
): Promise<Machine> {
  const response = await client.request<WithMongoId<Machine>>({
    method: 'POST',
    path: '/reservations/create-machine',
    body: data,
  });
  const validated = validateObjectResponse(response, 'createMachine', ['id', 'name'] as any);
  return normalizeId(validated as WithMongoId<Machine>);
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

  const response = await client.request<WithMongoId<Reservation>[]>({
    method: 'GET',
    path: '/reservations/list',
    query,
  });
  const validated = validateArrayResponse<WithMongoId<Reservation>>(response, 'fetchReservations');
  return normalizeArray(validated);
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

  const response = await client.request<WithMongoId<Reservation>[]>({
    method: 'GET',
    path: '/reservations/my-reservations',
    query: Object.keys(query).length > 0 ? query : undefined,
  });
  const validated = validateArrayResponse<WithMongoId<Reservation>>(response, 'fetchMyReservations');
  return normalizeArray(validated);
}

/**
 * Fetch a single reservation by ID.
 */
export async function fetchReservation(client: ApiClient, id: string): Promise<Reservation> {
  const response = await client.request<WithMongoId<Reservation>>({
    method: 'GET',
    path: '/reservations/reservation',
    query: { id },
  });
  const validated = validateObjectResponse(response, 'fetchReservation', ['id', 'machineId'] as any);
  return normalizeId(validated as WithMongoId<Reservation>);
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
  return validateObjectResponse(response, 'checkAvailability', ['available'] as any) as CheckAvailabilityResponse;
}

/**
 * Create a new reservation.
 */
export async function createReservation(
  client: ApiClient,
  data: CreateReservationData
): Promise<Reservation> {
  const response = await client.request<WithMongoId<Reservation>>({
    method: 'POST',
    path: '/reservations/create',
    body: data,
  });
  const validated = validateObjectResponse(response, 'createReservation', ['id', 'machineId'] as any);
  return normalizeId(validated as WithMongoId<Reservation>);
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
  const response = await client.request<WithMongoId<Reservation>[]>({
    method: 'GET',
    path: '/reservations/pending-approvals',
  });
  const validated = validateArrayResponse<WithMongoId<Reservation>>(response, 'fetchPendingApprovals');
  return normalizeArray(validated);
}

/**
 * Approve a reservation request.
 */
export async function approveReservation(client: ApiClient, id: string): Promise<void> {
  await client.request({
    method: 'POST',
    path: '/reservations/approve',
    query: { id },
  });
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
  const response = await client.request<WithMongoId<RecurringRule>[]>({
    method: 'GET',
    path: '/reservations/recurring-rules',
  });
  const validated = validateArrayResponse<WithMongoId<RecurringRule>>(response, 'fetchRecurringRules');
  return normalizeArray(validated);
}

/**
 * Fetch a single recurring rule by ID.
 */
export async function fetchRecurringRule(client: ApiClient, id: string): Promise<RecurringRule> {
  const response = await client.request<WithMongoId<RecurringRule>>({
    method: 'GET',
    path: '/reservations/recurring-rule',
    query: { id },
  });
  const validated = validateObjectResponse(response, 'fetchRecurringRule', ['id', 'machineId'] as any);
  return normalizeId(validated as WithMongoId<RecurringRule>);
}

/**
 * Create a new recurring rule.
 */
export async function createRecurringRule(
  client: ApiClient,
  data: CreateRecurringRuleData
): Promise<RecurringRule> {
  const response = await client.request<WithMongoId<RecurringRule>>({
    method: 'POST',
    path: '/reservations/create-recurring',
    body: data,
  });
  const validated = validateObjectResponse(response, 'createRecurringRule', ['id', 'machineId'] as any);
  return normalizeId(validated as WithMongoId<RecurringRule>);
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
  return validateObjectResponse(response, 'generateMachineImagePresignedUrl', ['uploadUrl', 's3Url'] as any) as MachineImagePresignedUrlResponse;
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
  return validateObjectResponse(response, 'getMachineImageViewUrl', ['url', 'expiresAt'] as any) as MachineImageViewUrlResponse;
}
