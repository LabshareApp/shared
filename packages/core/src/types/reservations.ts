/**
 * Reservation System Types
 * Types for lab equipment/machine reservations
 */

// --- Enums/Constants ---

export type ReservationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type RecurrenceFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly';

// --- Machine Tags ---

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
  type?: MachineTagType; // Defaults to 'general' if not specified
  color?: string;
  description?: string;
}

export interface UpdateMachineTagData {
  name?: string;
  color?: string;
  description?: string;
}

// --- Available Hours ---

export interface AvailableHours {
  start: string; // "HH:MM" format
  end: string;   // "HH:MM" format
}

// --- Reminder Settings ---

export interface ReminderSettings {
  enabled: boolean;
  minutesBefore: number;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

// --- Consumables ---

/** Price structure for consumables (matches inventory ItemPrice) */
export interface ConsumablePrice {
  amount: number; // Price in cents (smallest currency unit)
  currency: string; // ISO 4217 code (e.g., "USD")
}

/** Consumable linked to a machine by the machine owner */
export interface MachineConsumable {
  itemId: string;
  itemName: string;
  brandName?: string; // Empty = any brand can be used
  pricePerUnit?: ConsumablePrice; // Snapshot at link time
  units: string; // e.g., "mL", "g", "units"
  required: boolean; // Must be specified during reservation
  defaultAmount?: number; // Pre-fill value for estimates
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
  pricePerUnit?: ConsumablePrice; // Price at usage time
  totalCost?: ConsumablePrice; // Calculated total
  decrementedAt: string;
}

/** Data for check-out with consumables */
export interface CheckOutReservationData {
  consumableUsages: ConsumableUsage[];
}

// --- Approval Mode ---

export type ApprovalMode = 'any' | 'all';

// --- Approval Record (for multi-approver support) ---

export interface ApprovalRecord {
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  notes?: string;
}

// --- Machines ---

export interface Machine {
  id: string;
  labId: string;
  labName?: string; // Populated at runtime for display, not stored in DB
  name: string;
  description?: string;
  location?: string; // Legacy free-text field (deprecated in favor of locationTags)
  totalSlots: number;
  slotDurationMinutes: number;
  maxReservationMinutes?: number;
  bufferMinutes?: number;
  availableHours?: AvailableHours;
  availableDays?: number[]; // 0=Sunday, 1=Monday, etc.
  requiresApproval: boolean;
  ownerUserId: string;
  approverUserIds?: string[]; // Per-machine super users who can approve
  approvalMode?: ApprovalMode; // 'any' (any approver) or 'all' (all must approve)
  collaboratorsOnly?: boolean; // If true, only visible to collaborating labs (not whole institution)
  tagIds?: string[];
  tagNames?: string[];
  locationTagIds?: string[];
  locationTagNames?: string[];
  reminderSettings?: ReminderSettings;
  consumables?: MachineConsumable[]; // Linked inventory items
  hourlyRate?: number; // Cents per hour for billing (e.g., 5000 = $50/hr)
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
  approverUserIds?: string[]; // Per-machine super users who can approve
  approvalMode?: ApprovalMode; // 'any' (any approver) or 'all' (all must approve)
  collaboratorsOnly?: boolean; // If true, only visible to collaborating labs (not whole institution)
  tagIds?: string[];
  locationTagIds?: string[];
  reminderSettings?: ReminderSettings;
  consumables?: MachineConsumable[];
  hourlyRate?: number; // Cents per hour for billing (e.g., 5000 = $50/hr)
  imageUrl?: string;
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
  approverUserIds?: string[]; // Per-machine super users who can approve
  approvalMode?: ApprovalMode; // 'any' (any approver) or 'all' (all must approve)
  collaboratorsOnly?: boolean; // If true, only visible to collaborating labs (not whole institution)
  tagIds?: string[];
  locationTagIds?: string[];
  reminderSettings?: ReminderSettings;
  consumables?: MachineConsumable[];
  hourlyRate?: number; // Cents per hour for billing (e.g., 5000 = $50/hr)
  isActive?: boolean;
  imageUrl?: string;
}

// --- Reservations ---

export interface Reservation {
  id: string;
  labId: string;
  machineId: string;
  machineName?: string; // Populated at runtime for display, not stored in DB
  machineLabName?: string; // Populated at runtime for display, not stored in DB
  userId: string;
  startTime: string; // ISO 8601 UTC format (e.g., "2024-01-15T10:30:00Z")
  endTime: string;   // ISO 8601 UTC format (e.g., "2024-01-15T11:30:00Z")
  title?: string;
  notes?: string;
  slotIndex: number;
  status: ReservationStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  approvals?: ApprovalRecord[]; // For multi-approver support
  checkedInAt?: string;
  checkedOutAt?: string;
  consumableEstimates?: ConsumableEstimate[]; // User's planned usage
  consumableUsages?: ConsumableUsage[]; // Actual usage recorded at check-out
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
  startTime: string; // ISO 8601 UTC format (e.g., "2024-01-15T10:30:00Z")
  endTime: string;   // ISO 8601 UTC format (e.g., "2024-01-15T11:30:00Z")
  title?: string;
  notes?: string;
  slotIndex?: number;
  consumableEstimates?: ConsumableEstimate[];
}

export interface UpdateReservationData {
  startTime?: string; // ISO 8601 UTC format (e.g., "2024-01-15T10:30:00Z")
  endTime?: string;   // ISO 8601 UTC format (e.g., "2024-01-15T11:30:00Z")
  title?: string;
  notes?: string;
}

// --- Recurring Rules ---

export interface RecurringRule {
  id: string;
  labId: string;
  machineId: string;
  userId: string;
  frequency: RecurrenceFrequency;
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  startTime: string; // "HH:MM" format
  endTime: string;   // "HH:MM" format
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

// --- API Request/Response Types ---

export interface ListReservationsParams {
  machineId: string;
  start?: string; // ISO 8601 UTC format (e.g., "2024-01-15T00:00:00Z")
  end?: string;   // ISO 8601 UTC format (e.g., "2024-01-15T23:59:59Z")
}

export interface ListMyReservationsParams {
  includeHistory?: boolean;
}

export interface CheckAvailabilityParams {
  machineId: string;
  start: string;  // ISO 8601 UTC format (e.g., "2024-01-15T10:30:00Z")
  end: string;    // ISO 8601 UTC format (e.g., "2024-01-15T11:30:00Z")
  slotIndex?: number;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  machineId: string;
  start: string;  // ISO 8601 UTC format
  end: string;    // ISO 8601 UTC format
  slotIndex: number;
}

export interface ListMachinesParams {
  activeOnly?: boolean;
  includeCollaborators?: boolean; // Include machines from accepted collaborator labs
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

// --- Slot Colors (Calendar Customization) ---

export type SlotState =
  | 'available'
  | 'booked'
  | 'yourBooking'
  | 'buffer'
  | 'unavailable'
  | 'selected'
  | 'pending';

export type SlotColors = Record<SlotState, string>;

export const DEFAULT_SLOT_COLORS: SlotColors = {
  available: '#10B981',    // Emerald green
  booked: '#EF4444',       // Red
  yourBooking: '#3B82F6',  // Blue
  buffer: '#FBBF24',       // Amber
  unavailable: '#E5E7EB',  // Light gray
  selected: '#8B5CF6',     // Purple
  pending: '#F59E0B',      // Orange
};
