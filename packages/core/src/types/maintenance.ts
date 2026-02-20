/**
 * Maintenance Request Types
 * Types for tool maintenance request workflow
 */

export type MaintenanceRequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface MaintenanceRequest {
  id: string;
  toolId: string;
  toolName: string;
  labId: string;

  // Request details
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceRequestStatus;

  // Requester
  requestedBy: string;       // User ID
  requestedByEmail: string;  // Denormalized
  requestedAt: string;

  // Assignment
  assignedTo?: string;       // User ID (maintenance staff)
  assignedToEmail?: string;
  assignedAt?: string;

  // Resolution
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;

  // Department (if department-level tool)
  departmentId?: string;
  departmentName?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRequestData {
  toolId: string;
  description: string;
  priority?: MaintenancePriority;
}

export interface UpdateMaintenanceRequestData {
  status?: MaintenanceRequestStatus;
  priority?: MaintenancePriority;
  assignedTo?: string;
  resolutionNotes?: string;
}

export interface MaintenanceRequestListResponse {
  requests: MaintenanceRequest[];
  totalCount: number;
}

export interface ListMaintenanceRequestsParams {
  toolId?: string;
  status?: MaintenanceRequestStatus;
  priority?: MaintenancePriority;
  limit?: number;
  offset?: number;
}
