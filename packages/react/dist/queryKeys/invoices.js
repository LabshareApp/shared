"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceKeys = void 0;
exports.invoiceKeys = {
    root: ['invoices'],
    list: (params) => {
        var _a, _b, _c, _d, _e, _f;
        return [
            ...exports.invoiceKeys.root,
            'list',
            (_a = params.labId) !== null && _a !== void 0 ? _a : null,
            (_b = params.status) !== null && _b !== void 0 ? _b : null,
            (_c = params.view) !== null && _c !== void 0 ? _c : null,
            (_d = params.startDate) !== null && _d !== void 0 ? _d : null,
            (_e = params.endDate) !== null && _e !== void 0 ? _e : null,
            (_f = params.page) !== null && _f !== void 0 ? _f : null,
        ];
    },
    item: (invoiceId) => [...exports.invoiceKeys.root, 'item', invoiceId],
    summary: (params) => {
        var _a, _b, _c;
        return [
            ...exports.invoiceKeys.root,
            'summary',
            (_a = params.labId) !== null && _a !== void 0 ? _a : null,
            (_b = params.startDate) !== null && _b !== void 0 ? _b : null,
            (_c = params.endDate) !== null && _c !== void 0 ? _c : null,
        ];
    },
    templates: (labId) => [...exports.invoiceKeys.root, 'templates', labId !== null && labId !== void 0 ? labId : null],
    template: (templateId) => [...exports.invoiceKeys.root, 'template', templateId],
};
//# sourceMappingURL=invoices.js.map