import type { ApiClient, Invoice, InvoiceListResponse, InvoiceSummary, InvoiceTemplate, InvoicePreviewResponse, InvoicePDFResponse, InvoiceExportResponse, ListInvoicesParams, CreateInvoiceRequest, UpdateInvoiceRequest, GenerateInvoiceRequest, CreateInvoiceTemplateRequest, UpdateInvoiceTemplateRequest } from '@labshare/shared-core';
export declare function useInvoicesList(client: ApiClient, params: {
    labId: string | null | undefined;
    listParams?: ListInvoicesParams;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InvoiceListResponse, Error>;
export declare function useInvoiceItem(client: ApiClient, params: {
    invoiceId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Invoice, Error>;
export declare function useInvoiceSummary(client: ApiClient, params: {
    labId: string | null | undefined;
    startDate?: string;
    endDate?: string;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InvoiceSummary[], Error>;
export declare function useInvoiceTemplates(client: ApiClient, params: {
    labId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InvoiceTemplate[], Error>;
export declare function useInvoiceTemplate(client: ApiClient, params: {
    templateId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<InvoiceTemplate, Error>;
export declare function useInvoiceMutations(client: ApiClient): {
    createInvoiceMutation: import("@tanstack/react-query").UseMutationResult<Invoice, Error, CreateInvoiceRequest, unknown>;
    updateInvoiceMutation: import("@tanstack/react-query").UseMutationResult<Invoice, Error, UpdateInvoiceRequest, unknown>;
    deleteInvoiceMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    sendInvoiceMutation: import("@tanstack/react-query").UseMutationResult<Invoice, Error, string, unknown>;
    markPaidMutation: import("@tanstack/react-query").UseMutationResult<Invoice, Error, string, unknown>;
    generateInvoiceMutation: import("@tanstack/react-query").UseMutationResult<Invoice, Error, GenerateInvoiceRequest, unknown>;
    previewInvoiceMutation: import("@tanstack/react-query").UseMutationResult<InvoicePreviewResponse, Error, GenerateInvoiceRequest, unknown>;
    exportInvoicesMutation: import("@tanstack/react-query").UseMutationResult<InvoiceExportResponse, Error, {
        status?: string;
        startDate?: string;
        endDate?: string;
    }, unknown>;
    generatePDFMutation: import("@tanstack/react-query").UseMutationResult<InvoicePDFResponse, Error, string, unknown>;
    createTemplateMutation: import("@tanstack/react-query").UseMutationResult<InvoiceTemplate, Error, CreateInvoiceTemplateRequest, unknown>;
    updateTemplateMutation: import("@tanstack/react-query").UseMutationResult<InvoiceTemplate, Error, UpdateInvoiceTemplateRequest, unknown>;
    deleteTemplateMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
};
//# sourceMappingURL=invoices.d.ts.map