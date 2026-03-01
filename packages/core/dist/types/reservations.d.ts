/**
 * Reservation System Types
 * Types for lab equipment/machine reservations
 */
export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'no_show';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';
export type MachineTagType = 'general' | 'location';
export interface MachineTag {
    id: string;
    labId: string;
    name: string;
    type: MachineTagType;
    color?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateMachineTagData {
    name: string;
    type?: MachineTagType;
    color?: string;
    description?: string;
}
export interface UpdateMachineTagData {
    name?: string;
    color?: string;
    description?: string;
}
export interface AvailableHours {
    start: string;
    end: string;
}
export interface ReminderSettings {
    enabled: boolean;
    minutesBefore: number;
    emailEnabled: boolean;
    pushEnabled: boolean;
}
/** Price structure for consumables (matches inventory ItemPrice) */
export interface ConsumablePrice {
    amount: number;
    currency: string;
}
/** Consumable linked to a machine by the machine owner */
export interface MachineConsumable {
    itemId: string;
    itemName: string;
    brandName?: string;
    pricePerUnit?: ConsumablePrice;
    units: string;
    required: boolean;
    defaultAmount?: number;
}
/** User's estimated consumption at reservation time */
export interface ConsumableEstimate {
    itemId: string;
    itemName: string;
    brandName?: string;
    amount: number;
    units: string;
}
/** Actual consumption recorded at check-out */
export interface ConsumableUsage {
    itemId: string;
    itemName: string;
    brandName: string;
    estimatedAmount: number;
    actualAmount: number;
    units: string;
    pricePerUnit?: ConsumablePrice;
    totalCost?: ConsumablePrice;
    decrementedAt: string;
}
/** Data for check-out with consumables */
export interface CheckOutReservationData {
    consumableUsages: ConsumableUsage[];
}
export type SharingPolicy = 'institution' | 'department' | 'lab_only' | 'collaborators';
export type ApprovalMode = 'any' | 'all';
export interface ApprovalRecord {
    userId: string;
    userName?: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: string;
    notes?: string;
}
export type MachineOwnershipLevel = 'lab' | 'department';
export interface Machine {
    id: string;
    labId: string;
    labName?: string;
    name: string;
    description?: string;
    location?: string;
    totalSlots: number;
    slotDurationMinutes: number;
    maxReservationMinutes?: number;
    bufferMinutes?: number;
    availableHours?: AvailableHours;
    availableDays?: number[];
    ownershipLevel?: MachineOwnershipLevel;
    departmentId?: string;
    departmentName?: string;
    institutionId?: string;
    requiresApproval: boolean;
    ownerUserId: string;
    approverUserIds?: string[];
    approvalMode?: ApprovalMode;
    sharingPolicy?: SharingPolicy;
    tagIds?: string[];
    tagNames?: string[];
    locationTagIds?: string[];
    locationTagNames?: string[];
    reminderSettings?: ReminderSettings;
    consumables?: MachineConsumable[];
    hourlyRate?: number;
    isActive: boolean;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateMachineData {
    name: string;
    description?: string;
    location?: string;
    totalSlots?: number;
    slotDurationMinutes: number;
    maxReservationMinutes?: number;
    bufferMinutes?: number;
    availableHours?: AvailableHours;
    availableDays?: number[];
    requiresApproval?: boolean;
    ownerUserId?: string;
    approverUserIds?: string[];
    approvalMode?: ApprovalMode;
    sharingPolicy?: SharingPolicy;
    tagIds?: string[];
    locationTagIds?: string[];
    reminderSettings?: ReminderSettings;
    consumables?: MachineConsumable[];
    hourlyRate?: number;
    imageUrl?: string;
    ownershipLevel?: MachineOwnershipLevel;
    departmentId?: string;
    departmentName?: string;
    institutionId?: string;
}
export interface UpdateMachineData {
    name?: string;
    description?: string;
    location?: string;
    totalSlots?: number;
    slotDurationMinutes?: number;
    maxReservationMinutes?: number;
    bufferMinutes?: number;
    availableHours?: AvailableHours;
    availableDays?: number[];
    requiresApproval?: boolean;
    ownerUserId?: string;
    approverUserIds?: string[];
    approvalMode?: ApprovalMode;
    sharingPolicy?: SharingPolicy;
    tagIds?: string[];
    locationTagIds?: string[];
    reminderSettings?: ReminderSettings;
    consumables?: MachineConsumable[];
    hourlyRate?: number;
    isActive?: boolean;
    imageUrl?: string;
}
export interface Reservation {
    id: string;
    labId: string;
    machineId: string;
    machineName?: string;
    machineLabName?: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    startTime: string;
    endTime: string;
    title?: string;
    notes?: string;
    slotIndex: number;
    status: ReservationStatus;
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
    approvals?: ApprovalRecord[];
    checkedInAt?: string;
    checkedOutAt?: string;
    consumableEstimates?: ConsumableEstimate[];
    consumableUsages?: ConsumableUsage[];
    recurringRuleId?: string;
    googleEventId?: string;
    outlookEventId?: string;
    reminderSent: boolean;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
    cancelledBy?: string;
}
export interface CreateReservationData {
    machineId: string;
    startTime: string;
    endTime: string;
    title?: string;
    notes?: string;
    slotIndex?: number;
    consumableEstimates?: ConsumableEstimate[];
}
export interface UpdateReservationData {
    startTime?: string;
    endTime?: string;
    title?: string;
    notes?: string;
}
export interface RecurringRule {
    id: string;
    labId: string;
    machineId: string;
    userId: string;
    frequency: RecurrenceFrequency;
    daysOfWeek?: number[];
    startTime: string;
    endTime: string;
    startDate: string;
    endDate?: string;
    title?: string;
    slotIndex: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CreateRecurringRuleData {
    machineId: string;
    frequency: RecurrenceFrequency;
    daysOfWeek?: number[];
    startTime: string;
    endTime: string;
    startDate: string;
    endDate?: string;
    title?: string;
    slotIndex?: number;
}
export interface UpdateRecurringRuleData {
    frequency?: RecurrenceFrequency;
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
    endDate?: string;
    title?: string;
    isActive?: boolean;
}
export interface ListReservationsParams {
    machineId: string;
    start?: string;
    end?: string;
}
export interface ListMyReservationsParams {
    includeHistory?: boolean;
}
export interface CheckAvailabilityParams {
    machineId: string;
    start: string;
    end: string;
    slotIndex?: number;
}
export interface CheckAvailabilityResponse {
    available: boolean;
    machineId: string;
    start: string;
    end: string;
    slotIndex: number;
}
export interface ListMachinesParams {
    activeOnly?: boolean;
    includeCollaborators?: boolean;
}
export interface RejectReservationData {
    reason?: string;
}
export interface SetMachineApproversData {
    approverUserIds: string[];
    approvalMode: ApprovalMode;
}
export interface SetMachineApproversResponse {
    message: string;
    approverUserIds: string[];
    approvalMode: string;
}
export interface ApproveReservationData {
    notes?: string;
}
export interface ApproveReservationResponse {
    message: string;
    approvedCount?: number;
    requiredCount?: number;
    status?: 'pending' | 'approved';
}
export interface DeactivateRecurringRuleParams {
    deleteFuture?: boolean;
}
export interface MachineImagePresignedUrlRequest {
    fileName?: string;
    extension: string;
}
export interface MachineImagePresignedUrlResponse {
    uploadUrl: string;
    s3Url: string;
    objectKey: string;
    expiresAt: number;
}
export interface MachineImageViewUrlRequest {
    s3Url: string;
}
export interface MachineImageViewUrlResponse {
    url: string;
    expiresAt: number;
}
export type SlotState = 'available' | 'booked' | 'yourBooking' | 'buffer' | 'unavailable' | 'selected' | 'pending';
export type SlotColors = Record<SlotState, string>;
export declare const DEFAULT_SLOT_COLORS: SlotColors;
//# sourceMappingURL=reservations.d.ts.map