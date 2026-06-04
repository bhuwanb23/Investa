import api, { ApiResponse, handleApiError } from './api';

export interface PrivacySettingsData {
  id?: number;
  profile_visibility?: boolean;
  activity_visibility?: boolean;
  data_sharing?: boolean;
  location_sharing?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const privacyApi = {
  getSettings: async (): Promise<ApiResponse<PrivacySettingsData>> => {
    try {
      const response = await api.get('privacy-settings/my_settings/');
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateSettings: async (data: Partial<PrivacySettingsData>): Promise<ApiResponse<PrivacySettingsData>> => {
    try {
      const response = await api.patch('privacy-settings/update_settings/', data);
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  exportData: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get('privacy-settings/export_data/');
      return { data: response.data, success: true };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteAccount: async (password: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete('privacy-settings/delete_account/', { data: { password } });
      return { data: undefined, success: true, message: 'Account deleted' };
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default privacyApi;
