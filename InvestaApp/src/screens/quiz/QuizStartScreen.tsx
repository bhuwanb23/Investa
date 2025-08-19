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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';

const { width } = Dimensions.get('window');

type QuizStartScreenNavigationProp = StackNavigationProp<MainStackParamList, 'QuizStart'>;

const QuizStartScreen = () => {
  const navigation = useNavigation<QuizStartScreenNavigationProp>();
  const [selectedTopic, setSelectedTopic] = useState('');

  const quizTopics = [
    {
      id: '1',
      title: 'Stock Market Basics',
      description: 'Test your knowledge of fundamental stock market concepts',
      questions: 10,
      timeLimit: 15,
      difficulty: 'Beginner',
      icon: 'business',
      color: '#3B82F6',
      completed: false,
      bestScore: 0,
    },
    {
      id: '2',
      title: 'Technical Analysis',
      description: 'Charts, patterns, and technical indicators',
      questions: 15,
      timeLimit: 20,
      difficulty: 'Intermediate',
      icon: 'analytics',
      color: '#059669',
      completed: false,
      bestScore: 0,
    },
    {
      id: '3',
      title: 'Risk Management',
      description: 'Portfolio protection and risk assessment',
      questions: 12,
      timeLimit: 18,
      difficulty: 'Advanced',
      icon: 'shield-checkmark',
      color: '#DC2626',
      completed: false,
      bestScore: 0,
    },
    {
      id: '4',
      title: 'Market Orders',
      description: 'Different types of trading orders',
      questions: 8,
      timeLimit: 12,
      difficulty: 'Intermediate',
      icon: 'list',
      color: '#7C3AED',
      completed: false,
      bestScore: 0,
    },
    {
      id: '5',
      title: 'Portfolio Diversification',
      description: 'Building balanced investment portfolios',
      questions: 10,
      timeLimit: 15,
      difficulty: 'Advanced',
      icon: 'pie-chart',
      color: '#F59E0B',
      completed: false,
      bestScore: 0,
    },
  ];

  const handleStartQuiz = () => {
    if (selectedTopic) {
      const selectedQuiz = quizTopics.find(topic => topic.id === selectedTopic);
      if (selectedQuiz) {
        navigation.navigate('QuizQuestion', {
          quizId: selectedQuiz.id,
          quizTitle: selectedQuiz.title,
          timeLimit: selectedQuiz.timeLimit,
        });
      }
    }
  };

  const renderTopicCard = (topic: any) => (
    <TouchableOpacity
      key={topic.id}
      style={[
        styles.topicCard,
        selectedTopic === topic.id && styles.selectedTopic,
      ]}
      onPress={() => setSelectedTopic(topic.id)}
      activeOpacity={0.8}
    >
      <View style={styles.topicHeader}>
        <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
          <Ionicons name={topic.icon as any} size={24} color={topic.color} />
        </View>
        <View style={styles.topicInfo}>
          <Text style={styles.topicTitle}>{topic.title}</Text>
          <Text style={styles.topicDescription}>{topic.description}</Text>
          <View style={styles.topicMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{topic.questions} questions</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{topic.timeLimit} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="trending-up-outline" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{topic.difficulty}</Text>
            </View>
          </View>
        </View>
        {topic.completed && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
        )}
      </View>
      
      {topic.bestScore > 0 && (
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreText}>Best Score: {topic.bestScore}%</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Topics</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Test Your Knowledge</Text>
          <Text style={styles.introDescription}>
            Choose a topic to start your quiz. Each quiz contains multiple-choice questions to test your understanding of investment concepts.
          </Text>
        </View>

        <View style={styles.topicsSection}>
          <Text style={styles.sectionTitle}>Available Topics</Text>
          {quizTopics.map(renderTopicCard)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.startButton,
            !selectedTopic && styles.startButtonDisabled,
          ]}
          onPress={handleStartQuiz}
          disabled={!selectedTopic}
        >
          <Text style={[
            styles.startButtonText,
            !selectedTopic && styles.startButtonTextDisabled,
          ]}>
            Start Quiz
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={selectedTopic ? 'white' : '#9CA3AF'} 
          />
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  introSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  topicsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  topicCard: {
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
  selectedTopic: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  topicMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  completedBadge: {
    marginLeft: 'auto',
  },
  scoreInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  scoreText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  startButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default QuizStartScreen;
