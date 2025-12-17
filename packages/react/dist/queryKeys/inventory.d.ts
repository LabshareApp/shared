export declare const inventoryKeys: {
    inventory: readonly ["inventory"];
    tags: readonly ["tags"];
    customGroups: readonly ["customGroups"];
    tagsAll: () => readonly ["tags", "all"];
    tagsByCategory: (category: string | null, labId: string | null | undefined) => readonly ["tags", "category", string | null, string | null];
    customGroupsAll: (labId?: string | null) => readonly ["customGroups", "all", string | null];
    customGroupDetail: (groupId: string | null) => readonly ["customGroups", "detail", string | null];
    inventoryItem: (itemId: string | null) => readonly ["inventoryItem", string | null];
    search: (params: {
        appliedGroupId?: string | null;
        activeFiltersKey?: unknown;
        sortBy?: string | null;
        sortDirection?: string | null;
        limit?: number | null;
    }) => readonly ["inventory", string | null, string, string | null, string | null, number | null];
};
//# sourceMappingURL=inventory.d.ts.map