export const notificationKeys = {
  deviceRegistration: () => ['deviceRegistration'] as const,
  inventoryNotifications: (labId: string | null | undefined, limit: number) =>
    ['inventoryNotifications', labId ?? null, limit] as const,
  notificationPreferences: () => ['notificationPreferences'] as const,
  topics: (type?: string) => ['topics', type ?? null] as const,
};




