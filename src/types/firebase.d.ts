export interface FirebaseUser {
  accessToken?: string;
  auth?: any;
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
  proactiveRefresh?: any;
  providerData: any[];
  providerId: string;
  reloadListener?: any;
  reloadUserInfo?: any;
  stsTokenManager?: {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
  tenantId: string | null;
  uid: string;
}
