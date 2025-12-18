"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRequestKeys = void 0;
const shared_core_1 = require("@labshare/shared-core");
exports.itemRequestKeys = {
    list: (params) => ['itemRequests', (0, shared_core_1.stableStringify)(params)],
};
//# sourceMappingURL=itemRequests.js.map