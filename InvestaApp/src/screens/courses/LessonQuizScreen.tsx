import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
import LessonQuizContent from './components/LessonQuizContent';
import { fetchQuizForLesson, startQuizAttempt, submitQuizAnswer, completeQuizAttempt } from './utils/coursesApi';

type ParamList = { 
  LessonQuiz: { 
    lessonId: string;
    courseId?: string;
  } 
};

const LessonQuizScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'LessonQuiz'>>();
  const route = useRoute<RouteProp<ParamList, 'LessonQuiz'>>();
  const { lessonId, courseId } = route.params;

  const [quiz, setQuiz] = useState<any>(null);
  const [quizAttempt, setQuizAttempt] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await fetchQuizForLesson(Number(lessonId));
      setQuiz(quizData);
      
      // Start quiz attempt
      const attempt = await startQuizAttempt(quizData.id);
      setQuizAttempt(attempt);
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionId: number, answerId: number | null, textAnswer?: string) => {
    try {
      const result = await submitQuizAnswer(quizAttempt.id, questionId, answerId, textAnswer);
      return result;
    } catch (err) {
      console.error('Error submitting answer:', err);
      throw err;
    }
  };

  const handleCompleteQuiz = async (timeTaken: number) => {
    try {
      const result = await completeQuizAttempt(quizAttempt.id, timeTaken);
      setQuizCompleted(true);
      
      // Navigate back to lesson list with completion status
      navigation.navigate('LessonList', { 
        courseId: courseId || '', 
        lessonCompleted: true 
      });
      
      return result;
    } catch (err) {
      console.error('Error completing quiz:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader title="Quiz" iconName="help-circle" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader title="Quiz" iconName="help-circle" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'No quiz available for this lesson'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const totalQuestions = quiz.questions?.length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={`Quiz: ${quiz.title}`} iconName="help-circle" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LessonQuizContent
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          question={currentQuestion}
          quizAttempt={quizAttempt}
          onAnswerSubmit={handleAnswerSubmit}
          onNextQuestion={() => {
            if (currentQuestionIndex < totalQuestions - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
          }}
          onCompleteQuiz={() => handleCompleteQuiz(300)} // 5 minutes default
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});

export default LessonQuizScreen;


