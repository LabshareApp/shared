export declare const institutionRoot: () => readonly ["institution"];
export declare const institutionCollaborationHistory: (institutionId: string | null | undefined) => readonly ["institution", "collaboration-history", string | null];
export declare const institutionOrderRequests: (params: {
    institutionId: string | null | undefined;
    view?: "current" | "placed" | "archived" | null;
    labIds?: string[] | null;
    query?: string | null;
    page?: number | null;
}) => readonly ["institution", "order-requests", string | null, "current" | "placed" | "archived" | null, string[] | null, string | null, number | null];
export declare const institutionInventory: (params: {
    institutionId: string | null | undefined;
    labIds?: string[] | null;
    query?: string | null;
    page?: number | null;
}) => readonly ["institution", "inventory", string | null, string[] | null, string | null, number | null];
//# sourceMappingURL=institution.d.ts.map