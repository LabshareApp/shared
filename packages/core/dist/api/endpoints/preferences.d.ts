import type { ApiClient } from '../ApiClient';
import type { WorkspacePrefsMap } from '../../types/preferences';
/**
 * Fetch the user's workspace appearance preferences.
 * Returns an empty map if none are saved or on error.
 */
export declare function fetchWorkspacePrefs(client: ApiClient): Promise<WorkspacePrefsMap>;
/**
 * Update the user's workspace appearance preferences.
 */
export declare function updateWorkspacePrefs(client: ApiClient, prefs: WorkspacePrefsMap): Promise<void>;
//# sourceMappingURL=preferences.d.ts.map