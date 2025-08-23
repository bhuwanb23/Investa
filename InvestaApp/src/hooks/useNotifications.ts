import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import notificationsApi, { Notification } from '../services/notificationsApi';
import { ApiError } from '../services/api';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<boolean>;
  markAsRead: (notificationId: number) => Promise<boolean>;
  fetchUnreadCount: () => Promise<void>;
  clearError: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await notificationsApi.getMyNotifications();
      setNotifications(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      console.error('Error fetching notifications:', apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      await notificationsApi.markAllAsRead();
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error marking all notifications as read:', apiError);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      await notificationsApi.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      Alert.alert('Error', apiError.message);
      console.error('Error marking notification as read:', apiError);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setError(null);
      const response = await notificationsApi.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      console.error('Error fetching unread count:', apiError);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    isUpdating,
    error,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    fetchUnreadCount,
    clearError,
  };
};
