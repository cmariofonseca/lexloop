export interface FirebaseUser {
  accessToken?: string;
  auth?: unknown;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    createdAt?: string;
    lastLoginAt?: string;
    lastSignInTime?: string;
    creationTime?: string;
  };
  phoneNumber: string | null;
  photoURL: string | null;
  proactiveRefresh?: unknown;
  providerData: unknown[];
  providerId: string;
  reloadListener?: unknown;
  reloadUserInfo?: unknown;
  stsTokenManager?: {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
  tenantId: string | null;
  uid: string;
}
