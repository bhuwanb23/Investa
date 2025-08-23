import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import authApi, { LoginData, RegisterData } from '../services/authApi';
import { ApiError } from '../services/api';

interface UseAuthApiReturn {
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthApi = (): UseAuthApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (data: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(data);
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Login Error', apiError.message);
      console.error('Error during login:', apiError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.register(data);
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Registration Error', apiError.message);
      console.error('Error during registration:', apiError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error changing password:', apiError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.requestPasswordReset(email);
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error requesting password reset:', apiError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmPasswordReset = useCallback(async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.confirmPasswordReset({
        token,
        new_password: newPassword,
      });
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error confirming password reset:', apiError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    login,
    register,
    changePassword,
    requestPasswordReset,
    confirmPasswordReset,
    clearError,
  };
};
