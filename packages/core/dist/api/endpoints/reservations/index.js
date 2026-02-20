"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMachineTags = fetchMachineTags;
exports.createMachineTag = createMachineTag;
exports.updateMachineTag = updateMachineTag;
exports.deleteMachineTag = deleteMachineTag;
exports.fetchMachines = fetchMachines;
exports.fetchMachine = fetchMachine;
exports.createMachine = createMachine;
exports.updateMachine = updateMachine;
exports.deleteMachine = deleteMachine;
exports.setMachineApprovers = setMachineApprovers;
exports.fetchReservations = fetchReservations;
exports.fetchMyReservations = fetchMyReservations;
exports.fetchReservation = fetchReservation;
exports.checkAvailability = checkAvailability;
exports.createReservation = createReservation;
exports.updateReservation = updateReservation;
exports.cancelReservation = cancelReservation;
exports.fetchPendingApprovals = fetchPendingApprovals;
exports.approveReservation = approveReservation;
exports.rejectReservation = rejectReservation;
exports.checkInReservation = checkInReservation;
exports.checkOutReservation = checkOutReservation;
exports.fetchRecurringRules = fetchRecurringRules;
exports.fetchRecurringRule = fetchRecurringRule;
exports.createRecurringRule = createRecurringRule;
exports.updateRecurringRule = updateRecurringRule;
exports.deactivateRecurringRule = deactivateRecurringRule;
exports.generateMachineImagePresignedUrl = generateMachineImagePresignedUrl;
exports.getMachineImageViewUrl = getMachineImageViewUrl;
const responseValidation_1 = require("../../responseValidation");
function normalizeId(obj) {
    const idValue = (obj === null || obj === void 0 ? void 0 : obj._id) || (obj === null || obj === void 0 ? void 0 : obj.id);
    if (!idValue)
        return obj;
    return { ...obj, _id: idValue, id: idValue };
}
function normalizeArray(arr) {
    return arr.map(normalizeId);
}
// =============================================================================
// Machine Tags
// =============================================================================
/**
 * Fetch all machine tags for the authenticated lab.
 */
async function fetchMachineTags(client) {
    const response = await client.request({
        method: 'GET',
        path: '/reservations/tags',
    });
    const validated = (0, responseValidation_1.validateArrayResponse)(response, 'fetchMachineTags');
    return normalizeArray(validated);
}
/**
 * Create a new machine tag.
 */
async function createMachineTag(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/reservations/create-tag',
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'createMachineTag', ['id', 'name']);
    return normalizeId(validated);
}
/**
 * Update a machine tag.
 */
async function updateMachineTag(client, id, data) {
    await client.request({
        method: 'PUT',
        path: '/reservations/update-tag',
        query: { id },
        body: data,
    });
}
/**
 * Delete a machine tag.
 */
async function deleteMachineTag(client, id) {
    await client.request({
        method: 'DELETE',
        path: '/reservations/delete-tag',
        query: { id },
    });
}
// =============================================================================
// Machines
// =============================================================================
/**
 * Fetch all machines for the authenticated lab.
 * Set includeCollaborators=true to also include machines from accepted collaborator labs.
 */
async function fetchMachines(client, params) {
    const query = {};
    if (params === null || params === void 0 ? void 0 : params.activeOnly) {
        query.activeOnly = 'true';
    }
    if (params === null || params === void 0 ? void 0 : params.includeCollaborators) {
        query.includeCollaborators = 'true';
    }
    const response = await client.request({
        method: 'GET',
        path: '/reservations/machines',
        query: Object.keys(query).length > 0 ? query : undefined,
    });
    const validated = (0, responseValidation_1.validateArrayResponse)(response, 'fetchMachines');
    return normalizeArray(validated);
}
/**
 * Fetch a single machine by ID.
 */
