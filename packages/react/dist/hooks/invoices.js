"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvoicesList = useInvoicesList;
exports.useInvoiceItem = useInvoiceItem;
exports.useInvoiceSummary = useInvoiceSummary;
exports.useInvoiceTemplates = useInvoiceTemplates;
exports.useInvoiceTemplate = useInvoiceTemplate;
exports.useInvoiceMutations = useInvoiceMutations;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const invoices_1 = require("../queryKeys/invoices");
// ============================================================================
// Queries
// ============================================================================
function useInvoicesList(client, params) {
    var _a, _b, _c, _d, _e, _f;
    return (0, react_query_1.useQuery)({
        queryKey: invoices_1.invoiceKeys.list({
            labId: params.labId,
            status: (_a = params.listParams) === null || _a === void 0 ? void 0 : _a.status,
            view: (_b = params.listParams) === null || _b === void 0 ? void 0 : _b.view,
            startDate: (_c = params.listParams) === null || _c === void 0 ? void 0 : _c.startDate,
            endDate: (_d = params.listParams) === null || _d === void 0 ? void 0 : _d.endDate,
            page: (_e = params.listParams) === null || _e === void 0 ? void 0 : _e.page,
        }),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.fetchInvoices)(client, params.listParams);
        },
        enabled: (_f = params.enabled) !== null && _f !== void 0 ? _f : !!params.labId,
        staleTime: 30 * 1000,
    });
}
function useInvoiceItem(client, params) {
    var _a;
    const normalizedId = params.invoiceId ? String(params.invoiceId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: invoices_1.invoiceKeys.item(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                throw new Error('invoiceId required');
            return (0, shared_core_1.getInvoice)(client, normalizedId);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 30 * 1000,
    });
}
function useInvoiceSummary(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: invoices_1.invoiceKeys.summary({
            labId: params.labId,
            startDate: params.startDate,
            endDate: params.endDate,
        }),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.getInvoiceSummary)(client, {
                startDate: params.startDate,
                endDate: params.endDate,
            });
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.labId,
        staleTime: 60 * 1000,
    });
}
function useInvoiceTemplates(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: invoices_1.invoiceKeys.templates(params.labId),
        queryFn: async () => {
            if (!params.labId)
                throw new Error('labId required');
            return (0, shared_core_1.listInvoiceTemplates)(client);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.labId,
        staleTime: 60 * 1000,
    });
}
function useInvoiceTemplate(client, params) {
    var _a;
    const normalizedId = params.templateId ? String(params.templateId) : null;
    return (0, react_query_1.useQuery)({
        queryKey: invoices_1.invoiceKeys.template(normalizedId),
        queryFn: async () => {
            if (!normalizedId)
                throw new Error('templateId required');
            return (0, shared_core_1.getInvoiceTemplate)(client, normalizedId);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!normalizedId,
        staleTime: 60 * 1000,
    });
}
// ============================================================================
// Mutations
// ============================================================================
function useInvoiceMutations(client) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const invalidateInvoices = () => {
        queryClient.invalidateQueries({
            predicate: (q) => q.queryKey[0] === 'invoices',
        });
    };
    const createInvoiceMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createInvoice)(client, data),
        onSuccess: invalidateInvoices,
    });
    const updateInvoiceMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.updateInvoice)(client, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: invoices_1.invoiceKeys.item(variables.invoiceId) });
            invalidateInvoices();
        },
    });
    const deleteInvoiceMutation = (0, react_query_1.useMutation)({
        mutationFn: (invoiceId) => (0, shared_core_1.deleteInvoice)(client, invoiceId),
        onSuccess: invalidateInvoices,
    });
    const sendInvoiceMutation = (0, react_query_1.useMutation)({
        mutationFn: (invoiceId) => (0, shared_core_1.sendInvoice)(client, invoiceId),
        onSuccess: (_data, invoiceId) => {
            queryClient.invalidateQueries({ queryKey: invoices_1.invoiceKeys.item(invoiceId) });
            invalidateInvoices();
        },
    });
    const markPaidMutation = (0, react_query_1.useMutation)({
        mutationFn: (invoiceId) => (0, shared_core_1.markInvoicePaid)(client, invoiceId),
        onSuccess: (_data, invoiceId) => {
            queryClient.invalidateQueries({ queryKey: invoices_1.invoiceKeys.item(invoiceId) });
            invalidateInvoices();
        },
    });
    const generateInvoiceMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.generateInvoice)(client, data),
        onSuccess: invalidateInvoices,
    });
    const previewInvoiceMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.previewInvoice)(client, data),
    });
    const exportInvoicesMutation = (0, react_query_1.useMutation)({
        mutationFn: (params) => (0, shared_core_1.exportInvoices)(client, params),
    });
    const generatePDFMutation = (0, react_query_1.useMutation)({
        mutationFn: (invoiceId) => (0, shared_core_1.generateInvoicePDF)(client, invoiceId),
    });
    // Template mutations
    const createTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.createInvoiceTemplate)(client, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (q) => q.queryKey[0] === 'invoices' && q.queryKey[1] === 'templates',
            });
        },
    });
    const updateTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, shared_core_1.updateInvoiceTemplate)(client, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: invoices_1.invoiceKeys.template(variables.templateId) });
            queryClient.invalidateQueries({
                predicate: (q) => q.queryKey[0] === 'invoices' && q.queryKey[1] === 'templates',
            });
        },
    });
    const deleteTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: (templateId) => (0, shared_core_1.deleteInvoiceTemplate)(client, templateId),
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
//# sourceMappingURL=invoices.js.map