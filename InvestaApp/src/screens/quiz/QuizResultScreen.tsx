import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';
import QuizHeader from './components/QuizHeader';
import api from '../../services/api';

type QuizResultScreenNavigationProp = StackNavigationProp<MainStackParamList, 'QuizResult'>;
type QuizResultScreenRouteProp = RouteProp<MainStackParamList, 'QuizResult'>;

const SCORE_MESSAGES: Record<string, string> = {
  excellent: 'Excellent! Outstanding performance!',
  great: 'Great job! You have solid knowledge!',
  good: 'Good work! Keep learning to improve!',
  needsImprovement: 'Keep practicing! Review the basics!',
  poor: 'Don\'t worry! Learning takes time!',
};

const SCORE_COLORS: Record<string, string> = {
  excellent: '#10B981',
  great: '#3B82F6',
  good: '#F59E0B',
  needsImprovement: '#EF4444',
  poor: '#DC2626',
};

const getScoreLevel = (score: number) => {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'great';
  if (score >= 70) return 'good';
  if (score >= 60) return 'needsImprovement';
  return 'poor';
};

const QuizResultScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const { score, totalQuestions, correctAnswers, timeTaken, quizId } = route.params;

  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showReview, setShowReview] = useState(false);
  
  const scoreLevel = getScoreLevel(score);
  const scoreMessage = SCORE_MESSAGES[scoreLevel];
  const scoreColor = SCORE_COLORS[scoreLevel];

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoadingAchievements(true);
        const response = await api.get('trading-performance/my_achievements/');
        // Filter for achievements earned recently (in the last hour) or just general ones
        setAchievements(response.data || []);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoadingAchievements(false);
      }
    };
    fetchAchievements();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigation.navigate('Quiz');
  };

  const handleRetryQuiz = () => {
    Alert.alert(
      "Retry Quiz",
      "Are you sure you want to retry this quiz?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Retry", 
          onPress: () => {
            navigation.navigate('Quiz');
          }
        }
      ]
    );
  };

  const handleReviewAnswers = () => {
    setShowReview(!showReview);
  };

  const handleGoToModules = () => {
    navigation.navigate('Courses' as any);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just scored ${score}% on the quiz in Investa! I got ${correctAnswers} out of ${totalQuestions} correct in ${formatTime(timeTaken)}.`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share results');
    }
  };

  return (
    <View style={styles.container}>
      <QuizHeader
        title="Quiz Results"
        onBack={handleBack}
        rightComponent={
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreIcon}>
            <Ionicons name="trophy" size={64} color={scoreColor} />
          </View>
          
          <View style={styles.scoreCard}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {score}%
            </Text>
            <Text style={styles.scoreTitle}>{scoreMessage}</Text>
            <Text style={styles.scoreSubtitle}>
              You scored {correctAnswers} out of {totalQuestions} questions
            </Text>

            {/* Achievement Badges */}
            <View style={styles.badgesSection}>
              {loadingAchievements ? (
                <ActivityIndicator size="small" color="#F59E0B" />
              ) : achievements.length > 0 ? (
                achievements.slice(0, 2).map((achievement, index) => (
                  <View key={index} style={styles.badge}>
                    <Ionicons name="medal" size={16} color="#F59E0B" />
                    <Text style={styles.badgeText}>{achievement.achievement.name}</Text>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.badge}>
                    <Ionicons name="medal" size={16} color="#F59E0B" />
                    <Text style={styles.badgeText}>Completed</Text>
                  </View>
                  {score >= 80 && (
                    <View style={styles.badge}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.badgeText}>High Score</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
              onPress={handleRetryQuiz}
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.actionButtonText}>Retry Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10B981' }]}
              onPress={handleReviewAnswers}
            >
              <Ionicons name="eye" size={24} color="white" />
              <Text style={styles.actionButtonText}>Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
              onPress={handleGoToModules}
            >
              <Ionicons name="book" size={24} color="white" />
              <Text style={styles.actionButtonText}>Modules</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quiz Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.statValue}>{correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="close-circle" size={24} color="#EF4444" />
              <Text style={styles.statValue}>{totalQuestions - correctAnswers}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{formatTime(timeTaken)}</Text>
              <Text style={styles.statLabel}>Time Taken</Text>
            </View>
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          
          <View style={styles.insightCard}>
            <Ionicons name="trending-up" size={20} color="#10B981" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Great Progress!</Text>
              <Text style={styles.insightText}>
                You're improving your financial knowledge. Keep practicing to master more concepts.
              </Text>
            </View>
          </View>
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
  content: {
    flex: 1,
  },
  shareButton: {
    padding: 8,
  },
  scoreSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  scoreIcon: {
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  badgesSection: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default QuizResultScreen;
