import type { BrandInfo } from './inventory';

export interface Collaborator {
  lab_id: string;
  labId: string;
  status: 'sent' | 'pending' | 'accepted';
  name?: string;
  institution?: string;
}

export interface CollaborationRequest {
  target_lab_id: string;
}

export interface AcceptCollaborationRequest {
  requesting_lab_id: string;
}

export interface DeleteCollaborationRequest {
  collaborator_lab_id: string;
}

export interface CollaborationResponse {
  message: string;
}

export interface LabInfo {
  id: string;
  name: string;
  institution: string;
  collaborators?: Collaborator[];
}

// --- Collaborator inventory search ---

export interface CollaboratorItem {
  id: string;
  name: string;
  labId: string;
  labName: string;
  brands: { [brandName: string]: BrandInfo };
  totalQuantity: number;
  units?: string;
  expirationDate?: string;
  locationTags: string[];
  grantTags: string[];
  description: string;
}

export interface CollaboratorSearchResponse {
  items: CollaboratorItem[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  nextPage: number;
}

export interface CollaboratorFilterResponse {
  total: number;
  items: CollaboratorItem[];
}

export interface CollaboratorFilterRequest {
  pagination: {
    page: number;
    limit: number;
  };
}

export interface CollaboratorSearchParams {
  term?: string;
  page?: number;
  limit?: number;
  // Backward compatibility
  labId?: string;
  // Multi-selection
  labIds?: string[];
}

// Re-export SearchRequest from inventory types for convenience
export type { SearchRequest } from './inventory';





