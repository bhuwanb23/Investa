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


