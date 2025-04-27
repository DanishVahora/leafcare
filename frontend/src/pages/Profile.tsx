import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Profile, ProfileUpdateRequest } from '@/types/profile.types';
import { profileService } from '@/services/profile.service';
import { Loader2, User, Camera, Mail, Phone, MapPin, FileText, Shield } from 'lucide-react';
import Layout from '@/Layout/Layout';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageLoading(true);
      const photoUrl = await profileService.uploadProfileImage(file);
      setProfile(prev => prev ? { ...prev, photo: photoUrl } : null);
      toast.success('Profile image updated successfully');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const { firstName, lastName, phone } = profile;
      await profileService.updateProfile({ firstName, lastName, phone });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 rounded-lg">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        <Card className="border border-green-100 shadow-sm">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="text-2xl font-semibold text-gray-800">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-green-100">
                    {profile?.photo ? (
                      <AvatarImage src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} />
                    ) : (
                      <AvatarFallback className="bg-green-200 text-green-700 text-2xl">
                        {profile?.firstName?.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="profile-image" className="cursor-pointer p-2 bg-white rounded-full border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                      <Camera className="h-5 w-5" />
                      <Input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageLoading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {imageLoading && (
                  <div className="flex items-center text-sm text-green-600">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading image...
                  </div>
                )}
              </div>

              <div className="space-y-6 flex-1">
                <div className="text-center md:text-left mb-4">
                  <h2 className="text-xl font-medium text-gray-800">
                    {profile ? `${profile.firstName} ${profile.lastName}` : 'Plant Caretaker'}
                  </h2>
                  <p className="text-gray-500 text-sm">{profile?.email || 'user@leafcare.com'}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-sm text-gray-600">
                  <p>Complete your profile to get personalized plant care recommendations and more accurate disease detection results.</p>
                </div>

                {profile?.role === 'pro' && (
                  <div className="flex items-center bg-green-100 p-3 rounded-lg text-green-800">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="font-medium">Pro Member</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="firstName" className="flex items-center text-gray-700 font-medium">
                  <User className="h-4 w-4 mr-2 text-green-500" />
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profile?.firstName || ''}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                  placeholder="Your first name"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="lastName" className="flex items-center text-gray-700 font-medium">
                  <User className="h-4 w-4 mr-2 text-green-500" />
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profile?.lastName || ''}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                  placeholder="Your last name"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="flex items-center text-gray-700 font-medium">
                  <Mail className="h-4 w-4 mr-2 text-green-500" />
                  Email
                </label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-50 border-gray-200 text-gray-500"
                  placeholder="Your email"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="phone" className="flex items-center text-gray-700 font-medium">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={profile?.phone || ''}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                  placeholder="Your phone number"
                />
              </div>

              {/* Usage Statistics Section */}
              <div className="md:col-span-2 bg-gray-50 p-5 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-500" />
                  Usage Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border border-green-100">
                    <p className="text-sm text-gray-500">Scans This Month</p>
                    <p className="text-xl font-medium text-gray-800">{profile?.usageStats?.scansThisMonth || 0}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-100">
                    <p className="text-sm text-gray-500">Total Scans</p>
                    <p className="text-xl font-medium text-gray-800">{profile?.usageStats?.totalScans || 0}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-100">
                    <p className="text-sm text-gray-500">Last Scan</p>
                    <p className="text-xl font-medium text-gray-800">
                      {profile?.usageStats?.lastScanDate ? 
                        new Date(profile.usageStats.lastScanDate).toLocaleDateString() : 
                        'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile Changes'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}