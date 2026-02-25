import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApiClient,
  Invoice,
  InvoiceListResponse,
  InvoiceSummary,
  InvoiceTemplate,
  InvoicePreviewResponse,
  InvoicePDFResponse,
  InvoiceExportResponse,
  ListInvoicesParams,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  GenerateInvoiceRequest,
  CreateInvoiceTemplateRequest,
  UpdateInvoiceTemplateRequest,
} from '@labshare/shared-core';
import {
  fetchInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
  markInvoicePaid,
  generateInvoice,
  previewInvoice,
  getInvoiceSummary,
  exportInvoices,
  generateInvoicePDF,
  listInvoiceTemplates,
  getInvoiceTemplate,
  createInvoiceTemplate,
  updateInvoiceTemplate,
  deleteInvoiceTemplate,
} from '@labshare/shared-core';

import { invoiceKeys } from '../queryKeys/invoices';

// ============================================================================
// Queries
// ============================================================================

export function useInvoicesList(
  client: ApiClient,
  params: {
    labId: string | null | undefined;
    listParams?: ListInvoicesParams;
    enabled?: boolean;
  }
) {
  return useQuery<InvoiceListResponse, Error>({
    queryKey: invoiceKeys.list({
      labId: params.labId,
      status: params.listParams?.status,
      view: params.listParams?.view,
      startDate: params.listParams?.startDate,
      endDate: params.listParams?.endDate,
      page: params.listParams?.page,
    }),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return fetchInvoices(client, params.listParams);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 30 * 1000,
  });
}

export function useInvoiceItem(
  client: ApiClient,
  params: { invoiceId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.invoiceId ? String(params.invoiceId) : null;
  return useQuery<Invoice, Error>({
    queryKey: invoiceKeys.item(normalizedId),
    queryFn: async () => {
      if (!normalizedId) throw new Error('invoiceId required');
      return getInvoice(client, normalizedId);
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 30 * 1000,
  });
}

export function useInvoiceSummary(
  client: ApiClient,
  params: {
    labId: string | null | undefined;
    startDate?: string;
    endDate?: string;
    enabled?: boolean;
  }
) {
  return useQuery<InvoiceSummary[], Error>({
    queryKey: invoiceKeys.summary({
      labId: params.labId,
      startDate: params.startDate,
      endDate: params.endDate,
    }),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return getInvoiceSummary(client, {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 60 * 1000,
  });
}

export function useInvoiceTemplates(
  client: ApiClient,
  params: { labId: string | null | undefined; enabled?: boolean }
) {
  return useQuery<InvoiceTemplate[], Error>({
    queryKey: invoiceKeys.templates(params.labId),
    queryFn: async () => {
      if (!params.labId) throw new Error('labId required');
      return listInvoiceTemplates(client);
    },
    enabled: params.enabled ?? !!params.labId,
    staleTime: 60 * 1000,
  });
}

export function useInvoiceTemplate(
  client: ApiClient,
  params: { templateId: string | null | undefined; enabled?: boolean }
) {
  const normalizedId = params.templateId ? String(params.templateId) : null;
  return useQuery<InvoiceTemplate, Error>({
    queryKey: invoiceKeys.template(normalizedId),
    queryFn: async () => {
      if (!normalizedId) throw new Error('templateId required');
      return getInvoiceTemplate(client, normalizedId);
    },
    enabled: params.enabled ?? !!normalizedId,
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useInvoiceMutations(client: ApiClient) {
  const queryClient = useQueryClient();

  const invalidateInvoices = () => {
    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === 'invoices',
    });
  };

  const createInvoiceMutation = useMutation({
    mutationFn: (data: CreateInvoiceRequest) => createInvoice(client, data),
    onSuccess: invalidateInvoices,
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: (data: UpdateInvoiceRequest) => updateInvoice(client, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.item(variables.invoiceId) });
      invalidateInvoices();
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (invoiceId: string) => deleteInvoice(client, invoiceId),
    onSuccess: invalidateInvoices,
  });

  const sendInvoiceMutation = useMutation({
    mutationFn: (invoiceId: string) => sendInvoice(client, invoiceId),
    onSuccess: (_data, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.item(invoiceId) });
      invalidateInvoices();
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: (invoiceId: string) => markInvoicePaid(client, invoiceId),
    onSuccess: (_data, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.item(invoiceId) });
      invalidateInvoices();
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: (data: GenerateInvoiceRequest) => generateInvoice(client, data),
    onSuccess: invalidateInvoices,
  });

  const previewInvoiceMutation = useMutation<InvoicePreviewResponse, Error, GenerateInvoiceRequest>({
    mutationFn: (data: GenerateInvoiceRequest) => previewInvoice(client, data),
  });

  const exportInvoicesMutation = useMutation<InvoiceExportResponse, Error, { status?: string; startDate?: string; endDate?: string }>({
    mutationFn: (params) => exportInvoices(client, params),
  });

  const generatePDFMutation = useMutation<InvoicePDFResponse, Error, string>({
    mutationFn: (invoiceId: string) => generateInvoicePDF(client, invoiceId),
  });

  // Template mutations
  const createTemplateMutation = useMutation({
    mutationFn: (data: CreateInvoiceTemplateRequest) => createInvoiceTemplate(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'invoices' && q.queryKey[1] === 'templates',
      });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: (data: UpdateInvoiceTemplateRequest) => updateInvoiceTemplate(client, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.template(variables.templateId) });
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'invoices' && q.queryKey[1] === 'templates',
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId: string) => deleteInvoiceTemplate(client, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'invoices' && q.queryKey[1] === 'templates',
      });
    },
  });

  return {
    createInvoiceMutation,
    updateInvoiceMutation,
    deleteInvoiceMutation,
    sendInvoiceMutation,
    markPaidMutation,
    generateInvoiceMutation,
    previewInvoiceMutation,
    exportInvoicesMutation,
    generatePDFMutation,
    createTemplateMutation,
    updateTemplateMutation,
    deleteTemplateMutation,
  };
}
