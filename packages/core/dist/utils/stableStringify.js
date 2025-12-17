"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stableStringify = stableStringify;
/**
 * Stable stringify function for cache keys.
 * Creates consistent string representations of objects regardless of property order.
 */
function stableStringify(obj) {
    if (obj === null)
        return 'null';
    if (obj === undefined)
        return 'undefined';
    if (typeof obj !== 'object')
        return String(obj);
    if (Array.isArray(obj)) {
        return `[${obj.map(stableStringify).join(',')}]`;
    }
    const record = obj;
    const keys = Object.keys(record).sort();
    const pairs = keys.map((key) => `"${key}":${stableStringify(record[key])}`);
    return `{${pairs.join(',')}}`;
}
//# sourceMappingURL=stableStringify.js.map