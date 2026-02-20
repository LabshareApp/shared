/**
 * Invoice API Endpoints
 *
 * Provides API client functions for invoice management operations.
 */
import type { ApiClient } from '../../ApiClient';
import type { Invoice, InvoiceTemplate, InvoiceListResponse, InvoiceSummary, InvoicePreviewResponse, InvoiceExportResponse, InvoicePDFResponse, ListInvoicesParams, CreateInvoiceRequest, UpdateInvoiceRequest, GenerateInvoiceRequest, CreateInvoiceTemplateRequest, UpdateInvoiceTemplateRequest } from '../../../types/invoice';
/**
 * List invoices with optional filters
 */
export declare function fetchInvoices(client: ApiClient, params?: ListInvoicesParams): Promise<InvoiceListResponse>;
/**
 * Get a single invoice by ID
 */
export declare function getInvoice(client: ApiClient, invoiceId: string): Promise<Invoice>;
/**
 * Create a new invoice
 */
export declare function createInvoice(client: ApiClient, payload: CreateInvoiceRequest): Promise<Invoice>;
/**
 * Update an existing invoice (draft only)
 */
export declare function updateInvoice(client: ApiClient, payload: UpdateInvoiceRequest): Promise<Invoice>;
/**
 * Delete a draft invoice
 */
export declare function deleteInvoice(client: ApiClient, invoiceId: string): Promise<void>;
/**
 * Mark an invoice as sent
 */
export declare function sendInvoice(client: ApiClient, invoiceId: string): Promise<Invoice>;
/**
 * Mark an invoice as paid
 */
export declare function markInvoicePaid(client: ApiClient, invoiceId: string): Promise<Invoice>;
/**
 * Generate an invoice from usage data
 */
export declare function generateInvoice(client: ApiClient, payload: GenerateInvoiceRequest): Promise<Invoice>;
/**
 * Preview invoice line items before creating
 */
export declare function previewInvoice(client: ApiClient, payload: GenerateInvoiceRequest): Promise<InvoicePreviewResponse>;
/**
 * Get invoice summary for a date range
 */
export declare function getInvoiceSummary(client: ApiClient, params?: {
    startDate?: string;
    endDate?: string;
}): Promise<InvoiceSummary[]>;
/**
 * Export invoices to Excel
 */
export declare function exportInvoices(client: ApiClient, params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
}): Promise<InvoiceExportResponse>;
/**
 * Generate a PDF for a single invoice
 */
export declare function generateInvoicePDF(client: ApiClient, invoiceId: string): Promise<InvoicePDFResponse>;
/**
 * List all invoice templates
 */
export declare function listInvoiceTemplates(client: ApiClient): Promise<InvoiceTemplate[]>;
/**
 * Get a single invoice template
 */
export declare function getInvoiceTemplate(client: ApiClient, templateId: string): Promise<InvoiceTemplate>;
/**
 * Create an invoice template
 */
export declare function createInvoiceTemplate(client: ApiClient, payload: CreateInvoiceTemplateRequest): Promise<InvoiceTemplate>;
/**
 * Update an invoice template
 */
export declare function updateInvoiceTemplate(client: ApiClient, payload: UpdateInvoiceTemplateRequest): Promise<InvoiceTemplate>;
/**
 * Delete an invoice template
 */
export declare function deleteInvoiceTemplate(client: ApiClient, templateId: string): Promise<void>;
//# sourceMappingURL=index.d.ts.map