import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config/config';
import { Platform, NativeModules } from 'react-native';

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Configure axios defaults
const api = axios.create({
  baseURL: CONFIG.API.BASE_URL,
  timeout: CONFIG.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dev helper to find Expo LAN host
let ExpoConstants: any = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExpoConstants = require('expo-constants');
} catch (_) {
  ExpoConstants = {};
}

function parseHost(uri?: string): string | null {
  if (!uri || typeof uri !== 'string') return null;
  const cleaned = uri.replace(/^\w+:\/\//, '');
  const host = cleaned.split(':')[0];
  return host || null;
}

function resolveLanHost(): string | null {
  const hostUri = ExpoConstants?.expoConfig?.hostUri
    || ExpoConstants?.manifest2?.extra?.expoClient?.hostUri
    || ExpoConstants?.manifest?.debuggerHost
    || ExpoConstants?.linkingUri;
  const host = parseHost(hostUri);
  if (host && host !== 'localhost' && host !== '127.0.0.1') return host;
  try {
    const scriptURL: string | undefined = (NativeModules as any)?.SourceCode?.scriptURL;
    const fromScript = parseHost(scriptURL);
    if (fromScript && fromScript !== 'localhost' && fromScript !== '127.0.0.1') return fromScript;
  } catch (_) {}
  return null;
}

// Helpful runtime log to confirm the base URL being used (dev only)

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Inject token from storage
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }

    // Logging for development
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function joinUrl(base: string, path: string): string {
  const trimmedBase = base.replace(/\/+$/, '/');
  const trimmedPath = String(path).replace(/^\/+/, '');
  // Avoid double '/api/' if both include it
  if (trimmedBase.endsWith('/api/') && trimmedPath.startsWith('api/')) {
    return trimmedBase + trimmedPath.replace(/^api\//, '');
  }
  return trimmedBase + trimmedPath;
}

// Development-time fallback retry for network errors
async function retryWithAlternateBaseUrls(error: AxiosError) {
  const originalConfig: any = error.config || {};
  if (!__DEV__) throw error;

  // Avoid infinite loops
  originalConfig.__retryHosts = originalConfig.__retryHosts || [];

  const lanHost = resolveLanHost();
  const candidates: string[] = [];

  // Environment-provided URLs/IPs (highest priority)
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL || (process as any)?.env?.API_BASE_URL;
  if (envUrl) {
    const normalized = String(envUrl).endsWith('/') ? String(envUrl) : String(envUrl) + '/';
    candidates.push(normalized);
  }
  const envLanIp = process.env.EXPO_PUBLIC_LAN_IP || (process as any)?.env?.LAN_IP;
  if (envLanIp) {
    const normalizedIp = String(envLanIp).replace(/^https?:\/\//, '').replace(/\/$/, '');
    candidates.push(`http://${normalizedIp}:8000/api/`);
  }

  // Current configured base (for logging), but skip retrying it
  const currentBase = api.defaults.baseURL || CONFIG.API.BASE_URL;

  // Expo LAN host if available
  if (lanHost) candidates.push(`http://${lanHost}:8000/api/`);

  // Emulator/simulator fallbacks
  if (Platform.OS === 'android') candidates.push('http://10.0.2.2:8000/api/');
  // Genymotion default
  if (Platform.OS === 'android') candidates.push('http://10.0.3.2:8000/api/');
  candidates.push('http://127.0.0.1:8000/api/');

  // Ensure current base is last (if different), just in case
  if (currentBase && !candidates.includes(currentBase)) candidates.push(currentBase);

  // Deduplicate and remove already tried
  const tried = new Set<string>(originalConfig.__retryHosts);
  if (currentBase) tried.add(currentBase);
  const nextBase = candidates.find((b) => !tried.has(b));
  if (!nextBase) {
    throw error;
  }

  originalConfig.__retryHosts.push(nextBase);

  // Build next absolute URL
  let path = originalConfig.url || '';
  if (typeof path === 'string' && /^https?:\/\//i.test(path)) {
    try {
      const u = new URL(path);
      path = u.pathname + (u.search || '');
    } catch (_) {
      // keep as-is
    }
  }

  const newUrl = joinUrl(nextBase, path);

  // Fallback retry with alternate base URL

  return api.request({
    ...originalConfig,
    baseURL: undefined, // ensure absolute URL is used
    url: newUrl,
  });
}

// Global callback for auth expiry — set by AuthContext
let _onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (cb: (() => void) | null) => {
  _onUnauthorized = cb;
};

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // API Error logging removed for production

    // Retry on network errors in development
    if (!error.response && (error.code === 'ERR_NETWORK' || (error.message || '').toLowerCase().includes('network error'))) {
      try {
        return await retryWithAlternateBaseUrls(error);
      } catch (e) {
        // fall through to normal handling
      }
    }

    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
      _onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Handle different error types
    if (status === 400) {
      return {
        message: data?.message || 'Bad request. Please check your input.',
        status,
        errors: data?.errors || data,
      };
    }
    
    if (status === 401) {
      return {
        message: 'Unauthorized. Please log in again.',
        status,
      };
    }
    
    if (status === 403) {
      return {
        message: 'Access denied. You don\'t have permission for this action.',
        status,
      };
    }
    
    if (status === 404) {
      return {
        message: 'Resource not found.',
        status,
      };
    }
    
    if (status === 500) {
      return {
        message: 'Server error. Please try again later.',
        status,
      };
    }
    
    // Network errors
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out. Please try again.',
      };
    }
    
    if (error.code === 'ERR_NETWORK') {
      return {
        message: 'Network error. Please check your connection.',
      };
    }
  }
  
  return {
    message: error.message || 'An unexpected error occurred.',
  };
};

export default api;
