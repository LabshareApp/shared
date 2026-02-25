export interface LabMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

/** A lab the user belongs to, returned by GET /my-labs */
export interface UserLab {
  labId: string;
  labName: string;
  roleName: string;
  displayRole: string;
  isAdmin: boolean;
}

/** Request body for POST /switch-lab */
export interface SwitchLabRequest {
  labId: string;
}

/** Response from POST /switch-lab */
export interface SwitchLabResponse {
  labId: string;
  labName: string;
}
