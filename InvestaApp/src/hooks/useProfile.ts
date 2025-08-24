import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import profileApi, { UserProfile, ProfileUpdateData, CompleteProfileData, Language } from '../services/profileApi';
import { ApiError } from '../services/api';

/*
 * DEVELOPMENT MODE PROFILE
 * 
 * This hook is currently set to use fake profile data for development.
 * To switch back to real backend profile fetching:
 * 
 * 1. Set USE_FAKE_PROFILE = false in this file
 * 2. Make sure your Django backend is running
 * 3. Ensure the profile API endpoints are working
 */

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
  
  // Development mode: use fake profile data
  const USE_FAKE_PROFILE = true; // Set to false when backend is ready

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (USE_FAKE_PROFILE) {
        // Development mode: return fake profile data
        console.log('🔐 useProfile: Using fake profile data for development');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const fakeProfile: UserProfile = {
          id: 1,
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User'
          },
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
          phone_number: '+1234567890',
          date_of_birth: '1990-01-01',
          investment_experience: 'beginner',
          preferred_language: {
            id: 1,
            name: 'English',
            code: 'en',
            native_name: 'English'
          },
          learning_goal: 'Master investment fundamentals',
          level: 3,
          experience_points: 1250,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        };
        
        setProfile(fakeProfile);
        console.log('🔐 useProfile: Fake profile data set successfully');
      } else {
        // Production mode: fetch from real API
        const response = await profileApi.getMyProfile();
        setProfile(response.data);
      }
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
      
      if (USE_FAKE_PROFILE) {
        // Development mode: simulate profile update
        console.log('🔐 useProfile: Simulating profile update with fake data');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update the fake profile with new data
        if (profile) {
          const updatedProfile = {
            ...profile,
            ...data,
            updated_at: new Date().toISOString()
          };
          setProfile(updatedProfile);
          console.log('🔐 useProfile: Fake profile updated successfully');
        }
        
        Alert.alert('Success', 'Profile updated successfully (development mode)');
        return true;
      } else {
        // Production mode: use real API
        const response = await profileApi.updateProfile(data);
        setProfile(response.data);
        
        if (response.message) {
          Alert.alert('Success', response.message);
        }
        
        return true;
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error updating profile:', apiError);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [profile]);

  const completeProfile = useCallback(async (data: CompleteProfileData): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      
      if (USE_FAKE_PROFILE) {
        // Development mode: simulate profile completion
        console.log('🔐 useProfile: Simulating profile completion with fake data');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update the fake profile with completion data
        if (profile) {
          const completedProfile = {
            ...profile,
            ...data,
            updated_at: new Date().toISOString()
          };
          setProfile(completedProfile);
          console.log('🔐 useProfile: Fake profile completed successfully');
        }
        
        Alert.alert('Success', 'Profile completed successfully (development mode)');
        return true;
      } else {
        // Production mode: use real API
        const response = await profileApi.completeProfile(data);
        setProfile(response.data);
        
        if (response.message) {
          Alert.alert('Success', response.message);
        }
        
        return true;
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error completing profile:', apiError);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [profile]);

  const uploadAvatar = useCallback(async (file: any): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      
      if (USE_FAKE_PROFILE) {
        // Development mode: simulate avatar upload
        console.log('🔐 useProfile: Simulating avatar upload with fake data');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update the fake profile with new avatar
        if (profile) {
          const newAvatarUrl = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';
          setProfile({
            ...profile,
            avatar: newAvatarUrl,
            updated_at: new Date().toISOString()
          });
          console.log('🔐 useProfile: Fake avatar updated successfully');
        }
        
        Alert.alert('Success', 'Avatar uploaded successfully (development mode)');
        return true;
      } else {
        // Production mode: use real API
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
      }
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
      
      if (USE_FAKE_PROFILE) {
        // Development mode: return fake language data
        console.log('🔐 useProfile: Using fake language data for development');
        
        const fakeLanguages: Language[] = [
          { id: 1, name: 'English', code: 'en', native_name: 'English' },
          { id: 2, name: 'Spanish', code: 'es', native_name: 'Español' },
          { id: 3, name: 'French', code: 'fr', native_name: 'Français' },
          { id: 4, name: 'German', code: 'de', native_name: 'Deutsch' },
          { id: 5, name: 'Chinese', code: 'zh', native_name: '中文' }
        ];
        
        setLanguages(fakeLanguages);
        console.log('🔐 useProfile: Fake languages set successfully');
      } else {
        // Production mode: fetch from real API
        const response = await profileApi.getLanguages();
        setLanguages(response.data);
      }
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
