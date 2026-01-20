export interface ProfileData {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    role: string;
    lab_id: string;
    labs: {
        id: string;
        name: string;
        country: string;
        department: string;
        institution: string;
    };
}
export interface UserData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
export interface LabData {
    id?: string;
    name?: string;
    institution?: string;
    department?: string;
    country?: string;
    building_address?: string;
    floor_number?: string;
    role?: string;
}
export interface RegistrationData {
    email: string;
    password: string;
    userData: UserData | null;
    labData: LabData | null;
}
/**
 * Invitation data stored during the signup flow when user clicks an invite link
 */
export interface InvitationData {
    inviteCode: string;
    email: string;
    labId: string;
    labName: string;
    roleId: string;
    roleName: string;
    displayRole: string;
    inviterName: string;
}
export type RegistrationStep = 'login' | 'register' | 'joinLab' | 'setupLab' | 'verifyInvite' | 'finalizeSignup';
//# sourceMappingURL=authTypes.d.ts.map