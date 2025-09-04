// Configuration file for the Investa app
import { Platform, NativeModules } from 'react-native';

let Constants: any = {};
try {
  // Optional import – if expo-constants is not available, fall back gracefully
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Constants = require('expo-constants');
} catch (_) {
  Constants = {};
}

function parseHost(uri?: string): string | null {
  if (!uri || typeof uri !== 'string') return null;
  const cleaned = uri.replace(/^\w+:\/\//, '');
  const host = cleaned.split(':')[0];
  return host || null;
}

function resolveLanHost(): string | null {
  const hostUri = Constants?.expoConfig?.hostUri
    || Constants?.expoConfig?.debuggerHost
    || Constants?.expoGoConfig?.debuggerHost
    || Constants?.manifest2?.extra?.expoClient?.hostUri
    || Constants?.manifest?.debuggerHost
    || Constants?.linkingUri;
  const host = parseHost(hostUri);
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return host;
  }
  try {
    const scriptURL: string | undefined = (NativeModules as any)?.SourceCode?.scriptURL;
    const fromScript = parseHost(scriptURL);
    if (fromScript && fromScript !== 'localhost' && fromScript !== '127.0.0.1') {
      return fromScript;
    }
  } catch (_) {}
  return null;
}

function resolveBaseUrl(): string {
  // Prefer explicit env var if provided
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  if (envUrl) return envUrl.endsWith('/') ? envUrl : envUrl + '/';

  // Allow specifying only the LAN IP and build the URL automatically
  const envLanIp = process.env.EXPO_PUBLIC_LAN_IP || process.env.LAN_IP;
  if (envLanIp) {
    const normalized = String(envLanIp).replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `http://${normalized}:8000/api/`;
  }

  // Read values from app.json extra if present (works on device without shell env)
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {};
  const extraUrl = extra.apiBaseUrl as string | undefined;
  if (extraUrl) {
    return extraUrl.endsWith('/') ? extraUrl : `${extraUrl}/`;
  }
  const extraLanIp = extra.lanIp as string | undefined;
  if (extraLanIp) {
    const normalized = String(extraLanIp).replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `http://${normalized}:8000/api/`;
  }

  if (__DEV__) {
    const lanHost = resolveLanHost();
    if (lanHost) {
      // Use LAN IP so physical devices can reach the backend
      return `http://${lanHost}:8000/api/`;
    }
    // If we cannot determine a LAN host, prefer emulator defaults only when not on a physical device
    if (Platform.OS === 'android' && !Constants?.isDevice) {
      // Android emulator special localhost
      return 'http://10.0.2.2:8000/api/';
    }
    // Fall back to loopback (works for iOS simulator & web). On physical devices,
    // users should set EXPO_PUBLIC_API_BASE_URL or EXPO_PUBLIC_LAN_IP.
    if (Constants?.isDevice) {
      // Helpful runtime warning to configure LAN IP
      // eslint-disable-next-line no-console
      console.warn('[Investa] Running on a physical device without a resolvable LAN host. Set EXPO_PUBLIC_API_BASE_URL or EXPO_PUBLIC_LAN_IP to your computer\'s IP.');
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
