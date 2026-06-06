import api from './api';

export interface AISettingsData {
  provider: 'ollama' | 'openai' | 'gemini';
  ollama_endpoint: string;
  ollama_model: string;
  created_at?: string;
  updated_at?: string;
}

const aiSettingsApi = {
  async getSettings(): Promise<AISettingsData> {
    const response = await api.get('/api/ai/settings/');
    return response.data;
  },

  async updateSettings(data: Partial<AISettingsData>): Promise<AISettingsData> {
    const response = await api.put('/api/ai/settings/', data);
    return response.data;
  },
};

export default aiSettingsApi;
