import api, { ApiResponse, ApiError, handleApiError } from './api';

// Types for Profile API
export interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
}

export interface UserProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  avatar?: string;
  phone_number?: string;
  preferred_language?: Language;
  learning_goal?: string;
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
  investment_experience: 'beginner' | 'intermediate' | 'advanced';
  date_of_birth?: string;
  level: number;
  experience_points: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  phone_number?: string;
  preferred_language?: number;
  learning_goal?: string;
  risk_profile?: 'conservative' | 'moderate' | 'aggressive';
  investment_experience?: 'beginner' | 'intermediate' | 'advanced';
  date_of_birth?: string;
}

export interface CompleteProfileData {
  phone_number: string;
  preferred_language: number;
  learning_goal: string;
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
  investment_experience: 'beginner' | 'intermediate' | 'advanced';
  date_of_birth: string;
}

// Profile API Service
export const profileApi = {
  // Get current user's profile
  getMyProfile: async (): Promise<ApiResponse<UserProfile>> => {
    try {
      const response = await api.get('profiles/my_profile/');
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update user profile
  updateProfile: async (data: ProfileUpdateData): Promise<ApiResponse<UserProfile>> => {
    try {
      const response = await api.patch('profiles/update_profile/', data);
      return {
        data: response.data,
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Complete profile setup
  completeProfile: async (data: CompleteProfileData): Promise<ApiResponse<UserProfile>> => {
    try {
      const response = await api.post('profiles/complete_profile/', data);
      return {
        data: response.data,
        success: true,
        message: 'Profile completed successfully',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Upload avatar
  uploadAvatar: async (file: any): Promise<ApiResponse<{ avatar: string }>> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.patch('profiles/update_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        data: { avatar: response.data.avatar },
        success: true,
        message: 'Avatar uploaded successfully',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get available languages
  getLanguages: async (): Promise<ApiResponse<Language[]>> => {
    try {
      const response = await api.get('languages/');
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Test profile API connection
  testConnection: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get('profiles/my_profile/');
      return {
        data: response.data,
        success: true,
        message: 'Profile API connection successful',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default profileApi;
