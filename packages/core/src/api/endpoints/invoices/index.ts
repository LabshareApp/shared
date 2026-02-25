/**
 * Invoice API Endpoints
 *
 * Provides API client functions for invoice management operations.
 */

import type { ApiClient } from '../../ApiClient';
import { validateObjectResponse } from '../../responseValidation';
import type {
  Invoice,
  InvoiceTemplate,
  InvoiceListResponse,
  InvoiceSummary,
  InvoicePreviewResponse,
  InvoiceExportResponse,
  InvoicePDFResponse,
  ListInvoicesParams,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  GenerateInvoiceRequest,
  InvoiceActionRequest,
  CreateInvoiceTemplateRequest,
  UpdateInvoiceTemplateRequest,
} from '../../../types/invoice';

// ============================================================================
// Invoice CRUD
// ============================================================================

/**
 * List invoices with optional filters
 */
export async function fetchInvoices(
  client: ApiClient,
  params: ListInvoicesParams = {}
): Promise<InvoiceListResponse> {
  const query: Record<string, string> = {};

  if (params.status) query.status = params.status;
  if (params.view) query.view = params.view;
  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;
  if (params.page) query.page = String(params.page);
  if (params.limit) query.limit = String(params.limit);

  const response = await client.request<InvoiceListResponse>({
    method: 'GET',
    path: '/invoices',
    query,
  });

  return validateObjectResponse(response, 'fetchInvoices', ['invoices', 'totalCount']) as InvoiceListResponse;
}

/**
 * Get a single invoice by ID
 */
export async function getInvoice(
  client: ApiClient,
  invoiceId: string
): Promise<Invoice> {
  if (!invoiceId) {
    throw new Error('Invoice ID is required');
  }

  const response = await client.request<Invoice>({
    method: 'GET',
    path: '/invoices/get',
    query: { id: invoiceId },
  });

  return validateObjectResponse(response, 'getInvoice', ['id', 'invoiceNumber']) as Invoice;
}

/**
 * Create a new invoice
 */
export async function createInvoice(
  client: ApiClient,
  payload: CreateInvoiceRequest
): Promise<Invoice> {
  const response = await client.request<Invoice>({
    method: 'POST',
    path: '/invoices/create',
    body: payload,
  });

  return validateObjectResponse(response, 'createInvoice', ['id', 'invoiceNumber']) as Invoice;
}

/**
 * Update an existing invoice (draft only)
 */
export async function updateInvoice(
  client: ApiClient,
  payload: UpdateInvoiceRequest
): Promise<Invoice> {
  if (!payload.invoiceId) {
    throw new Error('Invoice ID is required');
  }

  const response = await client.request<Invoice>({
    method: 'PUT',
    path: '/invoices/update',
    query: { id: payload.invoiceId },
    body: payload,
  });

  return validateObjectResponse(response, 'updateInvoice', ['id', 'invoiceNumber']) as Invoice;
}

/**
 * Delete a draft invoice
 */
export async function deleteInvoice(
  client: ApiClient,
  invoiceId: string
): Promise<void> {
  if (!invoiceId) {
    throw new Error('Invoice ID is required');
  }

  await client.request({
    method: 'DELETE',
    path: '/invoices/delete',
    query: { id: invoiceId },
  });
}

// ============================================================================
// Invoice Status Actions
// ============================================================================

/**
 * Mark an invoice as sent
 */
export async function sendInvoice(
  client: ApiClient,
  invoiceId: string
): Promise<Invoice> {
  if (!invoiceId) {
    throw new Error('Invoice ID is required');
  }

  const payload: InvoiceActionRequest = { invoiceId };

  const response = await client.request<Invoice>({
    method: 'POST',
    path: '/invoices/send',
    query: { id: invoiceId },
    body: payload,
  });

  return validateObjectResponse(response, 'sendInvoice', ['id', 'invoiceNumber']) as Invoice;
}

/**
 * Mark an invoice as paid
 */
export async function markInvoicePaid(
  client: ApiClient,
  invoiceId: string
): Promise<Invoice> {
  if (!invoiceId) {
    throw new Error('Invoice ID is required');
  }

  const payload: InvoiceActionRequest = { invoiceId };

  const response = await client.request<Invoice>({
    method: 'POST',
    path: '/invoices/paid',
    query: { id: invoiceId },
    body: payload,
  });

  return validateObjectResponse(response, 'markInvoicePaid', ['id', 'invoiceNumber']) as Invoice;
}

// ============================================================================
// Invoice Generation
// ============================================================================

/**
 * Generate an invoice from usage data
 */
