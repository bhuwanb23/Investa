// Configuration file for the Investa app
import { Platform, NativeModules } from 'react-native';
let Constants: any = {};
try {
  // Optional import – if expo-constants is not available, fall back to sane defaults
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Constants = require('expo-constants');
} catch (_) {
  Constants = {};
}

function parseHostFromUri(uri?: string): string | null {
  if (!uri || typeof uri !== 'string') return null;
  // Examples: "192.168.1.10:19000", "exp://192.168.1.10:19000", "http://localhost:19000"
  const cleaned = uri.replace(/^\w+:\/\//, '');
  const host = cleaned.split(':')[0];
  return host || null;
}

function resolveDevHost(): string | null {
  // Expo SDK 49/50: hostUri like "192.168.1.10:19000"
  const hostFromExpo = parseHostFromUri(
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoClient?.hostUri ||
    Constants?.manifest?.debuggerHost ||
    Constants?.linkingUri
  );
  if (hostFromExpo) return hostFromExpo;

  // Fallback: parse from JS bundle scriptURL (works in Expo Go / RN dev)
  try {
    const scriptURL: string | undefined = (NativeModules as any)?.SourceCode?.scriptURL;
    const fromScript = parseHostFromUri(scriptURL);
    if (fromScript) return fromScript;
  } catch (_) {
    // ignore
  }
  return null;
}

function resolveBaseUrl(): string {
  const extraUrl = (Constants?.expoConfig?.extra && (
    Constants.expoConfig.extra.EXPO_PUBLIC_API_BASE_URL ||
    (Constants.expoConfig.extra as any).apiBaseUrl
  )) as string | undefined;
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || extraUrl;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl : envUrl + '/';
  }

  if (__DEV__) {
    const host = resolveDevHost();
    if (host) {
      // Android emulator shows localhost; prefer 10.0.2.2 for emulator
      if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
        return 'http://10.0.2.2:8000/api/';
      }
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
  // For development without backend, use a dummy URL
  if (__DEV__) {
    return 'http://localhost:3000/api/'; // Dummy URL for development
  }
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
