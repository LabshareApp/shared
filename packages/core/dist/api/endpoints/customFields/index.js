"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCustomFieldDefinitions = fetchCustomFieldDefinitions;
exports.fetchCustomFieldDefinition = fetchCustomFieldDefinition;
exports.createCustomFieldDefinition = createCustomFieldDefinition;
exports.updateCustomFieldDefinition = updateCustomFieldDefinition;
exports.deleteCustomFieldDefinition = deleteCustomFieldDefinition;
exports.reorderCustomFieldDefinitions = reorderCustomFieldDefinitions;
exports.generateCustomFieldFilePresignedUrl = generateCustomFieldFilePresignedUrl;
exports.getCustomFieldFileViewUrl = getCustomFieldFileViewUrl;
const responseValidation_1 = require("../../responseValidation");
/**
 * Fetch all custom field definitions for the authenticated lab.
 * Optionally filter by entity type (inventory or orderRequest).
 */
async function fetchCustomFieldDefinitions(client, appliesTo) {
    const query = {};
    if (appliesTo) {
        query.appliesTo = appliesTo;
    }
    const response = await client.request({
        method: 'GET',
        path: '/custom-fields',
        query: Object.keys(query).length > 0 ? query : undefined,
    });
    return (0, responseValidation_1.validateArrayResponse)(response, 'fetchCustomFieldDefinitions');
}
/**
 * Fetch a single custom field definition by ID.
 */
async function fetchCustomFieldDefinition(client, id) {
    const response = await client.request({
        method: 'GET',
        path: '/custom-field',
        query: { id },
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'fetchCustomFieldDefinition', ['id', 'name', 'valueType']);
}
/**
 * Create a new custom field definition.
 */
async function createCustomFieldDefinition(client, data) {
    const response = await client.request({
        method: 'POST',
        path: '/create-custom-field',
        body: data,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'createCustomFieldDefinition', ['id', 'name', 'valueType']);
}
/**
 * Update an existing custom field definition.
 */
async function updateCustomFieldDefinition(client, id, data) {
    const response = await client.request({
        method: 'PUT',
        path: '/update-custom-field',
        query: { id },
        body: data,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'updateCustomFieldDefinition', ['id', 'name', 'valueType']);
}
/**
 * Delete a custom field definition.
 * This also cascades deletion to remove field values from all items/order requests.
 */
async function deleteCustomFieldDefinition(client, id) {
    await client.request({
        method: 'DELETE',
        path: '/delete-custom-field',
        query: { id },
    });
}
/**
 * Reorder custom field definitions.
 * The orderedIds array determines the new display order.
 */
async function reorderCustomFieldDefinitions(client, orderedIds) {
    await client.request({
        method: 'POST',
        path: '/reorder-custom-fields',
        body: { orderedIds },
    });
}
/**
 * Generate a presigned URL for uploading a custom field file.
 *
 * @param client - The API client
 * @param fileType - The type of file: 'image', 'pdf', or 'excel'
 * @param fieldName - The name of the custom field (used in S3 path organization)
 * @param extension - The file extension (e.g., 'jpg', 'pdf', 'xlsx')
 * @returns The presigned URL and S3 object key
 */
async function generateCustomFieldFilePresignedUrl(client, fileType, fieldName, extension) {
    const path = `/generate-presigned-url/custom-field-${fileType}`;
    const query = { fieldName };
    if (extension) {
        query.ext = extension;
    }
    const response = await client.request({
        method: 'GET',
        path,
        query,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'generateCustomFieldFilePresignedUrl', ['url', 'object_key']);
}
/**
 * Get a presigned URL for viewing/downloading a custom field file.
 * The returned URL is valid for 15 minutes.
 *
 * @param client - The API client
 * @param s3Url - The S3 URL of the file
 * @param fileType - Optional file type hint ('image', 'pdf', or 'excel')
 * @returns The presigned view URL and expiration timestamp
 */
async function getCustomFieldFileViewUrl(client, s3Url, fileType) {
    const body = { s3Url };
    if (fileType) {
        body.fileType = fileType;
    }
    const response = await client.request({
        method: 'POST',
        path: '/get-custom-field-file-view-url',
        body,
    });
    return (0, responseValidation_1.validateObjectResponse)(response, 'getCustomFieldFileViewUrl', ['url', 'expiresAt']);
}
//# sourceMappingURL=index.js.map