export async function generateInvoice(
  client: ApiClient,
  payload: GenerateInvoiceRequest
): Promise<Invoice> {
  const response = await client.request<Invoice>({
    method: 'POST',
    path: '/invoices/generate',
    body: payload,
  });

  return validateObjectResponse(response, 'generateInvoice', ['id', 'invoiceNumber']) as Invoice;
}

/**
 * Preview invoice line items before creating
 */
export async function previewInvoice(
  client: ApiClient,
  payload: GenerateInvoiceRequest
): Promise<InvoicePreviewResponse> {
  const response = await client.request<InvoicePreviewResponse>({
    method: 'POST',
    path: '/invoices/preview',
    body: payload,
  });

  return validateObjectResponse(response, 'previewInvoice', ['lineItems', 'subtotal']) as InvoicePreviewResponse;
}

// ============================================================================
// Invoice Reports
// ============================================================================

/**
 * Get invoice summary for a date range
 */
export async function getInvoiceSummary(
  client: ApiClient,
  params: { startDate?: string; endDate?: string } = {}
): Promise<InvoiceSummary[]> {
  const query: Record<string, string> = {};

  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;

  const response = await client.request<InvoiceSummary[]>({
    method: 'GET',
    path: '/invoices/summary',
    query,
  });

  // Response is an array, validate it exists
  if (!Array.isArray(response)) {
    throw new Error('getInvoiceSummary: Expected array response');
  }

  return response;
}

/**
 * Export invoices to Excel
 */
export async function exportInvoices(
  client: ApiClient,
  params: { status?: string; startDate?: string; endDate?: string } = {}
): Promise<InvoiceExportResponse> {
  const query: Record<string, string> = {};

  if (params.status) query.status = params.status;
  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;

  const response = await client.request<InvoiceExportResponse>({
    method: 'GET',
    path: '/invoices/export',
    query,
  });

  return response;
}

/**
 * Generate a PDF for a single invoice
 */
export async function generateInvoicePDF(
  client: ApiClient,
  invoiceId: string
): Promise<InvoicePDFResponse> {
  if (!invoiceId) {
    throw new Error('Invoice ID is required');
  }

  const response = await client.request<InvoicePDFResponse>({
    method: 'GET',
    path: '/invoices/pdf',
    query: { id: invoiceId },
  });

  return response;
}

// ============================================================================
// Invoice Templates
// ============================================================================

/**
 * List all invoice templates
 */
export async function listInvoiceTemplates(
  client: ApiClient
): Promise<InvoiceTemplate[]> {
  const response = await client.request<InvoiceTemplate[]>({
    method: 'GET',
    path: '/invoice-templates',
  });

  if (!Array.isArray(response)) {
    throw new Error('listInvoiceTemplates: Expected array response');
  }

  return response;
}

/**
 * Get a single invoice template
 */
export async function getInvoiceTemplate(
  client: ApiClient,
  templateId: string
): Promise<InvoiceTemplate> {
  if (!templateId) {
    throw new Error('Template ID is required');
  }

  const response = await client.request<InvoiceTemplate>({
    method: 'GET',
    path: '/invoice-templates',
    query: { id: templateId },
  });

  return validateObjectResponse(response, 'getInvoiceTemplate', ['id', 'name']) as InvoiceTemplate;
}

/**
 * Create an invoice template
 */
export async function createInvoiceTemplate(
  client: ApiClient,
  payload: CreateInvoiceTemplateRequest
): Promise<InvoiceTemplate> {
  const response = await client.request<InvoiceTemplate>({
    method: 'POST',
    path: '/invoice-templates/create',
    body: payload,
  });

  return validateObjectResponse(response, 'createInvoiceTemplate', ['id', 'name']) as InvoiceTemplate;
}

/**
 * Update an invoice template
 */
export async function updateInvoiceTemplate(
  client: ApiClient,
  payload: UpdateInvoiceTemplateRequest
): Promise<InvoiceTemplate> {
  if (!payload.templateId) {
    throw new Error('Template ID is required');
  }

  const response = await client.request<InvoiceTemplate>({
    method: 'PUT',
    path: '/invoice-templates/update',
    query: { id: payload.templateId },
    body: payload,
  });

  return validateObjectResponse(response, 'updateInvoiceTemplate', ['id', 'name']) as InvoiceTemplate;
}

/**
 * Delete an invoice template
 */
export async function deleteInvoiceTemplate(
  client: ApiClient,
  templateId: string
): Promise<void> {
  if (!templateId) {
    throw new Error('Template ID is required');
  }

  await client.request({
    method: 'DELETE',
    path: '/invoice-templates/delete',
    query: { id: templateId },
  });
}
