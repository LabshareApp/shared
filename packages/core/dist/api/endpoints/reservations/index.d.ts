import type { ApiClient } from '../../ApiClient';
import type { MachineTag, CreateMachineTagData, UpdateMachineTagData, Machine, CreateMachineData, UpdateMachineData, Reservation, CreateReservationData, UpdateReservationData, RecurringRule, CreateRecurringRuleData, UpdateRecurringRuleData, ListReservationsParams, ListMyReservationsParams, CheckAvailabilityParams, CheckAvailabilityResponse, ListMachinesParams, RejectReservationData, SetMachineApproversData, SetMachineApproversResponse, ApproveReservationData, ApproveReservationResponse, DeactivateRecurringRuleParams, MachineImagePresignedUrlRequest, MachineImagePresignedUrlResponse, MachineImageViewUrlRequest, MachineImageViewUrlResponse, CheckOutReservationData, SlotColors } from '../../../types/reservations';
/**
 * Fetch all machine tags for the authenticated lab.
 */
export declare function fetchMachineTags(client: ApiClient): Promise<MachineTag[]>;
/**
 * Create a new machine tag.
 */
export declare function createMachineTag(client: ApiClient, data: CreateMachineTagData): Promise<MachineTag>;
/**
 * Update a machine tag.
 */
export declare function updateMachineTag(client: ApiClient, id: string, data: UpdateMachineTagData): Promise<void>;
/**
 * Delete a machine tag.
 */
export declare function deleteMachineTag(client: ApiClient, id: string): Promise<void>;
/**
 * Fetch all machines for the authenticated lab.
 * Set includeCollaborators=true to also include machines from accepted collaborator labs.
 */
export declare function fetchMachines(client: ApiClient, params?: ListMachinesParams): Promise<Machine[]>;
/**
 * Fetch machines from collaborating labs only.
 * Returns machines from labs with accepted collaboration where:
 * - Machine is active
 * - Machine's sharingPolicy allows access from the requesting lab
 */
export declare function fetchCollaboratorMachines(client: ApiClient, params?: {
    activeOnly?: boolean;
}): Promise<Machine[]>;
/**
 * Fetch a single machine by ID.
 * Set allowCollaborator=true to allow fetching machines from collaborating labs.
 */
export declare function fetchMachine(client: ApiClient, id: string, options?: {
    allowCollaborator?: boolean;
}): Promise<Machine>;
/**
 * Create a new machine.
 */
export declare function createMachine(client: ApiClient, data: CreateMachineData): Promise<Machine>;
/**
 * Update a machine.
 */
export declare function updateMachine(client: ApiClient, id: string, data: UpdateMachineData): Promise<void>;
/**
 * Delete (deactivate) a machine.
 */
export declare function deleteMachine(client: ApiClient, id: string): Promise<void>;
/**
 * Set approvers for a machine.
 * Only the machine owner can set approvers.
 */
export declare function setMachineApprovers(client: ApiClient, id: string, data: SetMachineApproversData): Promise<SetMachineApproversResponse>;
/**
 * Fetch reservations for a machine within a date range.
 */
export declare function fetchReservations(client: ApiClient, params: ListReservationsParams): Promise<Reservation[]>;
/**
 * Fetch the current user's reservations.
 */
export declare function fetchMyReservations(client: ApiClient, params?: ListMyReservationsParams): Promise<Reservation[]>;
/**
 * Fetch a single reservation by ID.
 */
export declare function fetchReservation(client: ApiClient, id: string): Promise<Reservation>;
/**
 * Check availability for a time slot.
 */
export declare function checkAvailability(client: ApiClient, params: CheckAvailabilityParams): Promise<CheckAvailabilityResponse>;
/**
 * Create a new reservation.
 */
export declare function createReservation(client: ApiClient, data: CreateReservationData): Promise<Reservation>;
/**
 * Update a reservation.
 */
export declare function updateReservation(client: ApiClient, id: string, data: UpdateReservationData): Promise<void>;
/**
 * Cancel a reservation.
 */
export declare function cancelReservation(client: ApiClient, id: string): Promise<void>;
/**
 * Fetch pending approval requests (for machine owners).
 */
export declare function fetchPendingApprovals(client: ApiClient): Promise<Reservation[]>;
/**
 * Approve a reservation request.
 * For multi-approver machines, this may return approval progress.
 */
export declare function approveReservation(client: ApiClient, id: string, data?: ApproveReservationData): Promise<ApproveReservationResponse>;
/**
 * Reject a reservation request.
 */
export declare function rejectReservation(client: ApiClient, id: string, data?: RejectReservationData): Promise<void>;
/**
 * Check in to a reservation.
 */
export declare function checkInReservation(client: ApiClient, id: string): Promise<void>;
/**
 * Check out from a reservation.
 * Optionally pass consumable usage data to decrement inventory.
 */
export declare function checkOutReservation(client: ApiClient, id: string, data?: CheckOutReservationData): Promise<void>;
/**
 * Fetch active recurring rules for the authenticated lab.
 */
export declare function fetchRecurringRules(client: ApiClient): Promise<RecurringRule[]>;
/**
 * Fetch a single recurring rule by ID.
 */
export declare function fetchRecurringRule(client: ApiClient, id: string): Promise<RecurringRule>;
/**
 * Create a new recurring rule.
 */
export declare function createRecurringRule(client: ApiClient, data: CreateRecurringRuleData): Promise<RecurringRule>;
/**
 * Update a recurring rule.
 */
export declare function updateRecurringRule(client: ApiClient, id: string, data: UpdateRecurringRuleData): Promise<void>;
/**
 * Deactivate a recurring rule.
 */
export declare function deactivateRecurringRule(client: ApiClient, id: string, params?: DeactivateRecurringRuleParams): Promise<void>;
/**
 * Generate a presigned URL for uploading a machine image.
 */
export declare function generateMachineImagePresignedUrl(client: ApiClient, data: MachineImagePresignedUrlRequest): Promise<MachineImagePresignedUrlResponse>;
/**
 * Get a presigned URL for viewing a machine image.
 */
export declare function getMachineImageViewUrl(client: ApiClient, data: MachineImageViewUrlRequest): Promise<MachineImageViewUrlResponse>;
/**
 * Fetch the user's slot color preferences.
 * Returns default colors if no preferences are saved.
 */
export declare function fetchSlotColors(client: ApiClient): Promise<SlotColors>;
/**
 * Update the user's slot color preferences.
 */
export declare function updateSlotColors(client: ApiClient, colors: SlotColors): Promise<void>;
//# sourceMappingURL=index.d.ts.map