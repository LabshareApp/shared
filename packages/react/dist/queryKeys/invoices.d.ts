export declare const invoiceKeys: {
    root: readonly ["invoices"];
    list: (params: {
        labId: string | null | undefined;
        status?: string | null;
        view?: string | null;
        startDate?: string | null;
        endDate?: string | null;
        page?: number | null;
    }) => readonly ["invoices", "list", string | null, string | null, string | null, string | null, string | null, number | null];
    item: (invoiceId: string | null) => readonly ["invoices", "item", string | null];
    summary: (params: {
        labId: string | null | undefined;
        startDate?: string | null;
        endDate?: string | null;
    }) => readonly ["invoices", "summary", string | null, string | null, string | null];
    templates: (labId: string | null | undefined) => readonly ["invoices", "templates", string | null];
    template: (templateId: string | null) => readonly ["invoices", "template", string | null];
};
//# sourceMappingURL=invoices.d.ts.map