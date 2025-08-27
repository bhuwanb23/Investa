import api from '../../../services/api';

export interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
}

export interface Lesson {
  id: number;
  title: string;
  content?: string;
  video_url?: string | null;
  order: number;
  estimated_duration: number;
  is_active: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  language: Language;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number;
  thumbnail?: string | null;
  is_active: boolean;
  lessons?: Lesson[];
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
}

export interface LessonDetail extends Lesson {
  course: Course;
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await api.get('courses/');
  const data = res.data;
  if (Array.isArray(data)) return data as Course[];
  if (data && Array.isArray(data.results)) return data.results as Course[];
  return [];
}

export async function fetchCourseDetail(courseId: number): Promise<CourseDetail> {
  const res = await api.get(`courses/${courseId}/`);
  return res.data as CourseDetail;
}

export async function fetchCourseDetailWithProgress(courseId: number): Promise<CourseDetail> {
  const res = await api.get(`courses/${courseId}/with_progress/`);
  return res.data as CourseDetail;
}

export async function fetchLessonDetail(lessonId: number): Promise<LessonDetail> {
  const res = await api.get(`lessons/${lessonId}/`);
  return res.data as LessonDetail;
}

export async function markLessonCompleted(lessonId: number): Promise<void> {
  await api.post(`lessons/${lessonId}/mark_completed/`, {});
}

// Quiz API functions
export const fetchQuizForLesson = async (lessonId: number) => {
  try {
    const response = await api.get(`quiz/${lessonId}/for_lesson/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz for lesson:', error);
    throw error;
  }
};

export const startQuizAttempt = async (quizId: number) => {
  try {
    const response = await api.post('quiz-attempts/start_quiz/', {
      quiz_id: quizId
    });
    return response.data;
  } catch (error) {
    console.error('Error starting quiz attempt:', error);
    throw error;
  }
};

export const submitQuizAnswer = async (
  attemptId: number, 
  questionId: number, 
  answerId: number | null, 
  textAnswer?: string
) => {
  try {
    const response = await api.post(`quiz-attempts/${attemptId}/submit_answer/`, {
      question_id: questionId,
      answer_id: answerId,
      text_answer: textAnswer || ''
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz answer:', error);
    throw error;
  }
};

export const completeQuizAttempt = async (attemptId: number, timeTaken: number) => {
  try {
    const response = await api.post(`quiz-attempts/${attemptId}/complete_quiz/`, {
      time_taken: timeTaken
    });
    return response.data;
  } catch (error) {
    console.error('Error completing quiz attempt:', error);
    throw error;
  }
};

export const getQuizAttempts = async () => {
  try {
    const response = await api.get('quiz-attempts/my_attempts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    throw error;
  }
};


