"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExcelContentType = getExcelContentType;
function getExcelContentType(fileExt) {
    if (fileExt === 'csv')
        return 'text/csv';
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}
//# sourceMappingURL=excel.js.map