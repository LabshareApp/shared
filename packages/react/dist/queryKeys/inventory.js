"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryKeys = void 0;
const shared_core_1 = require("@labshare/shared-core");
// Keep keys backwards-compatible with the existing mobile app query keys so
// wiring shared-react hooks does not force screen changes or cross-module cache churn.
exports.inventoryKeys = {
    inventory: ['inventory'],
    tags: ['tags'],
    customGroups: ['customGroups'],
    tagsAll: () => ['tags', 'all'],
    tagsByCategory: (category, labId) => ['tags', 'category', category, labId !== null && labId !== void 0 ? labId : null],
    customGroupsAll: (labId) => ['customGroups', 'all', labId !== null && labId !== void 0 ? labId : null],
    customGroupDetail: (groupId) => ['customGroups', 'detail', groupId],
    inventoryItem: (itemId) => ['inventoryItem', itemId],
    // Matches the existing `useInventorySearch` queryKey shape:
    // ['inventory', appliedGroupId, stableStringify(activeFilters), sortBy, sortDirection, limit]
    search: (params) => {
        var _a, _b, _c, _d, _e;
        return [
            'inventory',
            (_a = params.appliedGroupId) !== null && _a !== void 0 ? _a : null,
            (0, shared_core_1.stableStringify)((_b = params.activeFiltersKey) !== null && _b !== void 0 ? _b : null),
            (_c = params.sortBy) !== null && _c !== void 0 ? _c : null,
            (_d = params.sortDirection) !== null && _d !== void 0 ? _d : null,
            (_e = params.limit) !== null && _e !== void 0 ? _e : null,
        ];
    },
};
//# sourceMappingURL=inventory.js.map