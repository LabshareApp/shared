/**
 * Value types supported by custom fields.
 */
export type CustomFieldValueType = 'decimal' | 'integer' | 'text' | 'image' | 'pdf' | 'excel_csv' | 'custom_values';
/**
 * Entity types that custom fields can apply to.
 */
export type CustomFieldAppliesTo = 'inventory' | 'orderRequest';
/**
 * Validation constraints for custom field values.
 */
export interface CustomFieldConstraints {
    /** Minimum value for decimal/integer types */
    min?: number;
    /** Maximum value for decimal/integer types */
    max?: number;
    /** Allowed values for custom_values type (dropdown options) */
    options?: string[];
}
/**
 * A custom field definition that defines a field's metadata and validation rules.
 * Custom fields are defined at the lab level and can apply to inventory items and/or order requests.
 */
export interface CustomFieldDefinition {
    /** Unique identifier */
    id: string;
    /** Lab this field belongs to */
    labId: string;
    /** Display name of the field */
    name: string;
    /** Data type of the field's value */
    valueType: CustomFieldValueType;
    /** Which entity types this field applies to */
    appliesTo: CustomFieldAppliesTo[];
    /** Whether this field is required when saving an item/request */
    required: boolean;
    /** Display order for this field in the UI */
    order: number;
    /** Validation constraints based on valueType */
    constraints?: CustomFieldConstraints;
    /** Optional description for the field */
    description?: string;
    /** When the field definition was created */
    createdAt: string;
    /** When the field definition was last updated */
    updatedAt: string;
}
/**
 * Data required to create a new custom field definition.
 */
export interface CreateCustomFieldData {
    /** Display name of the field */
    name: string;
    /** Data type of the field's value */
    valueType: CustomFieldValueType;
    /** Which entity types this field applies to */
    appliesTo: CustomFieldAppliesTo[];
    /** Whether this field is required (defaults to false) */
    required?: boolean;
    /** Validation constraints based on valueType */
    constraints?: CustomFieldConstraints;
    /** Optional description for the field */
    description?: string;
}
/**
 * Data for updating an existing custom field definition.
 * All fields are optional - only provided fields will be updated.
 */
export interface UpdateCustomFieldData {
    /** Display name of the field */
    name?: string;
    /** Data type of the field's value */
    valueType?: CustomFieldValueType;
    /** Which entity types this field applies to */
    appliesTo?: CustomFieldAppliesTo[];
    /** Whether this field is required */
    required?: boolean;
    /** Validation constraints based on valueType */
    constraints?: CustomFieldConstraints;
    /** Optional description for the field */
    description?: string;
}
/**
 * Custom field value stored on an item or order request.
 * The key is the field definition ID.
 */
export interface CustomFieldValue {
    /** The value (string, number, or null) */
    value: string | number | null;
    /** S3 URL for file types (image, pdf, excel_csv) */
    fileUrl?: string;
}
/**
 * Map of custom field values keyed by field definition ID.
 */
export type CustomFieldValues = Record<string, CustomFieldValue>;
//# sourceMappingURL=customFields.d.ts.map