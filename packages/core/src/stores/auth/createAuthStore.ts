import type { AnalyticsAdapter } from '../../adapters/AnalyticsAdapter';
import type { SupabaseAuthAdapter } from '../../adapters/SupabaseAdapter';
import type { Logger } from '../../utils/logger';
import type { LabData, ProfileData, RegistrationData, RegistrationStep } from './authTypes';
import { isTokenExpired } from '../../utils/jwt';

export interface QueryClientAdapter {
  clear(): void;
}

export interface ProfilesAdapter {
  fetchUserProfile(userId: string): Promise<ProfileData>;
  fetchSinglePublicProfile(userId: string): Promise<ProfileData | null>;
  fetchMultipleUserProfiles(userIds: string[]): Promise<ProfileData[]>;

  upsertProfile(params: {
    userId: string;
    email: string | null | undefined;
    userData: RegistrationData['userData'];
    labData: RegistrationData['labData'];
  }): Promise<void>;
}

export interface NotificationsAdapter {
  deregisterDevice(params: { deviceId: string; token: string }): Promise<void>;
}

export interface AuthStoreAdapters {
  supabaseAuth: SupabaseAuthAdapter;
  profiles: ProfilesAdapter;
  queryClient: QueryClientAdapter;
  analytics: AnalyticsAdapter;
  notifications?: NotificationsAdapter;
  logger?: Logger;
}

export interface AuthState {
  session: any | null;
  isLoading: boolean;
  userProfile: ProfileData | null;
  registrationData: RegistrationData;
  currentStep: RegistrationStep;
  labData: LabData | null;
  isLabRegistered: boolean;

  initialize: () => Promise<() => void>;
  getAccessToken: () => string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: (deviceId: string) => Promise<void>;
  registerUser: (data: RegistrationData) => Promise<void>;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  setCurrentStep: (step: RegistrationStep) => void;
  setLabData: (data: LabData | null) => void;
  setIsLabRegistered: (value: boolean) => void;
  fetchUserProfile: (userId: string) => Promise<ProfileData>;
  fetchSinglePublicProfile: (userId: string) => Promise<ProfileData | null>;
  fetchMultipleUserProfiles: (userIds: string[]) => Promise<ProfileData[]>;
  updateLocalUserProfile: (updatedProfile: Partial<ProfileData>) => void;
}

// Minimal zustand-compatible types (keeps shared-core free of a zustand dependency)
export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: boolean
) => void;
export type GetState<T> = () => T;
export type StoreCreator<T> = (set: SetState<T>, get: GetState<T>) => T;

function emptyLabs() {
  return { id: '', name: '', country: '', department: '', institution: '' };
}

// Minimal session type for type safety (Supabase session structure)
interface SessionLike {
  access_token?: string;
  user?: {
    id?: string;
    email?: string;
  };
}

// Flag to prevent concurrent signOut calls
let isSigningOut = false;

