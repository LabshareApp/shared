"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyLabs = getMyLabs;
exports.switchLab = switchLab;
const responseValidation_1 = require("../../responseValidation");
/** Fetch all labs the authenticated user belongs to. */
async function getMyLabs(client) {
    const res = await client.request({
        method: 'GET',
        path: '/my-labs',
    });
    return (0, responseValidation_1.validateArrayResponse)(res, 'getMyLabs');
}
/** Switch the user's active/default lab. Updates profiles.lab_id in Supabase. */
async function switchLab(client, labId) {
    const res = await client.request({
        method: 'POST',
        path: '/switch-lab',
        body: { labId },
    });
    return (0, responseValidation_1.validateObjectResponse)(res, 'switchLab', ['labId']);
}
//# sourceMappingURL=multiLab.js.map