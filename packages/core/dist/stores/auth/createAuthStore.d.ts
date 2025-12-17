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
    deregisterDevice(params: {
        deviceId: string;
        token: string;
    }): Promise<void>;
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
export type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
export type GetState<T> = () => T;
export type StoreCreator<T> = (set: SetState<T>, get: GetState<T>) => T;
export declare function createAuthStore(adapters: AuthStoreAdapters): StoreCreator<AuthState>;
//# sourceMappingURL=createAuthStore.d.ts.map