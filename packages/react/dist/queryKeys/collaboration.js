"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaborationKeys = void 0;
exports.collaborationKeys = {
    collaborators: () => ['collaborators'],
    availableLabs: () => ['availableLabs'],
    collaboratorLabs: () => ['collaboratorLabs'],
    collaboratorInventorySearch: (params) => {
        var _a, _b, _c, _d, _e, _f;
        return [
            'collaboratorInventorySearch',
            (_a = params.labId) !== null && _a !== void 0 ? _a : null,
            (_b = params.searchText) !== null && _b !== void 0 ? _b : '',
            ((_c = params.selectedLabIds) !== null && _c !== void 0 ? _c : []).join(','),
            (_d = params.sortBy) !== null && _d !== void 0 ? _d : null,
            (_e = params.sortDirection) !== null && _e !== void 0 ? _e : null,
            (_f = params.limit) !== null && _f !== void 0 ? _f : null,
        ];
    },
    collaboratorInventorySemanticSearch: (params) => {
        var _a, _b, _c, _d, _e, _f;
        return [
            'collaboratorInventorySemanticSearch',
            (_a = params.labId) !== null && _a !== void 0 ? _a : null,
            (_b = params.searchText) !== null && _b !== void 0 ? _b : '',
            ((_c = params.selectedLabIds) !== null && _c !== void 0 ? _c : []).join(','),
            (_d = params.sortBy) !== null && _d !== void 0 ? _d : null,
            (_e = params.sortDirection) !== null && _e !== void 0 ? _e : null,
            (_f = params.limit) !== null && _f !== void 0 ? _f : null,
        ];
    },
};
//# sourceMappingURL=collaboration.js.map