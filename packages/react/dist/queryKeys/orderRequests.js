"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRequestKeys = void 0;
const shared_core_1 = require("@labshare/shared-core");
// Keep keys backwards-compatible with the existing mobile app query keys.
exports.orderRequestKeys = {
    root: ['orderRequest'],
    searchRoot: () => ['orderRequestSemanticSearch'],
    tags: ['orderRequestTags'],
    tagsAll: () => ['orderRequestTags', 'all'],
    tagsByCategory: (category, labId) => ['orderRequestTags', 'category', category, labId !== null && labId !== void 0 ? labId : null],
    listAll: (labId) => ['orderRequests', 'all', labId !== null && labId !== void 0 ? labId : null],
    orderRequestItem: (orderRequestId) => ['orderRequest', 'item', orderRequestId],
    archivedOrderRequest: (archivedOrderRequestId) => ['archivedOrderRequest', archivedOrderRequestId],
    // Matches the existing mobile key shape:
    // ['orderRequestSemanticSearch', currentLabId, stableStringify(activeFilters), sortBy, sortDirection, limit, view]
    search: (params) => {
        var _a, _b, _c, _d, _e, _f;
        return [
            'orderRequestSemanticSearch',
            (_a = params.labId) !== null && _a !== void 0 ? _a : null,
            (0, shared_core_1.stableStringify)((_b = params.activeFiltersKey) !== null && _b !== void 0 ? _b : null),
            (_c = params.sortBy) !== null && _c !== void 0 ? _c : null,
            (_d = params.sortDirection) !== null && _d !== void 0 ? _d : null,
            (_e = params.limit) !== null && _e !== void 0 ? _e : null,
            (_f = params.view) !== null && _f !== void 0 ? _f : null,
        ];
    },
};
//# sourceMappingURL=orderRequests.js.map