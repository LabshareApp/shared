import type { ApiClient } from '../../ApiClient';
import type { UserLab, SwitchLabRequest, SwitchLabResponse } from '../../../types/labs';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

/** Fetch all labs the authenticated user belongs to. */
export async function getMyLabs(client: ApiClient): Promise<UserLab[]> {
  const res = await client.request<UserLab[]>({
    method: 'GET',
    path: '/my-labs',
  });
  return validateArrayResponse<UserLab>(res, 'getMyLabs');
}

/** Switch the user's active/default lab. Updates profiles.lab_id in Supabase. */
export async function switchLab(client: ApiClient, labId: string): Promise<SwitchLabResponse> {
  const res = await client.request<SwitchLabResponse>({
    method: 'POST',
    path: '/switch-lab',
    body: { labId } satisfies SwitchLabRequest,
  });
  return validateObjectResponse<SwitchLabResponse>(res, 'switchLab', ['labId']);
}
