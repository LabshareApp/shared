/**
 * Invoice Types
 *
 * These types define the invoice and billing model for Labshare.
 * Terminology:
 * - Grantor: Lab that owns the equipment (billing FROM)
 * - Grantee: Lab being charged (billing TO)
 */
/**
 * Invoice status values
 */
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
/**
 * Type of invoice line item reference
 */
export type InvoiceLineItemReferenceType = 'reservation' | 'tool_checkout' | 'consumable' | 'custom';
/**
 * A single line item on an invoice
 */
export interface InvoiceLineItem {
    id: string;
    description: string;
    referenceType: InvoiceLineItemReferenceType;
    referenceId?: string;
    equipmentName?: string;
    equipmentId?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
    usageStart?: string;
    usageEnd?: string;
}
/**
 * An invoice document for billing equipment usage
 */
export interface Invoice {
    _id: string;
    invoiceNumber: string;
    granteeLabId: string;
    granteeLabName: string;
    grantorLabId: string;
    grantorLabName: string;
    periodStart: string;
    periodEnd: string;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    tax?: number;
    total: number;
    currency: string;
    status: InvoiceStatus;
    sentAt?: string;
    paidAt?: string;
    fundCode?: string;
    projectCode?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}
/**
 * Default rate for a piece of equipment
 */
export interface InvoiceTemplateRate {
    equipmentId: string;
    equipmentName: string;
    ratePerHour?: number;
    ratePerDay?: number;
}
/**
 * Template for invoice generation with default rates and settings
 */
export interface InvoiceTemplate {
    _id: string;
    labId: string;
    name: string;
    defaultRates: InvoiceTemplateRate[];
    defaultNotes?: string;
    defaultPaymentTerms?: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Monthly invoice summary for reporting
 */
export interface InvoiceSummary {
    month: string;
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
    invoiceCount: number;
    paidCount: number;
    overdueCount: number;
}
/**
 * Options for listing invoices
 */
export interface ListInvoicesParams {
    status?: InvoiceStatus;
    view?: 'outgoing' | 'incoming';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
/**
 * Response from listing invoices
 */
export interface InvoiceListResponse {
    invoices: Invoice[];
    totalCount: number;
    page: number;
    limit: number;
}
/**
 * Request to create an invoice
 */
export interface CreateInvoiceRequest {
    granteeLabId: string;
    granteeLabName: string;
    grantorLabName?: string;
    periodStart: string;
    periodEnd: string;
    lineItems: InvoiceLineItem[];
    tax?: number;
    currency?: string;
    fundCode?: string;
    projectCode?: string;
    notes?: string;
}
/**
 * Request to update an invoice
 */
export interface UpdateInvoiceRequest {
    invoiceId: string;
    granteeLabName?: string;
    grantorLabName?: string;
    periodStart?: string;
    periodEnd?: string;
    lineItems?: InvoiceLineItem[];
    tax?: number;
    fundCode?: string;
    projectCode?: string;
    notes?: string;
}
/**
 * Request to generate an invoice from usage
 */
export interface GenerateInvoiceRequest {
    granteeLabId: string;
    granteeLabName: string;
    periodStart: string;
    periodEnd: string;
    templateId?: string;
}
/**
 * Request for invoice status actions (send, mark paid)
 */
export interface InvoiceActionRequest {
    invoiceId: string;
}
/**
 * Response from previewing an invoice
 */
export interface InvoicePreviewResponse {
    lineItems: InvoiceLineItem[];
    subtotal: number;
    currency: string;
}
/**
 * Export response with download URL (Excel)
 */
export interface InvoiceExportResponse {
    url: string;
    filename: string;
    expires: string;
    itemCount: number;
}
/**
 * PDF generation response with download URL
 */
export interface InvoicePDFResponse {
    url: string;
    filename: string;
    expires: string;
}
/**
 * Request to create an invoice template
 */
export interface CreateInvoiceTemplateRequest {
    name: string;
    defaultRates?: InvoiceTemplateRate[];
    defaultNotes?: string;
    defaultPaymentTerms?: string;
}
/**
 * Request to update an invoice template
 */
export interface UpdateInvoiceTemplateRequest {
    templateId: string;
    name?: string;
    defaultRates?: InvoiceTemplateRate[];
    defaultNotes?: string;
    defaultPaymentTerms?: string;
}
//# sourceMappingURL=invoice.d.ts.map