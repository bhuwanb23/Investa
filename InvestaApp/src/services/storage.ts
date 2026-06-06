import { Platform } from 'react-native';

const webStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try { localStorage.setItem(key, value); } catch { /* quota exceeded */ }
  },
  removeItem: async (key: string): Promise<void> => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  },
  clear: async (): Promise<void> => {
    try { localStorage.clear(); } catch { /* ignore */ }
  },
  getAllKeys: async (): Promise<string[]> => {
    try { return Object.keys(localStorage); } catch { return []; }
  },
  multiRemove: async (keys: string[]): Promise<void> => {
    try { keys.forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ }
  },
  flushGetRequests: () => {},
};

let storage: any;
try {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  storage = AsyncStorage;
} catch {
  storage = webStorage;
}

if (Platform.OS === 'web') {
  storage = webStorage;
}

export default storage;
