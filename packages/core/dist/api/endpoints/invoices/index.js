"use strict";
/**
 * Invoice API Endpoints
 *
 * Provides API client functions for invoice management operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchInvoices = fetchInvoices;
exports.getInvoice = getInvoice;
exports.createInvoice = createInvoice;
exports.updateInvoice = updateInvoice;
exports.deleteInvoice = deleteInvoice;
exports.sendInvoice = sendInvoice;
exports.markInvoicePaid = markInvoicePaid;
exports.generateInvoice = generateInvoice;
exports.previewInvoice = previewInvoice;
exports.getInvoiceSummary = getInvoiceSummary;
exports.exportInvoices = exportInvoices;
exports.generateInvoicePDF = generateInvoicePDF;
exports.listInvoiceTemplates = listInvoiceTemplates;
exports.getInvoiceTemplate = getInvoiceTemplate;
exports.createInvoiceTemplate = createInvoiceTemplate;
exports.updateInvoiceTemplate = updateInvoiceTemplate;
exports.deleteInvoiceTemplate = deleteInvoiceTemplate;
const responseValidation_1 = require("../../responseValidation");
// ============================================================================
// Invoice CRUD
// ============================================================================
/**
 * List invoices with optional filters
 */
async function fetchInvoices(client, params = {}) {
    const query = {};
    if (params.status)
        query.status = params.status;
    if (params.view)
        query.view = params.view;
    if (params.startDate)
        query.startDate = params.startDate;
    if (params.endDate)
        query.endDate = params.endDate;
    if (params.page)
        query.page = String(params.page);
    if (params.limit)
        query.limit = String(params.limit);
    const response = await client.request({
        method: 'GET',
        path: '/invoices',
        query,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'fetchInvoices', ['invoices', 'totalCount']);
}
/**
 * Get a single invoice by ID
 */
async function getInvoice(client, invoiceId) {
    if (!invoiceId) {
        throw new Error('Invoice ID is required');
    }
    const response = await client.request({
        method: 'GET',
        path: '/invoices/get',
        query: { id: invoiceId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getInvoice', ['_id', 'invoiceNumber']);
}
/**
 * Create a new invoice
 */
async function createInvoice(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/invoices/create',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createInvoice', ['_id', 'invoiceNumber']);
}
/**
 * Update an existing invoice (draft only)
 */
async function updateInvoice(client, payload) {
    if (!payload.invoiceId) {
        throw new Error('Invoice ID is required');
    }
    const response = await client.request({
        method: 'PUT',
        path: '/invoices/update',
        query: { id: payload.invoiceId },
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'updateInvoice', ['_id', 'invoiceNumber']);
}
/**
 * Delete a draft invoice
 */
async function deleteInvoice(client, invoiceId) {
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
async function sendInvoice(client, invoiceId) {
    if (!invoiceId) {
        throw new Error('Invoice ID is required');
    }
    const payload = { invoiceId };
    const response = await client.request({
        method: 'POST',
        path: '/invoices/send',
        query: { id: invoiceId },
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'sendInvoice', ['_id', 'invoiceNumber']);
}
/**
 * Mark an invoice as paid
 */
async function markInvoicePaid(client, invoiceId) {
    if (!invoiceId) {
        throw new Error('Invoice ID is required');
    }
    const payload = { invoiceId };
    const response = await client.request({
        method: 'POST',
        path: '/invoices/paid',
        query: { id: invoiceId },
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'markInvoicePaid', ['_id', 'invoiceNumber']);
}
// ============================================================================
// Invoice Generation
// ============================================================================
/**
 * Generate an invoice from usage data
 */
async function generateInvoice(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/invoices/generate',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'generateInvoice', ['_id', 'invoiceNumber']);
}
/**
 * Preview invoice line items before creating
 */
async function previewInvoice(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/invoices/preview',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'previewInvoice', ['lineItems', 'subtotal']);
}
// ============================================================================
// Invoice Reports
// ============================================================================
/**
 * Get invoice summary for a date range
 */
async function getInvoiceSummary(client, params = {}) {
    const query = {};
    if (params.startDate)
        query.startDate = params.startDate;
    if (params.endDate)
        query.endDate = params.endDate;
    const response = await client.request({
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
async function exportInvoices(client, params = {}) {
    const query = {};
    if (params.status)
        query.status = params.status;
    if (params.startDate)
        query.startDate = params.startDate;
    if (params.endDate)
        query.endDate = params.endDate;
    const response = await client.request({
        method: 'GET',
        path: '/invoices/export',
        query,
    });
    return response;
}
/**
 * Generate a PDF for a single invoice
 */
async function generateInvoicePDF(client, invoiceId) {
    if (!invoiceId) {
        throw new Error('Invoice ID is required');
    }
    const response = await client.request({
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
async function listInvoiceTemplates(client) {
    const response = await client.request({
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
async function getInvoiceTemplate(client, templateId) {
    if (!templateId) {
        throw new Error('Template ID is required');
    }
    const response = await client.request({
        method: 'GET',
        path: '/invoice-templates',
        query: { id: templateId },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getInvoiceTemplate', ['_id', 'name']);
}
/**
 * Create an invoice template
 */
async function createInvoiceTemplate(client, payload) {
    const response = await client.request({
        method: 'POST',
        path: '/invoice-templates/create',
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createInvoiceTemplate', ['_id', 'name']);
}
/**
 * Update an invoice template
 */
async function updateInvoiceTemplate(client, payload) {
    if (!payload.templateId) {
        throw new Error('Template ID is required');
    }
    const response = await client.request({
        method: 'PUT',
        path: '/invoice-templates/update',
        query: { id: payload.templateId },
        body: payload,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'updateInvoiceTemplate', ['_id', 'name']);
}
/**
 * Delete an invoice template
 */
async function deleteInvoiceTemplate(client, templateId) {
    if (!templateId) {
        throw new Error('Template ID is required');
    }
    await client.request({
        method: 'DELETE',
        path: '/invoice-templates/delete',
        query: { id: templateId },
    });
}
//# sourceMappingURL=index.js.map