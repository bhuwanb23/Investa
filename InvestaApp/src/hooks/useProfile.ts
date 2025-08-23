import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import profileApi, { UserProfile, ProfileUpdateData, CompleteProfileData, Language } from '../services/profileApi';
import { ApiError } from '../services/api';

interface UseProfileReturn {
  profile: UserProfile | null;
  languages: Language[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  completeProfile: (data: CompleteProfileData) => Promise<boolean>;
  uploadAvatar: (file: any) => Promise<boolean>;
  fetchLanguages: () => Promise<void>;
  clearError: () => void;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await profileApi.getMyProfile();
      setProfile(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      console.error('Error fetching profile:', apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      const response = await profileApi.updateProfile(data);
      setProfile(response.data);
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error updating profile:', apiError);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const completeProfile = useCallback(async (data: CompleteProfileData): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      const response = await profileApi.completeProfile(data);
      setProfile(response.data);
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error completing profile:', apiError);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: any): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      const response = await profileApi.uploadAvatar(file);
      
      // Update the profile with new avatar
      if (profile) {
        setProfile({
          ...profile,
          avatar: response.data.avatar,
        });
      }
      
      if (response.message) {
        Alert.alert('Success', response.message);
      }
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error uploading avatar:', apiError);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [profile]);

  const fetchLanguages = useCallback(async () => {
    try {
      setError(null);
      const response = await profileApi.getLanguages();
      setLanguages(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      console.error('Error fetching languages:', apiError);
    }
  }, []);

  return {
    profile,
    languages,
    isLoading,
    isUpdating,
    error,
    fetchProfile,
    updateProfile,
    completeProfile,
    uploadAvatar,
    fetchLanguages,
    clearError,
  };
};
