"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantTransactions = exports.grantItem = exports.grantsList = exports.grantsRoot = void 0;
const grantsRoot = () => ['grants'];
exports.grantsRoot = grantsRoot;
const grantsList = (labId, status) => [...(0, exports.grantsRoot)(), 'list', labId !== null && labId !== void 0 ? labId : null, status !== null && status !== void 0 ? status : null];
exports.grantsList = grantsList;
const grantItem = (grantId) => [...(0, exports.grantsRoot)(), 'item', grantId !== null && grantId !== void 0 ? grantId : null];
exports.grantItem = grantItem;
const grantTransactions = (params) => {
    var _a, _b, _c, _d;
    return [
        ...(0, exports.grantsRoot)(),
        'transactions',
        (_a = params.grantId) !== null && _a !== void 0 ? _a : null,
        (_b = params.type) !== null && _b !== void 0 ? _b : null,
        (_c = params.page) !== null && _c !== void 0 ? _c : null,
        (_d = params.limit) !== null && _d !== void 0 ? _d : null,
    ];
};
exports.grantTransactions = grantTransactions;
//# sourceMappingURL=grants.js.map