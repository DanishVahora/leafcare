import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  ChevronRight, 
  Activity, 
  Calendar, 
  Download, 
  Code, 
  Shield, 
  CheckCircle
} from 'lucide-react';
import Layout from '../Layout/Layout';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';
import { UsageStats } from '@/types/user';

interface Subscription {
  _id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  features: {
    unlimitedScans: boolean;
    advancedAnalytics: boolean;
    dataExport: boolean;
    historicalData: boolean;
    premiumSupport: boolean;
    apiAccess: boolean;
  };
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
  authProviders: Array<{
    provider: string;
    providerId: string;
  }>;
  subscription: Subscription | null;
  usageStats: {
    totalScans: number;
    scanThisMonth: number;
    lastScanDate: string | null;
    exportsCount: number;
    apiCallsCount: number;
  };
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ProfilePage: React.FC = () => {
  const { user: authUser, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<Subscription | null>(null);

  // Format date to local string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load user data
  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email
        });

        // If user has subscription, fetch details
        if (response.data.subscription) {
          const subResponse = await axios.get(`${API_URL}/subscriptions/${response.data.subscription}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSubscriptionDetails(subResponse.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      setIsUploading(true);
      let photoUrl = user?.photo;

      // Upload photo if changed
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        
        const uploadResponse = await axios.post(`${API_URL}/users/upload-photo`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        photoUrl = uploadResponse.data.photoUrl;
      }

      // Update user profile
      const response = await axios.put(`${API_URL}/users/profile`, {
        ...formData,
        photo: photoUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      updateUser({
        ...authUser,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        photo: response.data.photo
      });
      
      setEditMode(false);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  // Determine if user has pro features
  const isPro = user?.role === 'pro' || user?.role === 'admin';
  
  // Calculate scan limit based on user role
  const getScanLimit = () => {
    if (user?.role === 'admin' || 
        (subscriptionDetails?.features.unlimitedScans)) {
      return Infinity;
    }
    return user?.role === 'pro' ? 500 : 50;  // Example limits
  };

  const scanLimit = getScanLimit();
  const scanPercentage = scanLimit === Infinity ? 
    0 : // Don't show percentage for unlimited
    Math.min((user?.usageStats.scanThisMonth || 0) / scanLimit * 100, 100);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="rounded-full h-32 w-32" />
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-red-500 mb-4">
                <X className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700"
              >
                Try Again
              </Button>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Profile Header */}
          <motion.div 
            variants={item}
            className="bg-white rounded-2xl shadow-md overflow-hidden mb-8"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-32" />
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative -mt-16">
                  {editMode ? (
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                        <AvatarImage src={photoPreview || user?.photo} />
                        <AvatarFallback className="bg-green-100 text-green-800 text-3xl">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <label 
                          htmlFor="photo-upload" 
                          className="cursor-pointer text-white p-2 rounded-full hover:bg-black/20"
                        >
                          <Edit className="h-6 w-6" />
                          <input 
                            id="photo-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handlePhotoChange} 
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={user?.photo} />
                      <AvatarFallback className="bg-green-100 text-green-800 text-3xl">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  {editMode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full"
                          disabled={user?.authProviders?.some(p => p.provider !== 'email')}
                        />
                        {user?.authProviders?.some(p => p.provider !== 'email') && (
                          <p className="text-xs text-gray-500 mt-1">
                            Email cannot be changed for accounts linked with external providers.
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isUploading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={isUploading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isUploading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0-4.418 3.582-8 8-8v4c-2.209 0-4 1.791-4 4 0 2.209 1.791 4 4 4v4a7.962 7.962 0 01-5.291-2.709"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <h2 className="text-2xl font-bold">
                          {user?.firstName} {user?.lastName}
                        </h2>
                        <Badge variant={isPro ? "default" : "secondary"}>
                          {user?.role.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{user?.email}</p>
                      <Button
                        onClick={() => setEditMode(true)}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats & Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usage Stats */}
            <motion.div variants={item}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-green-600" />
                  Usage Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Scans This Month</span>
                      <span className="text-sm font-medium">
                        {user?.usageStats.scanThisMonth || 0} / {scanLimit === Infinity ? '∞' : scanLimit}
                      </span>
                    </div>
                    {scanLimit !== Infinity && (
                      <Progress value={scanPercentage} className="h-2" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Scans</p>
                      <p className="text-xl font-semibold">{user?.usageStats.totalScans || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Scan</p>
                      <p className="text-sm font-medium">{formatDate(user?.usageStats.lastScanDate ?? null)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Account Info */}
            <motion.div variants={item}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5 text-green-600" />
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{formatDate(user?.createdAt ?? null)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Authentication Providers</p>
                    <div className="flex gap-2 mt-1">
                      {user?.authProviders?.map(provider => (
                        <Badge key={provider.provider} variant="outline">
                          {provider.provider}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

function updateUser(arg0: { firstName: any; lastName: any; photo: any; _id?: string | undefined; email?: string | undefined; role?: "user" | "pro" | "admin" | undefined; usageStats?: UsageStats | undefined; createdAt?: string | undefined; }) {
    throw new Error('Function not implemented.');
}
