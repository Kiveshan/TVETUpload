export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  providerName: string;
  contactNumber?: string;
}
