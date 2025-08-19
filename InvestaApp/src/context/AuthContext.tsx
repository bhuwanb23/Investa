import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Set api default header
        api.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔐 Starting login process for:', email);
      setIsLoading(true);
      
      const response = await api.post('auth/login/', {
        username: email, // Django expects 'username' field
        password: password
      });

      console.log('✅ Login API response:', response.data);
      const { token: authToken, user_id, username, email: userEmail, profile } = response.data;
      
      // Create user object from response data
      const userData = {
        id: user_id,
        username: username,
        email: userEmail,
        profile: profile
      };
      
      console.log('👤 Created user data:', userData);
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      console.log('💾 Stored data in AsyncStorage');
      
      // Set api default header
      api.defaults.headers.common['Authorization'] = `Token ${authToken}`;
      
      // Update state
      setToken(authToken);
      setUser(userData);
      
      console.log('🎉 Login successful, state updated');
      
      return { success: true, message: 'Login successful!' };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: error.config
      });
      
      if (error.response?.data?.non_field_errors) {
        return { success: false, message: error.response.data.non_field_errors[0] };
      } else if (error.response?.status === 400) {
        return { success: false, message: 'Invalid credentials. Please try again.' };
      } else if (error.response?.status === 500) {
        return { success: false, message: 'Server error. Please try again later.' };
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        return { success: false, message: 'Network error. Please check your connection and try again.' };
      } else {
        return { success: false, message: `Error: ${error.message || 'Unknown error occurred'}` };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      // Clear api header
      delete api.defaults.headers.common['Authorization'];
      
      // Clear state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
