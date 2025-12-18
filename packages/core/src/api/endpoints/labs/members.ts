import type { ApiClient } from '../../ApiClient';
import type { LabMember } from '../../../types/labs';
import { validateArrayResponse } from '../../responseValidation';

export async function getLabMembers(client: ApiClient, labId: string): Promise<LabMember[]> {
  const res = await client.request<LabMember[]>({
    method: 'GET',
    path: '/get-lab-members',
    query: { lab_id: labId },
  });
  return validateArrayResponse<LabMember>(res, 'getLabMembers');
}