async function fetchMachine(client, id) {
    const response = await client.request({
        method: 'GET',
        path: '/reservations/machine',
        query: { id },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchMachine', ['id', 'name']);
    return normalizeId(validated);
}
/**
 * Create a new machine.
 */
async function createMachine(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/reservations/create-machine',
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'createMachine', ['id', 'name']);
    return normalizeId(validated);
}
/**
 * Update a machine.
 */
async function updateMachine(client, id, data) {
    await client.request({
        method: 'PUT',
        path: '/reservations/update-machine',
        query: { id },
        body: data,
    });
}
/**
 * Delete (deactivate) a machine.
 */
async function deleteMachine(client, id) {
    await client.request({
        method: 'DELETE',
        path: '/reservations/delete-machine',
        query: { id },
    });
}
/**
 * Set approvers for a machine.
 * Only the machine owner can set approvers.
 */
async function setMachineApprovers(client, id, data) {
    const response = await client.request({
        method: 'PUT',
        path: '/reservations/machine-approvers',
        query: { id },
        body: data,
    });
    return response;
}
// =============================================================================
// Reservations
// =============================================================================
/**
 * Fetch reservations for a machine within a date range.
 */
async function fetchReservations(client, params) {
    const query = {
        machineId: params.machineId,
    };
    if (params.start) {
        query.start = params.start;
    }
    if (params.end) {
        query.end = params.end;
    }
    const response = await client.request({
        method: 'GET',
        path: '/reservations/list',
        query,
    });
    const validated = (0, responseValidation_1.validateArrayResponse)(response, 'fetchReservations');
    return normalizeArray(validated);
}
/**
 * Fetch the current user's reservations.
 */
async function fetchMyReservations(client, params) {
    const query = {};
    if (params === null || params === void 0 ? void 0 : params.includeHistory) {
        query.includeHistory = 'true';
    }
    const response = await client.request({
        method: 'GET',
        path: '/reservations/my-reservations',
        query: Object.keys(query).length > 0 ? query : undefined,
    });
    const validated = (0, responseValidation_1.validateArrayResponse)(response, 'fetchMyReservations');
    return normalizeArray(validated);
}
/**
 * Fetch a single reservation by ID.
 */
async function fetchReservation(client, id) {
    const response = await client.request({
        method: 'GET',
        path: '/reservations/reservation',
        query: { id },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchReservation', ['id', 'machineId']);
    return normalizeId(validated);
}
/**
 * Check availability for a time slot.
 */
async function checkAvailability(client, params) {
    const query = {
        machineId: params.machineId,
        start: params.start,
        end: params.end,
    };
    if (params.slotIndex !== undefined) {
        query.slotIndex = String(params.slotIndex);
    }
    const response = await client.request({
        method: 'GET',
        path: '/reservations/check-availability',
        query,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'checkAvailability', ['available']);
}
/**
 * Create a new reservation.
 */
async function createReservation(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/reservations/create',
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'createReservation', ['id', 'machineId']);
    return normalizeId(validated);
}
/**
 * Update a reservation.
 */
async function updateReservation(client, id, data) {
    await client.request({
        method: 'PUT',
        path: '/reservations/update',
        query: { id },
        body: data,
    });
}
/**
 * Cancel a reservation.
 */
async function cancelReservation(client, id) {
    await client.request({
        method: 'POST',
        path: '/reservations/cancel',
        query: { id },
    });
}
/**
 * Fetch pending approval requests (for machine owners).
 */
async function fetchPendingApprovals(client) {
    const response = await client.request({
        method: 'GET',
        path: '/reservations/pending-approvals',
    });
    const validated = (0, responseValidation_1.validateArrayResponse)(response, 'fetchPendingApprovals');
    return normalizeArray(validated);
}
/**
 * Approve a reservation request.
 * For multi-approver machines, this may return approval progress.
 */
async function approveReservation(client, id, data) {
    const response = await client.request({
        method: 'POST',
        path: '/reservations/approve',
        query: { id },
        body: data,
    });
    return response;
}
/**
 * Reject a reservation request.
 */
async function rejectReservation(client, id, data) {
    await client.request({
        method: 'POST',
        path: '/reservations/reject',
        query: { id },
        body: data,
    });
}
/**
 * Check in to a reservation.
 */
async function checkInReservation(client, id) {
    await client.request({
        method: 'POST',
        path: '/reservations/check-in',
        query: { id },
    });
}
/**
 * Check out from a reservation.
 * Optionally pass consumable usage data to decrement inventory.
 */
async function checkOutReservation(client, id, data) {
    await client.request({
        method: 'POST',
        path: '/reservations/check-out',
        query: { id },
        body: data,
    });
}
// =============================================================================
// Recurring Rules
// =============================================================================
/**
 * Fetch active recurring rules for the authenticated lab.
 */
async function fetchRecurringRules(client) {
    const response = await client.request({
        method: 'GET',
        path: '/reservations/recurring-rules',
    });
    const validated = (0, responseValidation_1.validateArrayResponse)(response, 'fetchRecurringRules');
    return normalizeArray(validated);
}
/**
 * Fetch a single recurring rule by ID.
 */
async function fetchRecurringRule(client, id) {
    const response = await client.request({
        method: 'GET',
        path: '/reservations/recurring-rule',
        query: { id },
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'fetchRecurringRule', ['id', 'machineId']);
    return normalizeId(validated);
}
/**
 * Create a new recurring rule.
 */
async function createRecurringRule(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/reservations/create-recurring',
        body: data,
    });
    const validated = (0, responseValidation_1.validateObjectResponse)(response, 'createRecurringRule', ['id', 'machineId']);
    return normalizeId(validated);
}
/**
 * Update a recurring rule.
 */
async function updateRecurringRule(client, id, data) {
    await client.request({
        method: 'PUT',
        path: '/reservations/update-recurring',
        query: { id },
        body: data,
    });
}
/**
 * Deactivate a recurring rule.
 */
async function deactivateRecurringRule(client, id, params) {
    const query = { id };
    if (params === null || params === void 0 ? void 0 : params.deleteFuture) {
        query.deleteFuture = 'true';
    }
    await client.request({
        method: 'POST',
        path: '/reservations/deactivate-recurring',
        query,
    });
}
// =============================================================================
// Machine Image Upload
// =============================================================================
/**
 * Generate a presigned URL for uploading a machine image.
 */
async function generateMachineImagePresignedUrl(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/reservations/generate-presigned-url/machine-image',
        body: data,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'generateMachineImagePresignedUrl', ['uploadUrl', 's3Url']);
}
/**
 * Get a presigned URL for viewing a machine image.
 */
async function getMachineImageViewUrl(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/reservations/get-machine-image-view-url',
        body: data,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getMachineImageViewUrl', ['url', 'expiresAt']);
}
//# sourceMappingURL=index.js.map