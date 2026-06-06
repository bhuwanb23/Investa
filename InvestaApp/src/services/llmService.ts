import api from './api';

export interface TutorResponse {
  response: string | null;
  detail?: string;
}

const llmService = {
  async sendTutorMessage(message: string, lessonContext?: string): Promise<TutorResponse> {
    const payload: Record<string, string> = { message };
    if (lessonContext) {
      payload.lesson_context = lessonContext;
    }
    const response = await api.post('/api/ai/tutor/', payload);
    return response.data;
  },
};

export default llmService;