export function createAuthStore(adapters: AuthStoreAdapters): StoreCreator<AuthState> {
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
      set({ isLoading: true });

      const { data, error } = await adapters.supabaseAuth.getSession();
      if (error) log?.error('auth.getSession_error', { error });

      let session: SessionLike | null = (data?.session as SessionLike | null) ?? null;
      
      // Check if session exists but token is expired
      if (session?.access_token && isTokenExpired(session.access_token)) {
        log?.info('auth.session_expired_on_init', {});
        // Try to refresh the session
        try {
          const refreshResult = await adapters.supabaseAuth.refreshSession?.();
          const refreshedSession = refreshResult?.data?.session as SessionLike | null | undefined;
          if (refreshedSession?.access_token && !isTokenExpired(refreshedSession.access_token)) {
            session = refreshedSession;
            log?.info('auth.session_refreshed_on_init', {});
          } else {
            // Refresh failed or returned expired token - clear session
            session = null;
            log?.warn('auth.session_refresh_failed_on_init', {});
          }
        } catch (refreshError) {
          log?.warn('auth.session_refresh_error_on_init', { error: refreshError });
          session = null;
        }
      }
      
      set({ session });

      if (session?.user?.id) {
        try {
          await get().fetchUserProfile(session.user.id);
        } catch (e) {
          log?.error('auth.fetchUserProfile_error', { error: e });
        }
      }

      const { data: subData } = adapters.supabaseAuth.onAuthStateChange(
        async (event, newSession) => {
          log?.info('auth.state_change', { event });

          set({ session: newSession as SessionLike | null });

          const ns = newSession as SessionLike | null;
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (ns?.user?.id) {
              try {
                await get().fetchUserProfile(ns.user.id);
              } catch (e) {
                log?.error('auth.fetchUserProfile_error', { error: e });
              }
            }
          } else if (event === 'SIGNED_OUT') {
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
        }
      );

      set({ isLoading: false });

      return () => {
        subData.subscription.unsubscribe();
      };
    },

    getAccessToken: () => get().session?.access_token || null,

    signIn: async (email, password) => {
      set({ isLoading: true });
      try {
        // Sign in with timeout (4 seconds)
        const signInPromise = adapters.supabaseAuth.signInWithPassword({
          email,
          password,
        });
        
        const timeoutPromise = new Promise<{ data: { session: unknown | null; user: unknown | null }; error: Error }>((resolve) => {
          setTimeout(() => resolve({ 
            data: { session: null, user: null }, 
            error: new Error('Sign in timeout - please try again') 
          }), 4000);
        });
        
        const { data, error } = await Promise.race([signInPromise, timeoutPromise]);
        
        if (error) throw error;

        set({ session: (data?.session as SessionLike | null) ?? null });

        const user = (data?.user as SessionLike['user'] | null) ?? null;
        if (user?.id) {
          await get().fetchUserProfile(user.id);
          adapters.analytics.setUserId(user.id);
          adapters.analytics.track('Sign In');
        }
      } finally {
        set({ isLoading: false });
      }
    },

    signOut: async (deviceId: string) => {
      // Prevent concurrent signOut calls
      if (isSigningOut) {
        log?.warn('auth.signOut_already_in_progress');
        return;
      }
      
      isSigningOut = true;
      set({ isLoading: true });
      
      try {
        // Deregister device if needed
        const token = get().getAccessToken();
        if (token && deviceId && adapters.notifications) {
          try {
            await adapters.notifications.deregisterDevice({ deviceId, token });
          } catch (e) {
            log?.warn('auth.deregisterDevice_failed', { error: e });
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
          const timeoutPromise = new Promise<{ error: unknown | null }>((resolve) => {
            setTimeout(() => resolve({ error: new Error('Sign out timeout') }), 4000);
          });
          
          await Promise.race([signOutPromise, timeoutPromise]);
        } catch (supabaseError) {
          log?.warn('auth.signOut_supabase_error', { error: supabaseError });
          // Continue even if Supabase sign out fails - we've cleared local state
        }
      } catch (error) {
        log?.error('auth.signOut_unexpected_error', { error });
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
      } finally {
        set({ isLoading: false });
        isSigningOut = false;
      }
    },

    registerUser: async (data) => {
      const { email, password, userData, labData } = data;

      const { data: authData, error } = await adapters.supabaseAuth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.firstName,
            last_name: userData?.lastName,
          },
          // Email verification disabled (matches current mobile behavior)
          emailRedirectTo: undefined,
        },
      });

      if (error) throw error;

      const user = (authData?.user as SessionLike['user'] | null) ?? null;
      const session = (authData?.session as SessionLike | null) ?? null;

      if (user?.id) {
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

    updateRegistrationData: (data) =>
      set((state) => ({
        registrationData: { ...state.registrationData, ...data },
      })),

    setCurrentStep: (step) => set({ currentStep: step }),

    setLabData: (data) => set({ labData: data }),

    setIsLabRegistered: (value) => set({ isLabRegistered: value }),

    fetchUserProfile: async (userId) => {
      const profile = await adapters.profiles.fetchUserProfile(userId);
      // Normalize labs nullability defensively
      const labs = (profile as any).labs ?? emptyLabs();
      const normalized: ProfileData = {
        ...(profile as any),
        labs: Array.isArray(labs) ? (labs[0] ?? emptyLabs()) : labs,
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

