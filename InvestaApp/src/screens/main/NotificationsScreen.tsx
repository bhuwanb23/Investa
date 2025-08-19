import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'notifications' },
    { id: 'learning', name: 'Learning', icon: 'school' },
    { id: 'sebi', name: 'SEBI Updates', icon: 'document-text' },
    { id: 'trading', name: 'Trading', icon: 'trending-up' },
  ];

  const notifications = [
    {
      id: 1,
      type: 'learning',
      title: 'New Module Available',
      message: 'Risk Management module is now available. Learn essential strategies for protecting your portfolio.',
      time: '2 hours ago',
      read: false,
      icon: 'school',
      color: '#3B82F6',
    },
    {
      id: 2,
      type: 'sebi',
      title: 'SEBI Circular Update',
      message: 'New guidelines on mutual fund investments. Important changes affecting retail investors.',
      time: '1 day ago',
      read: false,
      icon: 'document-text',
      color: '#DC2626',
    },
    {
      id: 3,
      type: 'trading',
      title: 'Market Alert',
      message: 'High volatility expected in banking stocks. Review your portfolio positions.',
      time: '3 hours ago',
      read: true,
      icon: 'trending-up',
      color: '#F59E0B',
    },
    {
      id: 4,
      type: 'learning',
      title: 'Quiz Reminder',
      message: 'You have 3 incomplete quizzes. Complete them to earn badges and track progress.',
      time: '1 day ago',
      read: true,
      icon: 'help-circle',
      color: '#10B981',
    },
    {
      id: 5,
      type: 'sebi',
      title: 'Regulatory Update',
      message: 'New SEBI guidelines on algorithmic trading. Important for advanced traders.',
      time: '2 days ago',
      read: true,
      icon: 'shield-checkmark',
      color: '#7C3AED',
    },
    {
      id: 6,
      type: 'trading',
      title: 'Portfolio Performance',
      message: 'Your simulated portfolio gained 2.5% this week. Check your performance dashboard.',
      time: '3 days ago',
      read: true,
      icon: 'analytics',
      color: '#059669',
    },
  ];

  const filteredNotifications = selectedCategory === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === selectedCategory);

  const renderCategoryButton = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon as any} 
        size={20} 
        color={selectedCategory === category.id ? 'white' : '#6B7280'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.selectedCategoryText,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderNotificationItem = (notification: any) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification,
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.notificationHeader}>
        <View style={[styles.notificationIcon, { backgroundColor: notification.color + '20' }]}>
          <Ionicons name={notification.icon as any} size={20} color={notification.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>

        {!notification.read && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );

  const markAllAsRead = () => {
    // Here you would typically update the notifications in your state/API
    console.log('Mark all as read');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => renderNotificationItem(item)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      />

      {filteredNotifications.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off" size={64} color="#9CA3AF" />
          <Text style={styles.emptyStateTitle}>No Notifications</Text>
          <Text style={styles.emptyStateMessage}>
            You're all caught up! Check back later for new updates.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    color: '#0891B2',
    fontWeight: '500',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  selectedCategory: {
    backgroundColor: '#0891B2',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: 'white',
  },
  notificationsList: {
    padding: 20,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#0891B2',
    backgroundColor: '#F0F9FF',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 22,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0891B2',
    marginLeft: 12,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotificationsScreen;
