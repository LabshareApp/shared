// ShareLink types for shareable item links

export type ShareLinkItemType = 'tool' | 'machine' | 'inventory';

export interface ShareLink {
  id: string;
  token: string;
  itemId: string;
  itemType: ShareLinkItemType;
  labId: string;
  createdBy: string;
  expiresAt?: string;
  message?: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
}

export interface CreateShareLinkData {
  itemId: string;
  itemType: ShareLinkItemType;
  expiresIn?: number; // Days until expiration (null = never)
  message?: string;
}

export interface PublicItemData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
  status?: string;
  labName?: string;
}

export interface ShareLinkPublicData {
  token: string;
  itemType: ShareLinkItemType;
  message?: string;
  expiresAt?: string;
  item: PublicItemData;
}

export interface ShareLinkRequestData {
  email: string;
  name?: string;
  message?: string;
}

export interface ShareLinkRequest {
  id: string;
  shareLinkToken: string;
  itemId: string;
  itemType: ShareLinkItemType;
  labId: string;
  requesterEmail: string;
  requesterName?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ShareLinkListResponse {
  shareLinks: ShareLink[];
}
