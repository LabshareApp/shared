import type { ApiClient, LabMember } from '@labshare/shared-core';
export declare function useLabMembers(client: ApiClient, params: {
    labId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<LabMember[], Error>;
//# sourceMappingURL=labs.d.ts.map