export const institutionRoot = () => ['institution'] as const;

export const institutionCollaborationHistory = (institutionId: string | null | undefined) =>
  [...institutionRoot(), 'collaboration-history', institutionId ?? null] as const;

export const institutionOrderRequests = (params: {
  institutionId: string | null | undefined;
  view?: 'current' | 'placed' | 'archived' | null;
  labIds?: string[] | null;
  query?: string | null;
  page?: number | null;
}) =>
  [
    ...institutionRoot(),
    'order-requests',
    params.institutionId ?? null,
    params.view ?? null,
    params.labIds ?? null,
    params.query ?? null,
    params.page ?? null,
  ] as const;

export const institutionInventory = (params: {
  institutionId: string | null | undefined;
  labIds?: string[] | null;
  query?: string | null;
  page?: number | null;
}) =>
  [
    ...institutionRoot(),
    'inventory',
    params.institutionId ?? null,
    params.labIds ?? null,
    params.query ?? null,
    params.page ?? null,
  ] as const;
