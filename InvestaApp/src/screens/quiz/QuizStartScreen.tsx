import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { QUIZ_TOPICS, QUIZ_SETTINGS } from './constants/quizData';
import QuizHeader from './components/QuizHeader';
import QuizTopicCard from './components/QuizTopicCard';

type QuizStartScreenNavigationProp = StackNavigationProp<MainStackParamList, 'QuizStart'>;

const QuizStartScreen = () => {
  const navigation = useNavigation<QuizStartScreenNavigationProp>();
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleStartQuiz = () => {
    if (!selectedTopic) {
      Alert.alert('Please select a topic', 'Choose a quiz topic to continue');
      return;
    }

    const topic = QUIZ_TOPICS.find(t => t.id === selectedTopic);
    if (topic) {
      navigation.navigate('QuizQuestion', {
        quizId: selectedTopic,
        quizTitle: topic.title,
        timeLimit: topic.timeLimit,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <QuizHeader
        title="Quiz Center"
        onBack={handleBack}
        showMenuButton={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="bulb" size={48} color="#3B82F6" />
          </View>
          <Text style={styles.heroTitle}>Financial Knowledge Quiz</Text>
          <Text style={styles.heroSubtitle}>
            Test your understanding and boost your financial literacy with our interactive quiz
          </Text>
        </View>

        {/* Instructions Section */}
        <View style={styles.instructionsSection}>
          <View style={styles.instructionHeader}>
            <View style={styles.instructionIcon}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
            </View>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>How it works</Text>
              <Text style={styles.instructionText}>
                Choose a topic, answer questions, and get instant feedback on your performance
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionStats}>
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.statText}>5-10 min</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.statText}>10 questions</Text>
            </View>
          </View>
        </View>

        {/* Topic Selection */}
        <View style={styles.topicSection}>
          <Text style={styles.sectionTitle}>Choose Your Topic</Text>
          
          {QUIZ_TOPICS.map((topic) => (
            <QuizTopicCard
              key={topic.id}
              topic={topic}
              isSelected={selectedTopic === topic.id}
              onPress={() => handleTopicSelect(topic.id)}
            />
          ))}
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Quiz Attempts</Text>
            <Text style={styles.progressSubtitle}>
              {QUIZ_SETTINGS.maxAttemptsPerDay} left today
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressNote}>Resets at midnight</Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.startButton,
            !selectedTopic && styles.disabledButton,
          ]}
          onPress={handleStartQuiz}
          disabled={!selectedTopic}
        >
          <Text style={styles.startButtonText}>
            {selectedTopic 
              ? `Start ${QUIZ_TOPICS.find(t => t.id === selectedTopic)?.title} Quiz`
              : 'Select a topic to start'
            }
          </Text>
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
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  heroIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  instructionsSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  instructionStats: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
  },
  topicSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressNote: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomSection: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
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
