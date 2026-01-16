"use strict";
// Canonical inventory domain types for shared-core.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateOfMatter = exports.AttributeOperator = exports.FilterOperation = exports.TagCategory = void 0;
var TagCategory;
(function (TagCategory) {
    TagCategory["Location"] = "location";
    TagCategory["Grant"] = "grant";
    TagCategory["Label"] = "label";
    TagCategory["UploadedBy"] = "uploaded_by";
})(TagCategory || (exports.TagCategory = TagCategory = {}));
var FilterOperation;
(function (FilterOperation) {
    FilterOperation["AND"] = "AND";
    FilterOperation["OR"] = "OR";
})(FilterOperation || (exports.FilterOperation = FilterOperation = {}));
var AttributeOperator;
(function (AttributeOperator) {
    AttributeOperator["Equals"] = "eq";
    AttributeOperator["NotEquals"] = "ne";
    AttributeOperator["Contains"] = "contains";
    AttributeOperator["StartsWith"] = "startswith";
    AttributeOperator["EndsWith"] = "endswith";
    AttributeOperator["GreaterThan"] = "gt";
    AttributeOperator["GreaterThanOrEqual"] = "gte";
    AttributeOperator["LessThan"] = "lt";
    AttributeOperator["LessThanOrEqual"] = "lte";
    AttributeOperator["Exists"] = "exists";
    AttributeOperator["DoesNotExist"] = "does_not_exist";
})(AttributeOperator || (exports.AttributeOperator = AttributeOperator = {}));
var StateOfMatter;
(function (StateOfMatter) {
    StateOfMatter["Liquid"] = "liquid";
    StateOfMatter["Gas"] = "gas";
    StateOfMatter["Solid"] = "solid";
    StateOfMatter["Plasma"] = "plasma";
})(StateOfMatter || (exports.StateOfMatter = StateOfMatter = {}));
//# sourceMappingURL=inventory.js.map