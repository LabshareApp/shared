export interface SupabaseAuthAdapter {
    getSession(): Promise<{
        data: {
            session: unknown | null;
        };
        error: unknown | null;
    }>;
    signInWithPassword(params: {
        email: string;
        password: string;
    }): Promise<{
        data: {
            session: unknown | null;
            user: unknown | null;
        };
        error: unknown | null;
    }>;
    signUp(params: {
        email: string;
        password: string;
        options?: unknown;
    }): Promise<{
        data: {
            session: unknown | null;
            user: unknown | null;
        };
        error: unknown | null;
    }>;
    signOut(): Promise<{
        error: unknown | null;
    }>;
    refreshSession?(): Promise<{
        data: {
            session: unknown | null;
        };
        error: unknown | null;
    }>;
    onAuthStateChange(callback: (event: string, session: unknown | null) => void): {
        data: {
            subscription: {
                unsubscribe(): void;
            };
        };
    };
}
export interface SupabaseQueryAdapter {
    from(table: string): unknown;
}
export interface SupabaseAdapter {
    auth: SupabaseAuthAdapter;
    from: SupabaseQueryAdapter['from'];
}
//# sourceMappingURL=SupabaseAdapter.d.ts.map