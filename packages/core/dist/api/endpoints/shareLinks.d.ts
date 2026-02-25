import type { ApiClient } from '../ApiClient';
import type { ShareLink, CreateShareLinkData, ShareLinkPublicData, ShareLinkRequestData, ShareLinkRequest, ShareLinkListResponse, ShareLinkItemType } from '../../types/shareLinks';
/**
 * Create a share link for an item (authenticated).
 */
export declare function createShareLink(client: ApiClient, data: CreateShareLinkData): Promise<ShareLink>;
/**
 * Get public share link data by token (no auth required).
 */
export declare function getPublicShareLink(client: ApiClient, token: string): Promise<ShareLinkPublicData>;
/**
 * Delete (deactivate) a share link (authenticated).
 */
export declare function deleteShareLink(client: ApiClient, token: string): Promise<void>;
/**
 * List all active share links for an item (authenticated).
 */
export declare function listShareLinks(client: ApiClient, itemId: string, itemType: ShareLinkItemType): Promise<ShareLinkListResponse>;
/**
 * Submit a request via a share link (no auth required).
 */
export declare function submitShareLinkRequest(client: ApiClient, token: string, data: ShareLinkRequestData): Promise<ShareLinkRequest>;
//# sourceMappingURL=shareLinks.d.ts.map