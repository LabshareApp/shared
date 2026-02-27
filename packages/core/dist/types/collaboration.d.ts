import type { BrandInfo } from './inventory';
export interface Collaborator {
    labId: string;
    status: 'sent' | 'pending' | 'accepted';
    name?: string;
    institution?: string;
}
export interface CollaborationRequest {
    targetLabId: string;
}
export interface AcceptCollaborationRequest {
    requestingLabId: string;
}
export interface DeleteCollaborationRequest {
    collaboratorLabId: string;
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
export interface CollaboratorItem {
    id: string;
    name: string;
    labId: string;
    labName: string;
    brands: {
        [brandName: string]: BrandInfo;
    };
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
    labId?: string;
    labIds?: string[];
}
export type { SearchRequest } from './inventory';
//# sourceMappingURL=collaboration.d.ts.map