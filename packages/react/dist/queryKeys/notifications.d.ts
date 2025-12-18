export declare const notificationKeys: {
    deviceRegistration: () => readonly ["deviceRegistration"];
    inventoryNotifications: (labId: string | null | undefined, limit: number) => readonly ["inventoryNotifications", string | null, number];
    notificationPreferences: () => readonly ["notificationPreferences"];
    topics: (type?: string) => readonly ["topics", string | null];
};
//# sourceMappingURL=notifications.d.ts.map