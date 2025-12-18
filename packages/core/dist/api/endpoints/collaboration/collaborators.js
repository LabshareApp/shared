"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollaboratorRequest = createCollaboratorRequest;
exports.acceptCollaboratorRequest = acceptCollaboratorRequest;
exports.deleteCollaborator = deleteCollaborator;
exports.listCollaborators = listCollaborators;
exports.getAvailableLabs = getAvailableLabs;
const responseValidation_1 = require("../../responseValidation");
async function createCollaboratorRequest(client, targetLabId) {
    const request = { target_lab_id: targetLabId };
    const response = await client.request({
        method: 'POST',
        path: '/create-collaborator-request',
        body: request,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createCollaboratorRequest', ['message']);
}
async function acceptCollaboratorRequest(client, requestingLabId) {
    const request = { requesting_lab_id: requestingLabId };
    const response = await client.request({
        method: 'POST',
        path: '/accept-collaborator-request',
        body: request,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'acceptCollaboratorRequest', ['message']);
}
async function deleteCollaborator(client, collaboratorLabId) {
    const request = { collaborator_lab_id: collaboratorLabId };
    const response = await client.request({
        method: 'DELETE',
        path: '/delete-collaborator',
        body: request,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'deleteCollaborator', ['message']);
}
async function listCollaborators(client) {
    const response = await client.request({
        method: 'GET',
        path: '/list-collaborators',
    });
    return (0, responseValidation_1.validateArrayResponse)(response, 'listCollaborators');
}
async function getAvailableLabs(client) {
    const response = await client.request({
        method: 'GET',
        path: '/available-labs',
    });
    return (0, responseValidation_1.validateArrayResponse)(response, 'getAvailableLabs');
}
//# sourceMappingURL=collaborators.js.map