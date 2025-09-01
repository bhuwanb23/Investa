import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, AuthResponse, api } from '../services';

/*
 * DEVELOPMENT MODE AUTHENTICATION
 * 
 * This context is currently set to use fake authentication for development.
 * To switch back to real backend authentication:
 * 
 * 1. Set USE_FAKE_AUTH = false in this file
 * 2. Uncomment the token interceptor code in src/services/api.ts
 * 3. Make sure your Django backend is running on port 8000
 * 4. Update the API base URL in src/config/config.ts
 * 
 * Test credentials for development: test@example.com / test123
 */

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
  // Temporary: offline auth mode to bypass backend
  const USE_FAKE_AUTH = false; // Set to true for development without backend - Set to false when backend is ready

  const checkAuthStatus = async () => {
    try {
      console.log('🔐 AuthContext: Checking auth status...');
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      console.log('🔐 AuthContext: Stored token:', storedToken ? storedToken.substring(0, 20) + '...' : 'None');
      console.log('🔐 AuthContext: Stored user:', storedUser ? 'Found' : 'None');
      
      // Keep fake tokens for development
      if (storedToken === 'dev-token' && __DEV__) {
        console.log('🔐 AuthContext: Found development token, keeping it...');
        const userData = JSON.parse(storedUser || '{}');
        setToken(storedToken);
        setUser(userData);
        return;
      }
      
      // Clear old fake tokens (non-dev environment)
      if (storedToken === 'dev-token' && !__DEV__) {
        console.log('🔐 AuthContext: Found fake token in production, clearing storage...');
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        console.log('🔐 AuthContext: Fake token cleared');
        return;
      }
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Set api default header
        api.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
        console.log('🔐 AuthContext: User authenticated, token set in API headers');
      } else {
        console.log('🔐 AuthContext: No stored auth data found');
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
          console.log('🔐 AuthContext: Fake authentication successful');
          return { success: true, message: 'Login successful.' };
        }
        return { success: false, message: 'Invalid credentials. Please check your email and password.' };
      }

      // Online path (kept for later re-enable)
      try {
        const response = await authApi.login({
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
             } catch (apiError) {
         console.log('❌ API login failed:', apiError);
         throw apiError; // Re-throw the original error
       }
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
      console.log('🔐 AuthContext: Starting logout process');
      
      // Clear stored data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      console.log('🔐 AuthContext: Cleared AsyncStorage');
      
      // Clear api header
      delete api.defaults.headers.common['Authorization'];
      console.log('🔐 AuthContext: Cleared API headers');
      
      // Clear state immediately
      setToken(null);
      setUser(null);
      console.log('🔐 AuthContext: Cleared state, user should now be null');
      
      console.log('🔐 AuthContext: Logout process completed');
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      throw error; // Re-throw to let the calling component handle it
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
