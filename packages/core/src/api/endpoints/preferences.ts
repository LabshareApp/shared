import type { ApiClient } from '../ApiClient';
import type { WorkspacePrefsMap } from '../../types/preferences';

/**
 * Fetch the user's workspace appearance preferences.
 * Returns an empty map if none are saved or on error.
 */
export async function fetchWorkspacePrefs(
  client: ApiClient
): Promise<WorkspacePrefsMap> {
  try {
    const response = await client.request<{
      workspacePrefs?: WorkspacePrefsMap;
    }>({
      method: 'GET',
      path: '/preferences/workspace',
    });
    return response?.workspacePrefs ?? {};
  } catch {
    return {};
  }
}

/**
 * Update the user's workspace appearance preferences.
 */
export async function updateWorkspacePrefs(
  client: ApiClient,
  prefs: WorkspacePrefsMap
): Promise<void> {
  await client.request({
    method: 'PUT',
    path: '/preferences/workspace',
    body: { workspacePrefs: prefs },
  });
}
