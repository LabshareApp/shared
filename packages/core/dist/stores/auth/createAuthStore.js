"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthStore = createAuthStore;
function emptyLabs() {
    return { id: '', name: '', country: '', department: '', institution: '' };
}
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
            var _a, _b;
            set({ isLoading: true });
            const { data, error } = await adapters.supabaseAuth.getSession();
            if (error)
                log === null || log === void 0 ? void 0 : log.error('auth.getSession_error', { error });
            const session = (_a = data === null || data === void 0 ? void 0 : data.session) !== null && _a !== void 0 ? _a : null;
            set({ session });
            if ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id) {
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
                    adapters.queryClient.clear();
                    set({
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
                const { data, error } = await adapters.supabaseAuth.signInWithPassword({
                    email,
                    password,
                });
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
            set({ isLoading: true });
            try {
                const token = get().getAccessToken();
                if (token && deviceId && adapters.notifications) {
                    try {
                        await adapters.notifications.deregisterDevice({ deviceId, token });
                    }
                    catch (e) {
                        log === null || log === void 0 ? void 0 : log.warn('auth.deregisterDevice_failed', { error: e });
                    }
                }
                const { error } = await adapters.supabaseAuth.signOut();
                if (error)
                    throw error;
                adapters.queryClient.clear();
                adapters.analytics.track('Sign Out');
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
            finally {
                set({ isLoading: false });
            }
        },
        registerUser: async (data) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
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
                set({
                    userProfile: {
                        id: user.id,
                        first_name: (_c = userData === null || userData === void 0 ? void 0 : userData.firstName) !== null && _c !== void 0 ? _c : '',
                        last_name: (_d = userData === null || userData === void 0 ? void 0 : userData.lastName) !== null && _d !== void 0 ? _d : '',
                        phone_number: (_e = userData === null || userData === void 0 ? void 0 : userData.phoneNumber) !== null && _e !== void 0 ? _e : '',
                        email: (_f = user.email) !== null && _f !== void 0 ? _f : '',
                        role: (_g = labData === null || labData === void 0 ? void 0 : labData.role) !== null && _g !== void 0 ? _g : '',
                        lab_id: (_h = labData === null || labData === void 0 ? void 0 : labData.id) !== null && _h !== void 0 ? _h : '',
                        labs: {
                            id: (_j = labData === null || labData === void 0 ? void 0 : labData.id) !== null && _j !== void 0 ? _j : '',
                            name: (_k = labData === null || labData === void 0 ? void 0 : labData.name) !== null && _k !== void 0 ? _k : '',
                            country: (_l = labData === null || labData === void 0 ? void 0 : labData.country) !== null && _l !== void 0 ? _l : '',
                            department: (_m = labData === null || labData === void 0 ? void 0 : labData.department) !== null && _m !== void 0 ? _m : '',
                            institution: (_o = labData === null || labData === void 0 ? void 0 : labData.institution) !== null && _o !== void 0 ? _o : '',
                        },
                    },
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