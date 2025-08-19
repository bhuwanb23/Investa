import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ModuleProgressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { moduleId } = route.params as { moduleId: number };

  // Mock module progress data - replace with API call
  const moduleProgress = {
    id: moduleId,
    title: 'What is a Stock?',
    description: 'Learn the fundamental concept of stocks and how they represent ownership in a company.',
    category: 'Basics',
    totalLessons: 3,
    completedLessons: 3,
    totalDuration: '15 min',
    timeSpent: '12 min',
    progress: 100,
    difficulty: 'Beginner',
    icon: 'business',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    completedAt: '2024-01-15',
    achievements: [
      {
        id: 1,
        title: 'First Lesson Complete',
        description: 'Completed your first lesson in this module',
        icon: 'star',
        earned: true,
      },
      {
        id: 2,
        title: 'Perfect Score',
        description: 'Scored 100% on the module quiz',
        icon: 'trophy',
        earned: true,
      },
      {
        id: 3,
        title: 'Speed Learner',
        description: 'Completed the module in under 15 minutes',
        icon: 'flash',
        earned: true,
      },
    ],
    lessons: [
      {
        id: 1,
        title: 'Introduction to Stocks',
        duration: '5 min',
        type: 'video',
        completed: true,
        completedAt: '2024-01-15T10:30:00',
        score: null,
      },
      {
        id: 2,
        title: 'How Stock Ownership Works',
        duration: '6 min',
        type: 'text',
        completed: true,
        completedAt: '2024-01-15T10:45:00',
        score: null,
      },
      {
        id: 3,
        title: 'Types of Stocks',
        duration: '4 min',
        type: 'quiz',
        completed: true,
        completedAt: '2024-01-15T11:00:00',
        score: 100,
      },
    ],
  };

  const renderAchievement = (achievement: any) => (
    <View key={achievement.id} style={[
      styles.achievementCard,
      !achievement.earned && styles.lockedAchievement
    ]}>
      <View style={[
        styles.achievementIcon,
        { backgroundColor: achievement.earned ? moduleProgress.bgColor : '#F3F4F6' }
      ]}>
        <Ionicons 
          name={achievement.icon as any} 
          size={24} 
          color={achievement.earned ? moduleProgress.color : '#9CA3AF'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementTitle,
          !achievement.earned && styles.lockedText
        ]}>
          {achievement.title}
        </Text>
        <Text style={[
          styles.achievementDescription,
          !achievement.earned && styles.lockedText
        ]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.earned && (
        <View style={styles.earnedBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>
      )}
    </View>
  );

  const renderLessonItem = (lesson: any, index: number) => (
    <View key={lesson.id} style={styles.lessonItem}>
      <View style={styles.lessonHeader}>
        <View style={[
          styles.lessonNumber,
          lesson.completed && styles.completedLessonNumber
        ]}>
          <Text style={[
            styles.lessonNumberText,
            lesson.completed && styles.completedLessonText
          ]}>
            {index + 1}
          </Text>
        </View>
        
        <View style={styles.lessonInfo}>
          <Text style={[
            styles.lessonTitle,
            lesson.completed && styles.completedLessonText
          ]}>
            {lesson.title}
          </Text>
          <View style={styles.lessonMeta}>
            <View style={styles.lessonType}>
              <Ionicons 
                name={
                  lesson.type === 'video' ? 'play-circle' : 
                  lesson.type === 'quiz' ? 'help-circle' : 'document-text'
                } 
                size={16} 
                color={lesson.completed ? '#10B981' : '#6B7280'} 
              />
              <Text style={[
                styles.lessonTypeText,
                lesson.completed && styles.completedLessonText
              ]}>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </Text>
            </View>
            <Text style={[
              styles.lessonDuration,
              lesson.completed && styles.completedLessonText
            ]}>
              {lesson.duration}
            </Text>
            {lesson.score && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{lesson.score}%</Text>
              </View>
            )}
          </View>
        </View>

        {lesson.completed && (
          <View style={styles.completedIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Module Complete!</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Summary */}
        <View style={styles.progressSection}>
          <View style={styles.moduleHeader}>
            <View style={[styles.moduleIcon, { backgroundColor: moduleProgress.bgColor }]}>
              <Ionicons name={moduleProgress.icon as any} size={32} color={moduleProgress.color} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{moduleProgress.title}</Text>
              <Text style={styles.moduleCategory}>{moduleProgress.category} • {moduleProgress.difficulty}</Text>
            </View>
          </View>

          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moduleProgress.progress}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moduleProgress.completedLessons}/{moduleProgress.totalLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moduleProgress.timeSpent}</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View style={styles.progressFill}>
              <View 
                style={[
                  styles.progressIndicator, 
                  { width: `${moduleProgress.progress}%`, backgroundColor: moduleProgress.color }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements Earned</Text>
          <Text style={styles.sectionSubtitle}>
            Great job! You've earned {moduleProgress.achievements.filter(a => a.earned).length} achievements
          </Text>
          
          {moduleProgress.achievements.map(renderAchievement)}
        </View>

        {/* Lesson Summary */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Lesson Summary</Text>
          {moduleProgress.lessons.map((lesson, index) => renderLessonItem(lesson, index))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: moduleProgress.color }]}
            onPress={() => navigation.navigate('LearningHome')}
          >
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('ModuleDetail', { moduleId })}
          >
            <Text style={styles.secondaryButtonText}>Review Module</Text>
            <Ionicons name="refresh" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  shareButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  progressSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  moduleCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  progressIndicator: {
    height: '100%',
    borderRadius: 4,
  },
  achievementsSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  earnedBadge: {
    marginLeft: 'auto',
  },
  lessonsSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedLessonNumber: {
    backgroundColor: '#D1FAE5',
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  completedLessonText: {
    color: '#10B981',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lessonType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonTypeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreContainer: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  completedIcon: {
    marginLeft: 'auto',
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModuleProgressScreen;
