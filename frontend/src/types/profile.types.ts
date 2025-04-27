export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  phone?: string;
  role: 'user' | 'pro' | 'admin';
  usageStats: UsageStats;
  createdAt: string;
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  bio?: string;
} 