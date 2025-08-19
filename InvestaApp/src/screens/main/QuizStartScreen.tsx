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
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const QuizStartScreen = () => {
  const navigation = useNavigation();
  const [selectedTopic, setSelectedTopic] = useState('');

  const quizTopics = [
    {
      id: 1,
      title: 'Stock Market Basics',
      description: 'Test your knowledge of fundamental stock market concepts',
      questions: 10,
      timeLimit: '15 min',
      difficulty: 'Beginner',
      icon: 'business',
      color: '#3B82F6',
      completed: false,
      bestScore: 0,
    },
    {
      id: 2,
      title: 'Technical Analysis',
      description: 'Charts, patterns, and technical indicators',
      questions: 15,
      timeLimit: '20 min',
      difficulty: 'Intermediate',
      icon: 'analytics',
      color: '#059669',
      completed: false,
      bestScore: 0,
    },
    {
      id: 3,
      title: 'Risk Management',
      description: 'Portfolio protection and risk assessment',
      questions: 12,
      timeLimit: '18 min',
      difficulty: 'Advanced',
      icon: 'shield-checkmark',
      color: '#DC2626',
      completed: false,
      bestScore: 0,
    },
    {
      id: 4,
      title: 'Market Orders',
      description: 'Different types of trading orders',
      questions: 8,
      timeLimit: '12 min',
      difficulty: 'Intermediate',
      icon: 'list',
      color: '#7C3AED',
      completed: false,
      bestScore: 0,
    },
    {
      id: 5,
      title: 'Portfolio Diversification',
      description: 'Building balanced investment portfolios',
      questions: 10,
      timeLimit: '15 min',
      difficulty: 'Advanced',
      icon: 'pie-chart',
      color: '#F59E0B',
      completed: false,
      bestScore: 0,
    },
  ];

  const handleStartQuiz = () => {
    if (selectedTopic) {
      navigation.navigate('QuizQuestion', { topicId: selectedTopic });
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
        <View style={styles.topicBadge}>
          <Text style={styles.topicBadgeText}>{topic.difficulty}</Text>
        </View>
      </View>

      <Text style={styles.topicTitle}>{topic.title}</Text>
      <Text style={styles.topicDescription}>{topic.description}</Text>

      <View style={styles.topicMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
          <Text style={styles.metaText}>{topic.questions} questions</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.metaText}>{topic.timeLimit}</Text>
        </View>
      </View>

      {topic.completed && (
        <View style={styles.completedInfo}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.completedText}>Best Score: {topic.bestScore}%</Text>
        </View>
      )}

      {selectedTopic === topic.id && (
        <View style={styles.selectionIndicator}>
          <Ionicons name="checkmark-circle" size={24} color={topic.color} />
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
        <Text style={styles.headerTitle}>Quiz</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionsSection}>
          <View style={styles.instructionsHeader}>
            <Ionicons name="information-circle" size={24} color="#0891B2" />
            <Text style={styles.instructionsTitle}>Quiz Instructions</Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              Read each question carefully before answering
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              You can review and change answers before submitting
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              Your score will be displayed immediately after completion
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              Retake quizzes to improve your score
            </Text>
          </View>
        </View>

        <View style={styles.topicsSection}>
          <Text style={styles.sectionTitle}>Choose a Topic</Text>
          <Text style={styles.sectionSubtitle}>
            Select a topic to test your knowledge
          </Text>
          
          {quizTopics.map(renderTopicCard)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.startButton,
            !selectedTopic && styles.disabledButton,
          ]}
          onPress={handleStartQuiz}
          disabled={!selectedTopic}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
          <Ionicons name="play" size={20} color="white" />
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  instructionsSection: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  topicsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
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
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedTopic: {
    borderColor: '#0891B2',
    backgroundColor: '#F0F9FF',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topicBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  topicDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  topicMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891B2',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizStartScreen;
