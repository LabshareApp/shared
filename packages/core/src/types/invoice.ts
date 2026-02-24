/**
 * Invoice Types
 *
 * These types define the invoice and billing model for Labshare.
 * Terminology:
 * - Grantor: Lab that owns the equipment (billing FROM)
 * - Grantee: Lab being charged (billing TO)
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Invoice status values
 */
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

/**
 * Type of invoice line item reference
 */
export type InvoiceLineItemReferenceType = 'reservation' | 'tool_checkout' | 'consumable' | 'custom';

// ============================================================================
// Line Item Types
// ============================================================================

/**
 * A single line item on an invoice
 */
export interface InvoiceLineItem {
  id: string;                              // UUID for line item
  description: string;

  // Reference to usage
  referenceType: InvoiceLineItemReferenceType;
  referenceId?: string;                    // ID of reservation/checkout

  // Equipment/Tool info
  equipmentName?: string;
  equipmentId?: string;

  // Usage details
  quantity: number;
  unit: string;                            // 'hours', 'days', 'units'
  unitPrice: number;                       // In cents
  total: number;                           // quantity * unitPrice (in cents)

  // Date range
  usageStart?: string;
  usageEnd?: string;
}

// ============================================================================
// Invoice Types
// ============================================================================

/**
 * An invoice document for billing equipment usage
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;                   // Auto-generated: INV-2024-001

  // Parties - using Grantor/Grantee terminology
  granteeLabId: string;                    // Lab being charged (billing TO)
  granteeLabName: string;
  grantorLabId: string;                    // Lab that owns equipment (billing FROM)
  grantorLabName: string;

  // Billing period
  periodStart: string;
  periodEnd: string;

  // Line items
  lineItems: InvoiceLineItem[];

  // Totals (in cents)
  subtotal: number;
  tax?: number;
  total: number;
  currency: string;                        // Default: 'USD'

  // Status
  status: InvoiceStatus;
  sentAt?: string;
  paidAt?: string;

  // Fund/Account (for tracking)
  fundCode?: string;
  projectCode?: string;

  // Notes
  notes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;                       // User ID
}

// ============================================================================
// Invoice Template Types
// ============================================================================

/**
 * Default rate for a piece of equipment
 */
export interface InvoiceTemplateRate {
  equipmentId: string;
  equipmentName: string;
  ratePerHour?: number;                    // In cents
  ratePerDay?: number;                     // In cents
}

/**
 * Template for invoice generation with default rates and settings
 */
export interface InvoiceTemplate {
  id: string;
  labId: string;
  name: string;

  // Default rates
  defaultRates: InvoiceTemplateRate[];

  // Default settings
  defaultNotes?: string;
  defaultPaymentTerms?: string;

  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Invoice Summary Types
// ============================================================================

/**
 * Monthly invoice summary for reporting
 */
export interface InvoiceSummary {
  month: string;
  totalInvoiced: number;                   // Total amount invoiced (cents)
  totalPaid: number;                       // Total amount paid (cents)
  totalOutstanding: number;                // Total outstanding (cents)
  invoiceCount: number;                    // Number of invoices
  paidCount: number;                       // Number of paid invoices
  overdueCount: number;                    // Number of overdue invoices
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Options for listing invoices
 */
export interface ListInvoicesParams {
  status?: InvoiceStatus;
  view?: 'outgoing' | 'incoming';          // outgoing = grantor, incoming = grantee
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
  grantorLabName?: string;                 // Optional, can be derived
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

// ============================================================================
// Template Request Types
// ============================================================================

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
