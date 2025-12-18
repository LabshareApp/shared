"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabMembers = getLabMembers;
const responseValidation_1 = require("../../responseValidation");
async function getLabMembers(client, labId) {
    const res = await client.request({
        method: 'GET',
        path: '/get-lab-members',
        query: { lab_id: labId },
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'getLabMembers');
}
//# sourceMappingURL=members.js.map