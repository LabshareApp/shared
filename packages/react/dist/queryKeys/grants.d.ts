export declare const grantsRoot: () => readonly ["grants"];
export declare const grantsList: (labId: string | null | undefined, status?: string | null) => readonly ["grants", "list", string | null, string | null];
export declare const grantItem: (grantId: string | null | undefined) => readonly ["grants", "item", string | null];
export declare const grantTransactions: (params: {
    grantId: string | null | undefined;
    type?: string | null;
    page?: number | null;
    limit?: number | null;
}) => readonly ["grants", "transactions", string | null, string | null, number | null, number | null];
export declare const odcCategories: () => readonly ["grants", "odcCategories"];
//# sourceMappingURL=grants.d.ts.map