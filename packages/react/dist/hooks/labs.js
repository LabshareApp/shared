"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLabMembers = useLabMembers;
const react_query_1 = require("@tanstack/react-query");
const shared_core_1 = require("@labshare/shared-core");
const labs_1 = require("../queryKeys/labs");
function useLabMembers(client, params) {
    var _a;
    return (0, react_query_1.useQuery)({
        queryKey: labs_1.labKeys.members(params.labId),
        queryFn: () => (0, shared_core_1.getLabMembers)(client, params.labId),
        enabled: ((_a = params.enabled) !== null && _a !== void 0 ? _a : true) && !!params.labId,
        staleTime: 60000,
    });
}
//# sourceMappingURL=labs.js.map