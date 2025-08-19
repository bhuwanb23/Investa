// Configuration file for the Investa app
export const CONFIG = {
  // API Configuration
  API: {
    // For development - change this to your Django server URL
    BASE_URL: __DEV__ 
      ? 'http://localhost:8000/api/'  // Local development
      : 'http://localhost:8000/api/', // Production (update this)
    
    // Alternative URLs for different setups
    // BASE_URL: 'http://10.0.2.2:8000/api/', // Android emulator localhost
    // BASE_URL: 'http://192.168.1.100:8000/api/', // Local network
    // BASE_URL: 'https://your-production-domain.com/api/', // Production
    
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
