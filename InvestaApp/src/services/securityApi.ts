import api, { ApiResponse, handleApiError } from './api';

export interface SecuritySettingsData {
  id?: number;
  biometric_enabled?: boolean;
  session_timeout?: number;
  login_notifications?: boolean;
  suspicious_activity_alerts?: boolean;
  two_factor_enabled?: boolean;
  two_factor_secret?: string;
  backup_codes?: string[];
  recovery_email?: string;
  last_password_change?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserSessionData {
  id: number;
  session_key: string;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
  created_at: string;
  last_activity: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  uri: string;
  backup_codes: string[];
}

export const securityApi = {
  getSettings: async (): Promise<ApiResponse<SecuritySettingsData>> => {
    try {
      const response = await api.get('security-settings/my_settings/');
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateSettings: async (data: Partial<SecuritySettingsData>): Promise<ApiResponse<SecuritySettingsData>> => {
    try {
      const response = await api.patch('security-settings/update_settings/', data);
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  changePassword: async (old_password: string, new_password: string): Promise<ApiResponse<void>> => {
    try {
      await api.post('security-settings/change_password/', { old_password, new_password });
      return { data: undefined, success: true, message: 'Password changed successfully' };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  setup2FA: async (): Promise<ApiResponse<TwoFactorSetupResponse>> => {
    try {
      const response = await api.post('security-settings/setup_2fa/');
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  verify2FA: async (code: string): Promise<ApiResponse<{ two_factor_enabled: boolean }>> => {
    try {
      const response = await api.post('security-settings/verify_2fa/', { code });
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  disable2FA: async (password: string): Promise<ApiResponse<{ two_factor_enabled: boolean }>> => {
    try {
      const response = await api.post('security-settings/disable_2fa/', { password });
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSessions: async (): Promise<ApiResponse<UserSessionData[]>> => {
    try {
      const response = await api.get('sessions/');
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteSession: async (sessionId: number): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`sessions/${sessionId}/`);
      return { data: undefined, success: true, message: 'Session terminated' };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logoutAllDevices: async (): Promise<ApiResponse<void>> => {
    try {
      await api.post('sessions/logout_all_devices/');
      return { data: undefined, success: true, message: 'Logged out from all devices' };
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default securityApi;
