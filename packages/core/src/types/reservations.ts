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

export interface MachineTag {
  id: string;
  labId: string;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMachineTagData {
  name: string;
  color?: string;
}

export interface UpdateMachineTagData {
  name?: string;
  color?: string;
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

// --- Machines ---

export interface Machine {
  id: string;
  labId: string;
  name: string;
  description?: string;
  location?: string;
  totalSlots: number;
  slotDurationMinutes: number;
  maxReservationMinutes?: number;
  bufferMinutes?: number;
  availableHours?: AvailableHours;
  availableDays?: number[]; // 0=Sunday, 1=Monday, etc.
  requiresApproval: boolean;
  ownerUserId: string;
  tagIds?: string[];
  tagNames?: string[];
  reminderSettings?: ReminderSettings;
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
  tagIds?: string[];
  reminderSettings?: ReminderSettings;
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
  tagIds?: string[];
  reminderSettings?: ReminderSettings;
  isActive?: boolean;
  imageUrl?: string;
}

// --- Reservations ---

export interface Reservation {
  id: string;
  labId: string;
  machineId: string;
  userId: string;
  startTime: string;
  endTime: string;
  title?: string;
  notes?: string;
  slotIndex: number;
  status: ReservationStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
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
}

export interface UpdateReservationData {
  startTime?: string;
  endTime?: string;
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
}

export interface RejectReservationData {
  reason?: string;
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
