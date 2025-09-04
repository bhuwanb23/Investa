import api from './api';

export interface UserProgress {
  id: number;
  user: number;
  total_courses: number;
  completed_courses: number;
  total_lessons: number;
  completed_lessons: number;
  total_quizzes: number;
  completed_quizzes: number;
  average_quiz_score: number;
  total_learning_hours: number;
  portfolio_value: number;
  portfolio_growth_percentage: number;
  total_trades: number;
  successful_trades: number;
  total_profit_loss: number;
  win_rate: number;
  total_badges: number;
  earned_badges: number;
  total_achievements: number;
  earned_achievements: number;
  current_streak_days: number;
  longest_streak_days: number;
  total_activity_days: number;
  experience_points: number;
  current_level: number;
  experience_to_next_level: number;
  learning_completion_percentage: number;
  course_completion_percentage: number;
  quiz_completion_percentage: number;
  badge_completion_percentage: number;
  achievement_completion_percentage: number;
  overall_progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ProgressSummary {
  id: number;
  user: number;
  current_level: number;
  experience_points: number;
  experience_to_next_level: number;
  learning_completion_percentage: number;
  course_completion_percentage: number;
  quiz_completion_percentage: number;
  overall_progress_percentage: number;
  current_streak_days: number;
  longest_streak_days: number;
  total_activity_days: number;
  portfolio_value: number;
  portfolio_growth_percentage: number;
  win_rate: number;
  total_badges: number;
  earned_badges: number;
  total_achievements: number;
  earned_achievements: number;
  updated_at: string;
}

export interface WeeklyActivity {
  week: string;
  lessons_completed: number;
  quizzes_taken: number;
  activity_score: number;
}

export interface ProgressStats {
  total_courses: number;
  completed_courses: number;
  total_lessons: number;
  completed_lessons: number;
  total_quizzes: number;
  completed_quizzes: number;
  average_quiz_score: number;
  portfolio_value: number;
  portfolio_growth_percentage: number;
  total_trades: number;
  successful_trades: number;
  win_rate: number;
  total_badges: number;
  earned_badges: number;
  total_achievements: number;
  earned_achievements: number;
  current_streak_days: number;
  longest_streak_days: number;
  total_activity_days: number;
  current_level: number;
  experience_points: number;
  experience_to_next_level: number;
  learning_completion_percentage: number;
  course_completion_percentage: number;
  quiz_completion_percentage: number;
  overall_progress_percentage: number;
}

/**
 * Progress API service
 * Handles all progress-related API calls
 */
export const progressApi = {
  /**
   * Get current user's comprehensive progress
   */
  async getMyProgress(): Promise<UserProgress> {
    try {
      const response = await api.get('/progress/my_progress/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },

  /**
   * Get progress summary for display
   */
  async getProgressSummary(): Promise<ProgressSummary> {
    try {
      const response = await api.get('/progress/summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress summary:', error);
      throw error;
    }
  },

  /**
   * Get aggregated progress statistics
   */
  async getProgressStats(): Promise<ProgressStats> {
    try {
      const response = await api.get('/progress/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      throw error;
    }
  },

  /**
   * Refresh progress data from all models
   */
  async refreshProgress(): Promise<UserProgress> {
    try {
      const response = await api.post('/progress/refresh/');
      return response.data;
    } catch (error) {
      console.error('Error refreshing progress:', error);
      throw error;
    }
  },

  /**
   * Get weekly activity data for charts
   */
  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    try {
      const response = await api.get('/progress/weekly_activity/');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly activity:', error);
      throw error;
    }
  },

  /**
   * Get progress by ID (for admin purposes)
   */
  async getProgressById(id: number): Promise<UserProgress> {
    try {
      const response = await api.get(`/progress/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress ${id}:`, error);
      throw error;
    }
  },

  /**
   * List all progress records (for admin purposes)
   */
  async listAllProgress(): Promise<UserProgress[]> {
    try {
      const response = await api.get('/progress/');
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error listing all progress:', error);
      throw error;
    }
  }
};

export default progressApi;
