import type { ApiClient } from '../../ApiClient';
import type { UserLab, SwitchLabResponse } from '../../../types/labs';
/** Fetch all labs the authenticated user belongs to. */
export declare function getMyLabs(client: ApiClient): Promise<UserLab[]>;
/** Switch the user's active/default lab. Updates profiles.lab_id in Supabase. */
export declare function switchLab(client: ApiClient, labId: string): Promise<SwitchLabResponse>;
//# sourceMappingURL=multiLab.d.ts.map