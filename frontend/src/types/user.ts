export interface UsageStats {
  totalScans: number;
  scanThisMonth: number;
  lastScanDate: string | null;
  exportsCount: number;
  apiCallsCount: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  role: 'user' | 'pro' | 'admin';
  usageStats: UsageStats;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
