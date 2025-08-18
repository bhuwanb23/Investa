import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();

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
    },
    {
      id: 2,
      title: 'Portfolio Diversification',
      description: 'Master the art of building a balanced portfolio',
      difficulty: 'Intermediate',
      duration: '3 hours',
      progress: 0.3,
      language: 'Hindi',
    },
    {
      id: 3,
      title: 'Risk Management',
      description: 'Understand how to manage investment risks',
      difficulty: 'Advanced',
      duration: '4 hours',
      progress: 0,
      language: 'English',
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
    <Card style={styles.progressCard}>
      <Card.Content>
        <View style={styles.progressHeader}>
          <Title style={styles.progressTitle}>Your Progress</Title>
          <Ionicons name="trophy" size={24} color="#FFD700" />
        </View>
        
        <View style={styles.progressStats}>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{userProgress.completedLessons}</Text>
            <Text style={styles.progressLabel}>Lessons Completed</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{userProgress.currentStreak}</Text>
            <Text style={styles.progressLabel}>Day Streak</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{userProgress.totalPoints}</Text>
            <Text style={styles.progressLabel}>Total Points</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <Text style={styles.progressBarLabel}>Overall Progress</Text>
          <ProgressBar
            progress={userProgress.completedLessons / userProgress.totalLessons}
            color="#2196F3"
            style={styles.progressBar}
          />
          <Text style={styles.progressPercentage}>
            {Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100)}%
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderQuickActions = () => (
    <Card style={styles.quickActionsCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Quick Actions</Title>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionItem}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color="white" />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderRecommendedCourses = () => (
    <Card style={styles.coursesCard}>
      <Card.Content>
        <View style={styles.coursesHeader}>
          <Title style={styles.sectionTitle}>Recommended for You</Title>
          <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
            >
              <View style={styles.courseHeader}>
                <View style={styles.courseBadge}>
                  <Text style={styles.courseBadgeText}>{course.difficulty}</Text>
                </View>
                <Text style={styles.courseLanguage}>{course.language}</Text>
              </View>
              
              <Title style={styles.courseTitle} numberOfLines={2}>
                {course.title}
              </Title>
              
              <Paragraph style={styles.courseDescription} numberOfLines={2}>
                {course.description}
              </Paragraph>
              
              <View style={styles.courseFooter}>
                <Text style={styles.courseDuration}>{course.duration}</Text>
                {course.progress > 0 && (
                  <ProgressBar
                    progress={course.progress}
                    color="#4CAF50"
                    style={styles.courseProgressBar}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.userName}>John Doe</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={24} color="#2196F3" />
          </View>
        </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBarLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  quickActionsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  coursesCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
    borderRadius: 16,
  },
  coursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  courseCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  courseBadgeText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  courseLanguage: {
    fontSize: 10,
    color: '#666',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 20,
  },
  courseDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    lineHeight: 16,
  },
  courseFooter: {
    alignItems: 'flex-start',
  },
  courseDuration: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  courseProgressBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;
