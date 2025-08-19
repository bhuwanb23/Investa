import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Mock data - replace with actual API data
  const userProgress = {
    completedLessons: 12,
    totalLessons: 25,
    currentStreak: 5,
    totalPoints: 850,
  };

  const recommendedCourses = [
    {
      id: 1,
      title: 'Stock Market Basics',
      description: 'Learn the fundamentals of stock market investing',
      difficulty: 'Beginner',
      duration: '2 hours',
      progress: 0.6,
      language: 'English',
      icon: 'trending-up',
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'Portfolio Diversification',
      description: 'Master the art of building a balanced portfolio',
      difficulty: 'Intermediate',
      duration: '3 hours',
      progress: 0.3,
      language: 'Hindi',
      icon: 'pie-chart',
      color: '#FF9800',
    },
    {
      id: 3,
      title: 'Risk Management',
      description: 'Understand how to manage investment risks',
      difficulty: 'Advanced',
      duration: '4 hours',
      progress: 0,
      language: 'English',
      icon: 'shield-checkmark',
      color: '#9C27B0',
    },
  ];

  const quickActions = [
    {
      title: 'Take Quiz',
      icon: 'help-circle',
      color: '#4CAF50',
      onPress: () => navigation.navigate('Quiz'),
    },
    {
      title: 'Practice Trading',
      icon: 'trending-up',
      color: '#FF9800',
      onPress: () => navigation.navigate('Trading'),
    },
    {
      title: 'View Progress',
      icon: 'analytics',
      color: '#2196F3',
      onPress: () => navigation.navigate('Progress'),
    },
    {
      title: 'Browse Courses',
      icon: 'library',
      color: '#9C27B0',
      onPress: () => navigation.navigate('Courses'),
    },
  ];

  const renderProgressCard = () => (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <View>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressSubtitle}>Keep up the great work!</Text>
        </View>
        <View style={styles.trophyContainer}>
          <Ionicons name="trophy" size={28} color="#FFD700" />
        </View>
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.progressItem}>
          <View style={styles.progressNumberContainer}>
            <Text style={styles.progressNumber}>{userProgress.completedLessons}</Text>
            <Text style={styles.progressTotal}>/{userProgress.totalLessons}</Text>
          </View>
          <Text style={styles.progressLabel}>Lessons</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <View style={styles.progressNumberContainer}>
            <Text style={styles.progressNumber}>{userProgress.currentStreak}</Text>
          </View>
          <Text style={styles.progressLabel}>Day Streak</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <View style={styles.progressNumberContainer}>
            <Text style={styles.progressNumber}>{userProgress.totalPoints}</Text>
          </View>
          <Text style={styles.progressLabel}>Points</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarHeader}>
          <Text style={styles.progressBarLabel}>Overall Progress</Text>
          <Text style={styles.progressPercentage}>
            {Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100)}%
          </Text>
        </View>
        <ProgressBar
          progress={userProgress.completedLessons / userProgress.totalLessons}
          color="#4CAF50"
          style={styles.progressBar}
        />
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsCard}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionItem}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon as any} size={24} color="white" />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRecommendedCourses = () => (
    <View style={styles.coursesCard}>
      <View style={styles.coursesHeader}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Courses')} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.coursesScrollContainer}>
        {recommendedCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
            activeOpacity={0.8}
          >
            <View style={styles.courseHeader}>
              <View style={[styles.courseIconContainer, { backgroundColor: course.color + '20' }]}>
                <Ionicons name={course.icon as any} size={20} color={course.color} />
              </View>
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>{course.difficulty}</Text>
              </View>
            </View>
            
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.title}
            </Text>
            
            <Text style={styles.courseDescription} numberOfLines={2}>
              {course.description}
            </Text>
            
            <View style={styles.courseFooter}>
              <View style={styles.courseMeta}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.courseDuration}>{course.duration}</Text>
                <Ionicons name="language-outline" size={14} color="#6B7280" style={{ marginLeft: 8 }} />
                <Text style={styles.courseLanguage}>{course.language}</Text>
              </View>
              {course.progress > 0 && (
                <View style={styles.courseProgressContainer}>
                  <ProgressBar
                    progress={course.progress}
                    color={course.color}
                    style={styles.courseProgressBar}
                  />
                  <Text style={styles.courseProgressText}>
                    {Math.round(course.progress * 100)}% Complete
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <Text style={styles.userName}>{user?.username || 'User'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
              <View style={styles.profileAvatar}>
                <Ionicons name="person" size={24} color="#4F46E5" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {renderProgressCard()}
      {renderQuickActions()}
      {renderRecommendedCourses()}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    marginRight: 12,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  trophyContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressNumberContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4F46E5',
  },
  progressTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 2,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    fontWeight: '500',
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F3F4F6',
  },
  progressPercentage: {
    fontSize: 15,
    color: '#4F46E5',
    fontWeight: '700',
  },
  quickActionsCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 88) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionTitle: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  coursesCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  coursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
  },
  viewAllText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  coursesScrollContainer: {
    paddingRight: 20,
  },
  courseCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  courseBadgeText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  courseDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  courseFooter: {
    alignItems: 'flex-start',
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  courseLanguage: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  courseProgressContainer: {
    width: '100%',
  },
  courseProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
    marginBottom: 6,
  },
  courseProgressText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default HomeScreen;
