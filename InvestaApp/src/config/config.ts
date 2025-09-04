// Configuration file for the Investa app
import { Platform } from 'react-native';

function resolveBaseUrl(): string {
  // Prefer explicit env var if provided
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  if (envUrl) return envUrl.endsWith('/') ? envUrl : envUrl + '/';

  // Development: use localhost directly to avoid Expo host detection issues
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emulator special localhost
      return 'http://10.0.2.2:8000/api/';
    }
    // iOS simulator / web
    return 'http://127.0.0.1:8000/api/';
  }

  // Production default (adjust for real deployments)
  return 'http://127.0.0.1:8000/api/';
}

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: resolveBaseUrl(),
    TIMEOUT: 10000,
  },
  
  // App Configuration
  APP: {
    NAME: 'Investa',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@investa.com',
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_GOOGLE_SIGNIN: false,
    ENABLE_BIOMETRIC_AUTH: false,
    ENABLE_PUSH_NOTIFICATIONS: false,
  },
};

export default CONFIG;
