import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, api } from '../services';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile?: any;
  security_settings?: any;
  privacy_settings?: any;
  learning_progress?: any;
  trading_performance?: any;
}

export interface LoginResponseBundle {
  token: string;
  user_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile?: any;
  security_settings?: any;
  privacy_settings?: any;
  learning_progress?: any;
  trading_performance?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
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
        api.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({
        username: email,
        password: password,
      });

      const bundle: LoginResponseBundle = response.data;
      const {
        token: authToken,
        user_id,
        username,
        email: userEmail,
        first_name,
        last_name,
        profile,
        security_settings,
        privacy_settings,
        learning_progress,
        trading_performance,
      } = bundle;

      const userData: User = {
        id: user_id,
        username,
        email: userEmail,
        first_name,
        last_name,
        profile,
        security_settings,
        privacy_settings,
        learning_progress,
        trading_performance,
      };

      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      api.defaults.headers.common['Authorization'] = `Token ${authToken}`;

      setToken(authToken);
      setUser(userData);

      return { success: true, message: 'Login successful!' };
    } catch (error: any) {
      const friendly = (msg: string) => ({ success: false, message: msg });
      if (error?.response?.data?.non_field_errors) {
        return friendly(error.response.data.non_field_errors[0]);
      }
      const status = error?.response?.status;
      if (status === 400) return friendly('Invalid credentials. Please try again.');
      if (status === 401) return friendly('Unauthorized. Please check your credentials.');
      if (status === 500) return friendly('Server error. Please try again later.');

      const code = error?.code || '';
      const msg = (error?.message || '').toLowerCase();
      if (code === 'ECONNABORTED' || msg.includes('timeout')) {
        return friendly('Request timed out. Please try again.');
      }
      if (code === 'ERR_NETWORK' || msg.includes('network error')) {
        return friendly('Cannot reach server. Ensure the backend is running and your device is on the same network.');
      }

      return friendly('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
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
