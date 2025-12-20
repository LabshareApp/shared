import { useQuery } from '@tanstack/react-query';
import type { ApiClient, LabMember } from '@labshare/shared-core';
import { getLabMembers } from '@labshare/shared-core';
import { labKeys } from '../queryKeys/labs';

export function useLabMembers(client: ApiClient, params: { labId: string | null | undefined; enabled?: boolean }) {
  return useQuery<LabMember[], Error>({
    queryKey: labKeys.members(params.labId),
    queryFn: () => getLabMembers(client, params.labId!),
    enabled: (params.enabled ?? true) && !!params.labId,
    staleTime: 60_000,
  });
}


