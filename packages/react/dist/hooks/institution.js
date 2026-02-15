"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCollaborationHistory = useCollaborationHistory;
exports.useInstitutionOrderRequests = useInstitutionOrderRequests;
exports.useInstitutionInventorySearch = useInstitutionInventorySearch;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const institution_1 = require("../queryKeys/institution");
/**
 * Hook to fetch collaboration history with statistics (admin only)
 */
function useCollaborationHistory(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: (0, institution_1.institutionCollaborationHistory)(params.institutionId),
        queryFn: async () => {
            if (!params.institutionId)
                throw new Error('institutionId required');
            return (0, shared_core_1.getCollaborationHistory)(client, params.institutionId);
        },
        enabled: (_a = params.enabled) !== null && _a !== void 0 ? _a : !!params.institutionId,
        staleTime: 30000, // 30 seconds
    });
}
/**
 * Hook to search order requests across all institution labs (admin only)
 */
function useInstitutionOrderRequests(client, params) {
    var _a, _b, _c, _d;
    return (0, react_query_1.useQuery)({
        queryKey: (0, institution_1.institutionOrderRequests)({
            institutionId: params.institutionId,
            view: params.view,
            labIds: (_a = params.labIds) !== null && _a !== void 0 ? _a : null,
            query: (_b = params.query) !== null && _b !== void 0 ? _b : null,
            page: (_c = params.page) !== null && _c !== void 0 ? _c : null,
        }),
        queryFn: async () => {
            var _a, _b;
            if (!params.institutionId)
                throw new Error('institutionId required');
            return (0, shared_core_1.searchInstitutionOrderRequests)(client, params.institutionId, {
                view: params.view,
                labIds: params.labIds,
                query: params.query,
                page: (_a = params.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = params.limit) !== null && _b !== void 0 ? _b : 50,
            });
        },
        enabled: (_d = params.enabled) !== null && _d !== void 0 ? _d : !!params.institutionId,
        staleTime: 30000, // 30 seconds
    });
}
/**
 * Hook to search inventory across all institution labs (admin only)
 */
function useInstitutionInventorySearch(client, params) {
    var _a, _b, _c, _d;
    return (0, react_query_1.useQuery)({
        queryKey: (0, institution_1.institutionInventory)({
            institutionId: params.institutionId,
            labIds: (_a = params.labIds) !== null && _a !== void 0 ? _a : null,
            query: (_b = params.query) !== null && _b !== void 0 ? _b : null,
            page: (_c = params.page) !== null && _c !== void 0 ? _c : null,
        }),
        queryFn: async () => {
            var _a, _b;
            if (!params.institutionId)
                throw new Error('institutionId required');
            return (0, shared_core_1.searchInstitutionInventory)(client, params.institutionId, {
                labIds: params.labIds,
                query: params.query,
                page: (_a = params.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = params.limit) !== null && _b !== void 0 ? _b : 50,
            });
        },
        enabled: (_d = params.enabled) !== null && _d !== void 0 ? _d : !!params.institutionId,
        staleTime: 30000, // 30 seconds
    });
}
//# sourceMappingURL=institution.js.map