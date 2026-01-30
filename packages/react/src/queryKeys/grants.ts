export const grantsRoot = () => ['grants'] as const;

export const grantsList = (labId: string | null | undefined, status?: string | null) =>
  [...grantsRoot(), 'list', labId ?? null, status ?? null] as const;

export const grantItem = (grantId: string | null | undefined) =>
  [...grantsRoot(), 'item', grantId ?? null] as const;

export const grantTransactions = (params: {
  grantId: string | null | undefined;
  type?: string | null;
  page?: number | null;
  limit?: number | null;
}) =>
  [
    ...grantsRoot(),
    'transactions',
    params.grantId ?? null,
    params.type ?? null,
    params.page ?? null,
    params.limit ?? null,
  ] as const;

export const odcCategories = () => [...grantsRoot(), 'odc-categories'] as const;




