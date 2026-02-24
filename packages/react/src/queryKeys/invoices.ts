export const invoiceKeys = {
  root: ['invoices'] as const,

  list: (params: {
    labId: string | null | undefined;
    status?: string | null;
    view?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    page?: number | null;
  }) =>
    [
      ...invoiceKeys.root,
      'list',
      params.labId ?? null,
      params.status ?? null,
      params.view ?? null,
      params.startDate ?? null,
      params.endDate ?? null,
      params.page ?? null,
    ] as const,

  item: (invoiceId: string | null) => [...invoiceKeys.root, 'item', invoiceId] as const,

  summary: (params: {
    labId: string | null | undefined;
    startDate?: string | null;
    endDate?: string | null;
  }) =>
    [
      ...invoiceKeys.root,
      'summary',
      params.labId ?? null,
      params.startDate ?? null,
      params.endDate ?? null,
    ] as const,

  templates: (labId: string | null | undefined) =>
    [...invoiceKeys.root, 'templates', labId ?? null] as const,

  template: (templateId: string | null) =>
    [...invoiceKeys.root, 'template', templateId] as const,
};
