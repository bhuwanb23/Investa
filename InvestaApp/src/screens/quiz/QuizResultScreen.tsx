import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type QuizResultScreenNavigationProp = StackNavigationProp<MainStackParamList, 'QuizResult'>;
type QuizResultScreenRouteProp = RouteProp<MainStackParamList, 'QuizResult'>;

const QuizResultScreen = () => {
  const navigation = useNavigation<QuizResultScreenNavigationProp>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const { score, totalQuestions, correctAnswers, timeTaken, quizId } = route.params;

  const [animatedScore] = useState(new Animated.Value(0));
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Animate score from 0 to actual score
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Show details after score animation
    setTimeout(() => {
      setShowDetails(true);
    }, 1600);
  }, [score]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good work!';
    if (score >= 60) return 'Not bad!';
    return 'Keep practicing!';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return 'trophy';
    if (score >= 60) return 'star';
    return 'school';
  };

  const handleRetakeQuiz = () => {
    navigation.navigate('QuizQuestion', {
      quizId,
      quizTitle: 'Quiz', // You might want to pass the actual quiz title
      timeLimit: 15, // You might want to pass the actual time limit
    });
  };

  const handleBackToTopics = () => {
    navigation.navigate('QuizStart');
  };

  const handleViewAnswers = () => {
    // Navigate to a detailed answers view (you can implement this later)
    Alert.alert('Feature Coming Soon', 'Detailed answer review will be available soon!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToTopics} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Results</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Ionicons 
              name={getScoreIcon(score)} 
              size={48} 
              color={getScoreColor(score)} 
            />
            <Text style={styles.scoreMessage}>{getScoreMessage(score)}</Text>
          </View>

          <View style={styles.scoreDisplay}>
            <Animated.Text style={[
              styles.scoreText,
              { color: getScoreColor(score) }
            ]}>
              {animatedScore.interpolate({
                inputRange: [0, score],
                outputRange: ['0', score.toString()],
              })}
            </Animated.Text>
            <Text style={styles.scoreLabel}>%</Text>
          </View>

          <View style={styles.scoreDetails}>
            <View style={styles.scoreDetailItem}>
              <Text style={styles.scoreDetailLabel}>Correct Answers</Text>
              <Text style={styles.scoreDetailValue}>{correctAnswers}/{totalQuestions}</Text>
            </View>
            <View style={styles.scoreDetailItem}>
              <Text style={styles.scoreDetailLabel}>Time Taken</Text>
              <Text style={styles.scoreDetailValue}>{formatTime(timeTaken)}</Text>
            </View>
          </View>
        </View>

        {/* Performance Breakdown */}
        {showDetails && (
          <View style={styles.performanceSection}>
            <Text style={styles.sectionTitle}>Performance Breakdown</Text>
            
            <View style={styles.performanceCard}>
              <View style={styles.performanceItem}>
                <View style={styles.performanceIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceLabel}>Correct</Text>
                  <Text style={styles.performanceValue}>{correctAnswers} questions</Text>
                </View>
                <Text style={styles.performancePercentage}>
                  {Math.round((correctAnswers / totalQuestions) * 100)}%
                </Text>
              </View>

              <View style={styles.performanceItem}>
                <View style={styles.performanceIcon}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceLabel}>Incorrect</Text>
                  <Text style={styles.performanceValue}>{totalQuestions - correctAnswers} questions</Text>
                </View>
                <Text style={styles.performancePercentage}>
                  {Math.round(((totalQuestions - correctAnswers) / totalQuestions) * 100)}%
                </Text>
              </View>

              <View style={styles.performanceItem}>
                <View style={styles.performanceIcon}>
                  <Ionicons name="time" size={24} color="#3B82F6" />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceLabel}>Average Time</Text>
                  <Text style={styles.performanceValue}>
                    {Math.round(timeTaken / totalQuestions)}s per question
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recommendations */}
        {showDetails && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            
            <View style={styles.recommendationsCard}>
              {score < 70 && (
                <View style={styles.recommendationItem}>
                  <Ionicons name="book-outline" size={20} color="#3B82F6" />
                  <Text style={styles.recommendationText}>
                    Review the course materials to strengthen your understanding
                  </Text>
                </View>
              )}
              
              {score < 80 && (
                <View style={styles.recommendationItem}>
                  <Ionicons name="refresh-outline" size={20} color="#F59E0B" />
                  <Text style={styles.recommendationText}>
                    Practice with more questions to improve your skills
                  </Text>
                </View>
              )}
              
              {score >= 80 && (
                <View style={styles.recommendationItem}>
                  <Ionicons name="arrow-up-outline" size={20} color="#10B981" />
                  <Text style={styles.recommendationText}>
                    Great job! Consider taking advanced topics
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleViewAnswers}
        >
          <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>Review Answers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRetakeQuiz}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Retake Quiz</Text>
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
    paddingBottom: 16,
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
  scoreCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreDetailItem: {
    alignItems: 'center',
  },
  scoreDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreDetailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  performanceSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  performanceContent: {
    flex: 1,
  },
  performanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  performanceValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  performancePercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  recommendationsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  recommendationsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: 'white',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default QuizResultScreen;
