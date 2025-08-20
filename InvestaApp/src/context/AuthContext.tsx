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
  // Temporary: offline auth mode to bypass backend
  const USE_FAKE_AUTH = true;

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
      
      if (USE_FAKE_AUTH) {
        // Offline: accept one test credential pair
        if (email === 'test@example.com' && password === 'test123') {
          const fakeToken = 'dev-token';
          const userData = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            profile: { plan: 'dev', role: 'tester' },
          };

          await AsyncStorage.setItem('authToken', fakeToken);
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          // Optional header for local API usage elsewhere
          api.defaults.headers.common['Authorization'] = `Token ${fakeToken}`;

          setToken(fakeToken);
          setUser(userData);
          return { success: true, message: 'Login successful (offline).' };
        }
        return { success: false, message: 'Invalid test credentials. Use test@example.com / test123.' };
      }

      // Online path (kept for later re-enable)
      const response = await api.post('auth/login/', {
        username: email,
        password: password,
      });

      console.log('✅ Login API response:', response.data);
      const { token: authToken, user_id, username, email: userEmail, profile } = response.data;

      const userData = {
        id: user_id,
        username: username,
        email: userEmail,
        profile: profile,
      };

      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      api.defaults.headers.common['Authorization'] = `Token ${authToken}`;

      setToken(authToken);
      setUser(userData);

      return { success: true, message: 'Login successful!' };
    } catch (error: any) {
      // Don't spam console in production
      if (__DEV__) {
        console.error('❌ Login error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          config: error.config
        });
      }

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
