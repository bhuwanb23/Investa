// Configuration file for the Investa app
import { Platform } from 'react-native';
let Constants: any = {};
try {
  // Optional import – if expo-constants is not available, fall back to sane defaults
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Constants = require('expo-constants');
} catch (_) {
  Constants = {};
}

function resolveDevHost(): string | null {
  // Expo SDK 49/50: hostUri like "192.168.1.10:19000"
  const hostUri: string | undefined = Constants?.expoConfig?.hostUri || Constants?.manifest2?.extra?.expoClient?.hostUri || Constants?.manifest?.debuggerHost;
  if (hostUri && typeof hostUri === 'string') {
    const host = hostUri.split(':')[0];
    if (host) return host;
  }
  return null;
}

function resolveBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl : envUrl + '/';
  }

  if (__DEV__) {
    const host = resolveDevHost();
    if (host) {
      return `http://${host}:8000/api/`;
    }
    if (Platform.OS === 'android') {
      // Android emulator special localhost
      return 'http://10.0.2.2:8000/api/';
    }
    // iOS simulator / web fallback
    return 'http://127.0.0.1:8000/api/';
  }

  // Production default (replace with your domain for real deployments)
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
