import api, { ApiResponse, ApiError, handleApiError } from './api';

// Types for Notifications API
export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'security' | 'learning' | 'trading' | 'achievement' | 'general';
  read: boolean;
  created_at: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

// Notifications API Service
export const notificationsApi = {
  // Get current user's notifications
  getMyNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    try {
      const response = await api.get('notifications/my_notifications/');
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    try {
      await api.post('notifications/mark_all_read/');
      return {
        data: undefined,
        success: true,
        message: 'All notifications marked as read',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Mark a specific notification as read
  markAsRead: async (notificationId: number): Promise<ApiResponse<void>> => {
    try {
      await api.post(`notifications/${notificationId}/mark_read/`);
      return {
        data: undefined,
        success: true,
        message: 'Notification marked as read',
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    try {
      const response = await api.get('notifications/unread_count/');
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default notificationsApi;
