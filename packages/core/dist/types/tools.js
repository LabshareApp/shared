"use strict";
/**
 * Tools Management Types
 * Types for shareable lab tools with checkout/return functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOL_REQUIRED_FIELD_OPTIONS = exports.DEFAULT_TOOL_REQUIRED_FIELDS = exports.TOOL_CATEGORIES = void 0;
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
/**
 * Default required fields configuration (all false = no extra required fields)
 */
exports.DEFAULT_TOOL_REQUIRED_FIELDS = {
    description: false,
    serialNumber: false,
    location: false,
    imageUrl: false,
    maxCheckoutDays: false,
};
/**
 * Metadata for each configurable required field (used in settings UI)
 */
exports.TOOL_REQUIRED_FIELD_OPTIONS = [
    { key: 'description', label: 'Description', description: 'Require a description when creating tools' },
    { key: 'serialNumber', label: 'Serial Number', description: 'Require a serial number for all tools' },
    { key: 'location', label: 'Location', description: 'Require a location for all tools' },
    { key: 'imageUrl', label: 'Image', description: 'Require an image when creating tools' },
    { key: 'maxCheckoutDays', label: 'Max Checkout Days', description: 'Require a max checkout duration' },
];
//# sourceMappingURL=tools.js.map