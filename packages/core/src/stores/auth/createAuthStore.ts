import type { AnalyticsAdapter } from '../../adapters/AnalyticsAdapter';
import type { SupabaseAuthAdapter } from '../../adapters/SupabaseAdapter';
import type { Logger } from '../../utils/logger';
import type { LabData, ProfileData, RegistrationData, RegistrationStep } from './authTypes';

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

      const session: any = data?.session ?? null;
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
          set({ session: newSession as any });

          const ns: any = newSession as any;
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (ns?.user?.id) {
              try {
                await get().fetchUserProfile(ns.user.id);
              } catch (e) {
                log?.error('auth.fetchUserProfile_error', { error: e });
              }
            }
          } else if (event === 'SIGNED_OUT') {
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
        const { data, error } = await adapters.supabaseAuth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        set({ session: (data as any)?.session ?? null });

        const user: any = (data as any)?.user ?? null;
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
      set({ isLoading: true });
      try {
        const token = get().getAccessToken();
        if (token && deviceId && adapters.notifications) {
          try {
            await adapters.notifications.deregisterDevice({ deviceId, token });
          } catch (e) {
            log?.warn('auth.deregisterDevice_failed', { error: e });
          }
        }

        const { error } = await adapters.supabaseAuth.signOut();
        if (error) throw error;

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
      } finally {
        set({ isLoading: false });
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

      const user: any = (authData as any)?.user ?? null;
      const session: any = (authData as any)?.session ?? null;

      if (user?.id) {
        await adapters.profiles.upsertProfile({
          userId: user.id,
          email: user.email,
          userData,
          labData,
        });

        set({
          userProfile: {
            id: user.id,
            first_name: userData?.firstName ?? '',
            last_name: userData?.lastName ?? '',
            phone_number: userData?.phoneNumber ?? '',
            email: user.email ?? '',
            role: labData?.role ?? '',
            lab_id: labData?.id ?? '',
            labs: {
              id: labData?.id ?? '',
              name: labData?.name ?? '',
              country: labData?.country ?? '',
              department: labData?.department ?? '',
              institution: labData?.institution ?? '',
            },
          },
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

