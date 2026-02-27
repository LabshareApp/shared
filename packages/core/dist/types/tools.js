"use strict";
/**
 * Tools Management Types
 * Types for shareable lab tools with checkout/return functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOL_REQUIRED_FIELD_OPTIONS = exports.TOOL_CATEGORIES = void 0;
// --- Tool Categories (predefined list) ---
exports.TOOL_CATEGORIES = [
    'Hand Tool',
    'Power Tool',
    'Measurement',
    'Cutting',
    'Safety Equipment',
    'Cleaning',
    'Storage',
    'Electrical',
    'Optical',
    'Laboratory Equipment',
    'Other',
];
exports.TOOL_REQUIRED_FIELD_OPTIONS = [
    { key: 'description', label: 'Description', description: 'Require a description when creating tools' },
    { key: 'serialNumber', label: 'Serial Number', description: 'Require a serial number for each tool' },
    { key: 'location', label: 'Location', description: 'Require a storage location' },
    { key: 'imageUrl', label: 'Image', description: 'Require an image of the tool' },
    { key: 'maxCheckoutDays', label: 'Max Checkout Days', description: 'Require a maximum checkout duration' },
];
//# sourceMappingURL=tools.js.map