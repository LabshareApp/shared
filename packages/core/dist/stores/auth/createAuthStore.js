"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthStore = createAuthStore;
const jwt_1 = require("../../utils/jwt");
function emptyLabs() {
    return { id: '', name: '', country: '', department: '', institution: '' };
}
// Flag to prevent concurrent signOut calls
let isSigningOut = false;
function createAuthStore(adapters) {
    const log = adapters.logger;
    return (set, get) => ({
        session: null,
        isLoading: true,
        userProfile: null,
        registrationData: {
            email: '',
            password: '',
            userData: null,
            labData: null,
        },
        currentStep: 'login',
        labData: null,
        isLabRegistered: false,
        initialize: async () => {
            var _a, _b, _c, _d, _e;
            set({ isLoading: true });
            const { data, error } = await adapters.supabaseAuth.getSession();
            if (error)
                log === null || log === void 0 ? void 0 : log.error('auth.getSession_error', { error });
            let session = (_a = data === null || data === void 0 ? void 0 : data.session) !== null && _a !== void 0 ? _a : null;
            // Check if session exists but token is expired
            if ((session === null || session === void 0 ? void 0 : session.access_token) && (0, jwt_1.isTokenExpired)(session.access_token)) {
                log === null || log === void 0 ? void 0 : log.info('auth.session_expired_on_init', {});
                // Try to refresh the session
                try {
                    const refreshResult = await ((_c = (_b = adapters.supabaseAuth).refreshSession) === null || _c === void 0 ? void 0 : _c.call(_b));
                    const refreshedSession = (_d = refreshResult === null || refreshResult === void 0 ? void 0 : refreshResult.data) === null || _d === void 0 ? void 0 : _d.session;
                    if ((refreshedSession === null || refreshedSession === void 0 ? void 0 : refreshedSession.access_token) && !(0, jwt_1.isTokenExpired)(refreshedSession.access_token)) {
                        session = refreshedSession;
                        log === null || log === void 0 ? void 0 : log.info('auth.session_refreshed_on_init', {});
                    }
                    else {
                        // Refresh failed or returned expired token - clear session
                        session = null;
                        log === null || log === void 0 ? void 0 : log.warn('auth.session_refresh_failed_on_init', {});
                    }
                }
                catch (refreshError) {
                    log === null || log === void 0 ? void 0 : log.warn('auth.session_refresh_error_on_init', { error: refreshError });
                    session = null;
                }
            }
            set({ session });
            if ((_e = session === null || session === void 0 ? void 0 : session.user) === null || _e === void 0 ? void 0 : _e.id) {
                try {
                    await get().fetchUserProfile(session.user.id);
                }
                catch (e) {
                    log === null || log === void 0 ? void 0 : log.error('auth.fetchUserProfile_error', { error: e });
                }
            }
            const { data: subData } = adapters.supabaseAuth.onAuthStateChange(async (event, newSession) => {
                var _a;
                log === null || log === void 0 ? void 0 : log.info('auth.state_change', { event });
                set({ session: newSession });
                const ns = newSession;
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if ((_a = ns === null || ns === void 0 ? void 0 : ns.user) === null || _a === void 0 ? void 0 : _a.id) {
                        try {
                            await get().fetchUserProfile(ns.user.id);
                        }
                        catch (e) {
                            log === null || log === void 0 ? void 0 : log.error('auth.fetchUserProfile_error', { error: e });
                        }
                    }
                }
                else if (event === 'SIGNED_OUT') {
                    // Clear state when signed out
                    adapters.queryClient.clear();
                    set({
                        session: null,
                        userProfile: null,
                        currentStep: 'login',
                        labData: null,
                        isLabRegistered: false,
                        registrationData: {
                            email: '',
                            password: '',
                            userData: null,
                            labData: null,
                        },
                    });
                }
            });
            set({ isLoading: false });
            return () => {
                subData.subscription.unsubscribe();
            };
        },
        getAccessToken: () => { var _a; return ((_a = get().session) === null || _a === void 0 ? void 0 : _a.access_token) || null; },
        signIn: async (email, password) => {
            var _a, _b;
            set({ isLoading: true });
            try {
                // Sign in with timeout (4 seconds)
                const signInPromise = adapters.supabaseAuth.signInWithPassword({
                    email,
                    password,
                });
                const timeoutPromise = new Promise((resolve) => {
                    setTimeout(() => resolve({
                        data: { session: null, user: null },
                        error: new Error('Sign in timeout - please try again')
                    }), 4000);
                });
                const { data, error } = await Promise.race([signInPromise, timeoutPromise]);
                if (error)
                    throw error;
                set({ session: (_a = data === null || data === void 0 ? void 0 : data.session) !== null && _a !== void 0 ? _a : null });
                const user = (_b = data === null || data === void 0 ? void 0 : data.user) !== null && _b !== void 0 ? _b : null;
                if (user === null || user === void 0 ? void 0 : user.id) {
                    await get().fetchUserProfile(user.id);
                    adapters.analytics.setUserId(user.id);
                    adapters.analytics.track('Sign In');
                }
            }
            finally {
                set({ isLoading: false });
            }
        },
        signOut: async (deviceId) => {
            // Prevent concurrent signOut calls
            if (isSigningOut) {
                log === null || log === void 0 ? void 0 : log.warn('auth.signOut_already_in_progress');
                return;
            }
            isSigningOut = true;
            try {
                // Deregister device if needed
                const token = get().getAccessToken();
                if (token && deviceId && adapters.notifications) {
                    try {
                        await adapters.notifications.deregisterDevice({ deviceId, token });
                    }
                    catch (e) {
                        log === null || log === void 0 ? void 0 : log.warn('auth.deregisterDevice_failed', { error: e });
                        // Don't fail sign out if device deregistration fails
                    }
                }
                // Clear query cache
                adapters.queryClient.clear();
                // Track analytics
                adapters.analytics.track('Sign Out');
                // Clear local state
                set({
                    session: null,
                    userProfile: null,
                    currentStep: 'login',
                    labData: null,
                    isLabRegistered: false,
                    registrationData: {
                        email: '',
                        password: '',
                        userData: null,
                        labData: null,
                    },
                });
                // Sign out from Supabase with timeout (4 seconds)
                try {
                    const signOutPromise = adapters.supabaseAuth.signOut();
                    const timeoutPromise = new Promise((resolve) => {
                        setTimeout(() => resolve({ error: new Error('Sign out timeout') }), 4000);
                    });
                    await Promise.race([signOutPromise, timeoutPromise]);
                }
                catch (supabaseError) {
                    log === null || log === void 0 ? void 0 : log.warn('auth.signOut_supabase_error', { error: supabaseError });
                    // Continue even if Supabase sign out fails - we've cleared local state
                }
            }
            catch (error) {
                log === null || log === void 0 ? void 0 : log.error('auth.signOut_unexpected_error', { error });
                // Ensure state is cleared even on error
                adapters.queryClient.clear();
                set({
                    session: null,
                    userProfile: null,
                    currentStep: 'login',
                    labData: null,
                    isLabRegistered: false,
                    registrationData: {
                        email: '',
                        password: '',
                        userData: null,
                        labData: null,
                    },
                });
                throw error;
            }
            finally {
                isSigningOut = false;
            }
        },
        registerUser: async (data) => {
            var _a, _b;
            const { email, password, userData, labData } = data;
            const { data: authData, error } = await adapters.supabaseAuth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: userData === null || userData === void 0 ? void 0 : userData.firstName,
                        last_name: userData === null || userData === void 0 ? void 0 : userData.lastName,
                    },
                    // Email verification disabled (matches current mobile behavior)
                    emailRedirectTo: undefined,
                },
            });
            if (error)
                throw error;
            const user = (_a = authData === null || authData === void 0 ? void 0 : authData.user) !== null && _a !== void 0 ? _a : null;
            const session = (_b = authData === null || authData === void 0 ? void 0 : authData.session) !== null && _b !== void 0 ? _b : null;
            if (user === null || user === void 0 ? void 0 : user.id) {
                await adapters.profiles.upsertProfile({
                    userId: user.id,
                    email: user.email,
                    userData,
                    labData,
                });
                // CRITICAL FIX: Fetch the profile from the database to get the correct lab_id
                // This ensures that when a new lab is created, we get the actual lab_id
                // that was generated during upsertProfile, rather than using labData?.id
                // which will be empty for newly created labs
                await get().fetchUserProfile(user.id);
                set({
                    session,
                });
                adapters.analytics.track('Sign Up');
            }
        },
        updateRegistrationData: (data) => set((state) => ({
            registrationData: { ...state.registrationData, ...data },
        })),
        setCurrentStep: (step) => set({ currentStep: step }),
        setLabData: (data) => set({ labData: data }),
        setIsLabRegistered: (value) => set({ isLabRegistered: value }),
        fetchUserProfile: async (userId) => {
            var _a, _b;
            const profile = await adapters.profiles.fetchUserProfile(userId);
            // Normalize labs nullability defensively
            const labs = (_a = profile.labs) !== null && _a !== void 0 ? _a : emptyLabs();
            const normalized = {
                ...profile,
                labs: Array.isArray(labs) ? ((_b = labs[0]) !== null && _b !== void 0 ? _b : emptyLabs()) : labs,
            };
            set({ userProfile: normalized });
            return normalized;
        },
        fetchSinglePublicProfile: (userId) => adapters.profiles.fetchSinglePublicProfile(userId),
        fetchMultipleUserProfiles: (userIds) => adapters.profiles.fetchMultipleUserProfiles(userIds),
        updateLocalUserProfile: (updatedProfile) => {
            set((state) => ({
                userProfile: state.userProfile ? { ...state.userProfile, ...updatedProfile } : null,
            }));
        },
    });
}
//# sourceMappingURL=createAuthStore.js.map