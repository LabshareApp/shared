export declare const orderRequestKeys: {
    root: readonly ["orderRequest"];
    searchRoot: () => readonly ["orderRequestSemanticSearch"];
    tags: readonly ["orderRequestTags"];
    tagsAll: () => readonly ["orderRequestTags", "all"];
    tagsByCategory: (category: string | null, labId: string | null | undefined) => readonly ["orderRequestTags", "category", string | null, string | null];
    listAll: (labId: string | null | undefined) => readonly ["orderRequests", "all", string | null];
    orderRequestItem: (orderRequestId: string | null) => readonly ["orderRequest", "item", string | null];
    archivedOrderRequest: (archivedOrderRequestId: string | null) => readonly ["archivedOrderRequest", string | null];
    search: (params: {
        labId: string | null | undefined;
        activeFiltersKey?: unknown;
        sortBy?: string | null;
        sortDirection?: string | null;
        limit?: number | null;
        view?: string | null;
    }) => readonly ["orderRequestSemanticSearch", string | null, string, string | null, string | null, number | null, string | null];
};
//# sourceMappingURL=orderRequests.d.ts.map