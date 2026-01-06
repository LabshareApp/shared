export const labKeys = {
  members: (labId: string | null | undefined) => ['labMembers', labId ?? null] as const,
};




