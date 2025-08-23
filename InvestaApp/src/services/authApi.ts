import api, { ApiResponse, ApiError, handleApiError } from './api';

// Types for Auth API
export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
  email: string;
  profile?: any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: any;
}

// Auth API Service
export const authApi = {
  // Login user
  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post('auth/login/', data);
      return {
        data: response.data,
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Register user
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post('auth/register/', data);
      return {
        data: response.data,
        success: true,
        message: 'Registration successful',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get current user info
  getMe: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get('auth/me/');
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Logout user
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      await api.post('auth/logout/');
      return {
        data: undefined,
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Change password
  changePassword: async (data: { old_password: string; new_password: string }): Promise<ApiResponse<void>> => {
    try {
      await api.post('auth/change-password/', data);
      return {
        data: undefined,
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    try {
      await api.post('auth/password-reset/', { email });
      return {
        data: undefined,
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Confirm password reset
  confirmPasswordReset: async (data: { token: string; new_password: string }): Promise<ApiResponse<void>> => {
    try {
      await api.post('auth/password-reset/confirm/', data);
      return {
        data: undefined,
        success: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Test authentication
  testAuth: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get('auth/me/');
      return {
        data: response.data,
        success: true,
        message: 'Authentication test successful',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default authApi;
