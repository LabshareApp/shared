export declare const collaborationKeys: {
    collaborators: () => readonly ["collaborators"];
    availableLabs: () => readonly ["availableLabs"];
    collaboratorLabs: () => readonly ["collaboratorLabs"];
    collaboratorInventorySearch: (params: {
        labId?: string | null;
        searchText?: string | null;
        selectedLabIds?: string[] | null;
        sortBy?: string | null;
        sortDirection?: string | null;
        limit?: number | null;
    }) => readonly ["collaboratorInventorySearch", string | null, string, string, string | null, string | null, number | null];
    collaboratorInventorySemanticSearch: (params: {
        labId?: string | null;
        searchText?: string | null;
        selectedLabIds?: string[] | null;
        sortBy?: string | null;
        sortDirection?: string | null;
        limit?: number | null;
    }) => readonly ["collaboratorInventorySemanticSearch", string | null, string, string, string | null, string | null, number | null];
};
//# sourceMappingURL=collaboration.d.ts.map