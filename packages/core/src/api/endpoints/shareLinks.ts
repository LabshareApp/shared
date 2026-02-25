import type { ApiClient } from '../ApiClient';
import type {
  ShareLink,
  CreateShareLinkData,
  ShareLinkPublicData,
  ShareLinkRequestData,
  ShareLinkRequest,
  ShareLinkListResponse,
  ShareLinkItemType,
} from '../../types/shareLinks';

/**
 * Create a share link for an item (authenticated).
 */
export async function createShareLink(
  client: ApiClient,
  data: CreateShareLinkData
): Promise<ShareLink> {
  const response = await client.request<ShareLink>({
    method: 'POST',
    path: '/share-links',
    body: data,
  });
  return response;
}

/**
 * Get public share link data by token (no auth required).
 */
export async function getPublicShareLink(
  client: ApiClient,
  token: string
): Promise<ShareLinkPublicData> {
  const response = await client.request<ShareLinkPublicData>({
    method: 'GET',
    path: '/share-link',
    query: { token },
  });
  return response;
}

/**
 * Delete (deactivate) a share link (authenticated).
 */
export async function deleteShareLink(
  client: ApiClient,
  token: string
): Promise<void> {
  await client.request<{ message: string }>({
    method: 'DELETE',
    path: '/share-links',
    query: { token },
  });
}

/**
 * List all active share links for an item (authenticated).
 */
export async function listShareLinks(
  client: ApiClient,
  itemId: string,
  itemType: ShareLinkItemType
): Promise<ShareLinkListResponse> {
  const response = await client.request<ShareLinkListResponse>({
    method: 'GET',
    path: '/share-links',
    query: { itemId, itemType },
  });
  return {
    shareLinks: response.shareLinks || [],
  };
}

/**
 * Submit a request via a share link (no auth required).
 */
export async function submitShareLinkRequest(
  client: ApiClient,
  token: string,
  data: ShareLinkRequestData
): Promise<ShareLinkRequest> {
  const response = await client.request<ShareLinkRequest>({
    method: 'POST',
    path: '/share-link-request',
    query: { token },
    body: data,
  });
  return response;
}
