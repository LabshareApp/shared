"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationKeys = void 0;
exports.notificationKeys = {
    deviceRegistration: () => ['deviceRegistration'],
    inventoryNotifications: (labId, limit) => ['inventoryNotifications', labId !== null && labId !== void 0 ? labId : null, limit],
    notificationPreferences: () => ['notificationPreferences'],
    topics: (type) => ['topics', type !== null && type !== void 0 ? type : null],
};
//# sourceMappingURL=notifications.js.map