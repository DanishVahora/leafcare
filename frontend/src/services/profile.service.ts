import api from './api';
import { Profile, ProfileUpdateRequest } from '../types/profile.types';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await api.get('/users/me');
    return response.data.user;
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<Profile> => {
    const response = await api.patch('/users/update-profile', data);
    return response.data.user;
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    try {
      // First, upload the file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Then update the user's photo URL
      const response = await api.patch('/users/update-avatar', {
        photoUrl: uploadResponse.data.url
      });

      return response.data.user.photo;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
};