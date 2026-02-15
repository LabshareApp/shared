"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.institutionInventory = exports.institutionOrderRequests = exports.institutionCollaborationHistory = exports.institutionRoot = void 0;
const institutionRoot = () => ['institution'];
exports.institutionRoot = institutionRoot;
const institutionCollaborationHistory = (institutionId) => [...(0, exports.institutionRoot)(), 'collaboration-history', institutionId !== null && institutionId !== void 0 ? institutionId : null];
exports.institutionCollaborationHistory = institutionCollaborationHistory;
const institutionOrderRequests = (params) => {
    var _a, _b, _c, _d, _e;
    return [
        ...(0, exports.institutionRoot)(),
        'order-requests',
        (_a = params.institutionId) !== null && _a !== void 0 ? _a : null,
        (_b = params.view) !== null && _b !== void 0 ? _b : null,
        (_c = params.labIds) !== null && _c !== void 0 ? _c : null,
        (_d = params.query) !== null && _d !== void 0 ? _d : null,
        (_e = params.page) !== null && _e !== void 0 ? _e : null,
    ];
};
exports.institutionOrderRequests = institutionOrderRequests;
const institutionInventory = (params) => {
    var _a, _b, _c, _d;
    return [
        ...(0, exports.institutionRoot)(),
        'inventory',
        (_a = params.institutionId) !== null && _a !== void 0 ? _a : null,
        (_b = params.labIds) !== null && _b !== void 0 ? _b : null,
        (_c = params.query) !== null && _c !== void 0 ? _c : null,
        (_d = params.page) !== null && _d !== void 0 ? _d : null,
    ];
};
exports.institutionInventory = institutionInventory;
//# sourceMappingURL=institution.js.map