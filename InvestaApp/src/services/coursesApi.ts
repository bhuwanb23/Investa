import api from './api';

export interface CourseLesson {
  id: number;
  title: string;
  content: string;
  video_url: string | null;
  order: number;
  estimated_duration: number;
  is_active: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration: number;
  thumbnail: string | null;
  is_active: boolean;
  lessons: CourseLesson[];
  created_at: string;
  updated_at: string;
}

export interface InProgressCourse {
  course_id: number;
  course_title: string;
  description: string;
  difficulty_level: string;
  estimated_duration: number;
  thumbnail: string | null;
  progress_percentage: number;
  lessons_completed: number;
  total_lessons: number;
  status: 'in_progress' | 'completed' | 'locked';
}

export const coursesApi = {
  async getRecommendedCourses(limit: number = 5): Promise<Course[]> {
    const response = await api.get(`/courses/recommended/?limit=${limit}`);
    return response.data;
  },
};

export default coursesApi;
