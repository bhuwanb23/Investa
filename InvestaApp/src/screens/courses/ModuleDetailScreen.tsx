import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ModuleDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { moduleId } = route.params as { moduleId: number };
  const [currentLesson, setCurrentLesson] = useState(0);

  // Mock module data - replace with API call
  const moduleData = {
    id: moduleId,
    title: 'What is a Stock?',
    description: 'Learn the fundamental concept of stocks and how they represent ownership in a company.',
    category: 'Basics',
    duration: '15 min',
    totalLessons: 3,
    progress: 0.33,
    difficulty: 'Beginner',
    icon: 'business',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    lessons: [
      {
        id: 1,
        title: 'Introduction to Stocks',
        duration: '5 min',
        type: 'video',
        completed: true,
        content: 'Stocks represent ownership in a company. When you buy a stock, you become a shareholder and own a piece of that company. This ownership comes with certain rights, including voting rights on company decisions and the potential to receive dividends.',
      },
      {
        id: 2,
        title: 'How Stock Ownership Works',
        duration: '6 min',
        type: 'text',
        completed: false,
        content: 'As a shareholder, you have certain rights including voting rights, dividend payments, and the ability to sell your shares. The value of your shares can increase or decrease based on the company\'s performance and market conditions.',
      },
      {
        id: 3,
        title: 'Types of Stocks',
        duration: '4 min',
        type: 'quiz',
        completed: false,
        content: 'Common stocks and preferred stocks have different characteristics and benefits for investors. Common stocks typically offer voting rights and potential for growth, while preferred stocks often provide more stable dividend payments.',
      },
    ],
  };

  const renderLessonItem = (lesson: any, index: number) => (
    <TouchableOpacity
      key={lesson.id}
      style={[
        styles.lessonItem,
        currentLesson === index && styles.activeLesson,
        lesson.completed && styles.completedLesson,
      ]}
      onPress={() => setCurrentLesson(index)}
      activeOpacity={0.8}
    >
      <View style={styles.lessonHeader}>
        <View style={[
          styles.lessonNumber,
          lesson.completed && styles.completedLessonNumber,
          currentLesson === index && styles.activeLessonNumber,
        ]}>
          <Text style={[
            styles.lessonNumberText,
            lesson.completed && styles.completedLessonText,
            currentLesson === index && styles.activeLessonText,
          ]}>
            {index + 1}
          </Text>
        </View>
        
        <View style={styles.lessonInfo}>
          <Text style={[
            styles.lessonTitle,
            lesson.completed && styles.completedLessonText,
            currentLesson === index && styles.activeLessonText,
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
                color={lesson.completed ? '#10B981' : currentLesson === index ? '#3B82F6' : '#6B7280'} 
              />
              <Text style={[
                styles.lessonTypeText,
                lesson.completed && styles.completedLessonText,
                currentLesson === index && styles.activeLessonText,
              ]}>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </Text>
            </View>
            <Text style={[
              styles.lessonDuration,
              lesson.completed && styles.completedLessonText,
              currentLesson === index && styles.activeLessonText,
            ]}>
              {lesson.duration}
            </Text>
          </View>
        </View>

        {lesson.completed ? (
          <View style={styles.completedIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>
        ) : (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={currentLesson === index ? '#3B82F6' : '#9CA3AF'} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderLessonContent = () => {
    const lesson = moduleData.lessons[currentLesson];
    
    return (
      <View style={styles.contentContainer}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>{lesson.title}</Text>
          <View style={styles.contentMeta}>
            <View style={styles.contentType}>
              <Ionicons 
                name={
                  lesson.type === 'video' ? 'play-circle' : 
                  lesson.type === 'quiz' ? 'help-circle' : 'document-text'
                } 
                size={20} 
                color={moduleData.color} 
              />
              <Text style={styles.contentTypeText}>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </Text>
            </View>
            <Text style={styles.contentDuration}>{lesson.duration}</Text>
          </View>
        </View>

        <ScrollView style={styles.contentBody} showsVerticalScrollIndicator={false}>
          <Text style={styles.contentText}>{lesson.content}</Text>
          
          {lesson.type === 'video' && (
            <View style={styles.videoPlaceholder}>
              <View style={[styles.videoIcon, { backgroundColor: moduleData.bgColor }]}>
                <Ionicons name="play-circle" size={60} color={moduleData.color} />
              </View>
              <Text style={styles.videoPlaceholderText}>Video Content</Text>
              <Text style={styles.videoDescription}>
                Watch the video to learn about {lesson.title.toLowerCase()}
              </Text>
            </View>
          )}

          {lesson.type === 'quiz' && (
            <View style={styles.quizSection}>
              <View style={[styles.quizIcon, { backgroundColor: moduleData.bgColor }]}>
                <Ionicons name="help-circle" size={40} color={moduleData.color} />
              </View>
              <Text style={styles.quizTitle}>Ready to test your knowledge?</Text>
              <Text style={styles.quizDescription}>
                Take this quiz to reinforce what you've learned about {lesson.title.toLowerCase()}
              </Text>
              <TouchableOpacity style={[styles.quizButton, { backgroundColor: moduleData.color }]}>
                <Text style={styles.quizButtonText}>Start Quiz</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.contentFooter}>
          <TouchableOpacity 
            style={[
              styles.navigationButton,
              styles.previousButton,
              currentLesson === 0 && styles.disabledButton
            ]}
            disabled={currentLesson === 0}
            onPress={() => setCurrentLesson(currentLesson - 1)}
          >
            <Ionicons name="arrow-back" size={20} color={currentLesson === 0 ? '#9CA3AF' : '#6B7280'} />
            <Text style={[
              styles.navigationButtonText,
              currentLesson === 0 && styles.disabledButtonText
            ]}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.navigationButton,
              styles.nextButton,
              { backgroundColor: moduleData.color }
            ]}
            onPress={() => {
              if (currentLesson < moduleData.lessons.length - 1) {
                setCurrentLesson(currentLesson + 1);
              } else {
                // Module completed
                navigation.navigate('ModuleProgress', { moduleId });
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {currentLesson === moduleData.lessons.length - 1 ? 'Complete' : 'Next'}
            </Text>
            <Ionicons 
              name={currentLesson === moduleData.lessons.length - 1 ? 'checkmark' : 'arrow-forward'} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {moduleData.title}
          </Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill}>
            <View 
              style={[
                styles.progressIndicator, 
                { width: `${moduleData.progress * 100}%`, backgroundColor: moduleData.color }
              ]} 
            />
          </View>
        </View>
        <Text style={styles.progressText}>
          {Math.round(moduleData.progress * 100)}% Complete
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Lessons List */}
        <View style={styles.lessonsList}>
          <Text style={styles.lessonsTitle}>Lessons</Text>
          {moduleData.lessons.map((lesson, index) => renderLessonItem(lesson, index))}
        </View>

        {/* Lesson Content */}
        {renderLessonContent()}
      </View>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  bookmarkButton: {
    padding: 8,
    marginRight: -8,
  },
  progressSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
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
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  lessonsList: {
    width: width * 0.4,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    paddingTop: 20,
  },
  lessonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  lessonItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeLesson: {
    backgroundColor: '#F0F9FF',
    borderRightWidth: 3,
    borderRightColor: '#3B82F6',
  },
  completedLesson: {
    backgroundColor: '#F0FDF4',
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
  activeLessonNumber: {
    backgroundColor: '#DBEAFE',
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  completedLessonText: {
    color: '#10B981',
  },
  activeLessonText: {
    color: '#3B82F6',
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
  completedIcon: {
    marginLeft: 'auto',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  contentHeader: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 32,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contentType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentTypeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  contentDuration: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  contentBody: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  videoPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 24,
  },
  videoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  quizSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 24,
  },
  quizIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  quizDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  previousButton: {
    backgroundColor: '#F3F4F6',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
  },
  disabledButton: {
    backgroundColor: '#F9FAFB',
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModuleDetailScreen;
