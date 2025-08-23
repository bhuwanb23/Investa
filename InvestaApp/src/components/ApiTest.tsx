import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useProfile, useNotifications } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { profileApi, authApi } from '../services';

const ApiTest = () => {
  const { user } = useAuth();
  const { profile, fetchProfile, isLoading: profileLoading } = useProfile();
  const { notifications, fetchNotifications, isLoading: notificationsLoading } = useNotifications();
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Test API calls on component mount
    fetchProfile();
    fetchNotifications();
  }, [fetchProfile, fetchNotifications]);

  const testApiConnection = async () => {
    setIsTesting(true);
    try {
      // Test auth API
      const authResult = await authApi.testAuth();
      Alert.alert('Auth API Test', 'Auth API is working!');
    } catch (error: any) {
      Alert.alert('Auth API Test Failed', error.message || 'Unknown error');
    } finally {
      setIsTesting(false);
    }
  };

  const testProfileApi = async () => {
    setIsTesting(true);
    try {
      const result = await profileApi.testConnection();
      Alert.alert('Profile API Test', 'Profile API is working!');
    } catch (error: any) {
      Alert.alert('Profile API Test Failed', error.message || 'Unknown error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Integration Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          User: {user?.username || 'Not logged in'}
        </Text>
        <Text style={styles.statusText}>
          Profile: {profile ? 'Loaded' : 'Not loaded'}
        </Text>
        <Text style={styles.statusText}>
          Notifications: {notifications.length} items
        </Text>
        <Text style={styles.statusText}>
          Profile Loading: {profileLoading ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          Notifications Loading: {notificationsLoading ? 'Yes' : 'No'}
        </Text>
      </View>

      <Pressable style={styles.testButton} onPress={testApiConnection} disabled={isTesting}>
        <Text style={styles.testButtonText}>
          {isTesting ? 'Testing...' : 'Test Auth API'}
        </Text>
      </Pressable>

      <Pressable style={styles.testButton} onPress={testProfileApi} disabled={isTesting}>
        <Text style={styles.testButtonText}>
          {isTesting ? 'Testing...' : 'Test Profile API'}
        </Text>
      </Pressable>

      {profile && (
        <View style={styles.profileInfo}>
          <Text style={styles.sectionTitle}>Profile Data:</Text>
          <Text>Name: {profile.user.first_name} {profile.user.last_name}</Text>
          <Text>Email: {profile.user.email}</Text>
          <Text>Level: {profile.level}</Text>
          <Text>XP: {profile.experience_points}</Text>
        </View>
      )}

      {notifications.length > 0 && (
        <View style={styles.notificationsInfo}>
          <Text style={styles.sectionTitle}>Recent Notifications:</Text>
          {notifications.slice(0, 3).map((notification, index) => (
            <Text key={notification.id} style={styles.notificationItem}>
              {index + 1}. {notification.title} ({notification.read ? 'Read' : 'Unread'})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 4,
  },
  testButton: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileInfo: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notificationsInfo: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notificationItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ApiTest;
