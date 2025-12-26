import { stableStringify } from '@labshare/shared-core';

export const itemRequestKeys = {
  list: (params: any) => ['itemRequests', stableStringify(params)] as const,
};



