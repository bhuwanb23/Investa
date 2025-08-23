import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config/config';

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Configure axios defaults
const api = axios.create({
  baseURL: CONFIG.API.BASE_URL,
  timeout: CONFIG.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helpful runtime log to confirm the base URL being used (dev only)
if (__DEV__) {
  console.log('🔗 API base URL:', CONFIG.API.BASE_URL);
}

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
              if (__DEV__) {
        console.log('🔐 API Request - Token found:', token.substring(0, 10) + '...');
        console.log('🔐 API Request - URL:', config.url);
        console.log('🔐 API Request - Headers:', JSON.stringify(config.headers, null, 2));
        console.log('🔐 API Request - Method:', config.method);
        console.log('🔐 API Request - Full Authorization header:', config.headers.Authorization);
      }
      } else {
        if (__DEV__) {
          console.log('🔐 API Request - No token found');
          console.log('🔐 API Request - URL:', config.url);
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log('🔐 API Response - Status:', response.status);
      console.log('🔐 API Response - URL:', response.config.url);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.log('🔐 API Error - Status:', error.response?.status);
      console.log('🔐 API Error - URL:', error.config?.url);
      console.log('🔐 API Error - Message:', error.message);
      console.log('🔐 API Error - Response:', error.response?.data);
      console.log('🔐 API Error - Headers sent:', error.config?.headers);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        // You can emit an event here to notify the app about logout
        console.log('🔐 Token expired, cleared storage');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Handle different error types
    if (status === 400) {
      return {
        message: data?.message || 'Bad request. Please check your input.',
        status,
        errors: data?.errors || data,
      };
    }
    
    if (status === 401) {
      return {
        message: 'Unauthorized. Please log in again.',
        status,
      };
    }
    
    if (status === 403) {
      return {
        message: 'Access denied. You don\'t have permission for this action.',
        status,
      };
    }
    
    if (status === 404) {
      return {
        message: 'Resource not found.',
        status,
      };
    }
    
    if (status === 500) {
      return {
        message: 'Server error. Please try again later.',
        status,
      };
    }
    
    // Network errors
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out. Please try again.',
      };
    }
    
    if (error.code === 'ERR_NETWORK') {
      return {
        message: 'Network error. Please check your connection.',
      };
    }
  }
  
  return {
    message: error.message || 'An unexpected error occurred.',
  };
};

export default api;
