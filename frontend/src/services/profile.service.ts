import api from './api';
import { Profile, ProfileUpdateRequest } from '../types/profile.types';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await api.get('/users/me');
      return response.data.user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<Profile> => {
    try {
      const response = await api.patch('/users/update-profile', data);
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      
      // Important: Use 'photoUrl' as the field name to match what the backend expects
      formData.append('photoUrl', file);
      
      // Override the Content-Type header for this specific request
      const response = await api.patch('/users/update-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data.user.photo;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
};