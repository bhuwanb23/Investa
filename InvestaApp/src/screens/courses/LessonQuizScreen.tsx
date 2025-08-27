import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
import LessonQuizContent from './components/LessonQuizContent';
import { fetchQuizForLesson, startQuizAttempt, submitQuizAnswer, completeQuizAttempt } from './utils/coursesApi';
import { getQuizAttempt } from './utils/coursesApi';
import { markLessonCompleted, fetchCourseDetailWithProgress } from './utils/coursesApi';
import { Alert } from 'react-native';

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
  const [attemptResult, setAttemptResult] = useState<any>(null);

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
      // Fetch the persisted attempt with answers populated
      const fresh = await getQuizAttempt(result.id || quizAttempt.id);
      setAttemptResult(fresh || result);
      setQuizCompleted(true);
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

  if (quizCompleted) {
    const total = attemptResult?.total_questions ?? quiz?.questions?.length ?? 0;
    const correct = attemptResult?.correct_answers ?? (Array.isArray(attemptResult?.answers) ? attemptResult.answers.filter((a: any) => a?.is_correct).length : null);
    const percentage = (correct != null && total) ? Math.round((correct / total) * 100) : (attemptResult?.score ?? null);

    return (
      <SafeAreaView style={styles.container}>
        <MainHeader title={`Quiz Results`} iconName="trophy" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Banner */}
          <View style={{ backgroundColor: '#EEF2FF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E0E7FF' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 24 }}>🏆</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>{attemptResult?.is_passed ? 'Great job!' : 'Good effort!'}</Text>
                <Text style={{ color: '#4B5563', marginTop: 2 }}>Here is a summary of your performance.</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Text style={{ color: '#6B7280', fontWeight: '700' }}>Score</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 4 }}>{correct ?? '-'} / {total}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Text style={{ color: '#6B7280', fontWeight: '700' }}>Percentage</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 4 }}>{percentage != null ? `${percentage}%` : '-'}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Text style={{ color: '#6B7280', fontWeight: '700' }}>Time</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 4 }}>{attemptResult?.time_taken ? `${Math.round((attemptResult.time_taken as number) / 60)}m` : '—'}</Text>
              </View>
            </View>
          </View>

          {/* Review */}
          {Array.isArray(attemptResult?.answers) && (
            <View style={{ width: '100%', marginTop: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' }}>
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>Question Review</Text>
              </View>
              {attemptResult.answers.map((ans: any, idx: number) => (
                <View key={ans.id ?? idx} style={{ padding: 16, borderTopWidth: idx === 0 ? 0 : 1, borderTopColor: '#F3F4F6' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '800', color: '#374151' }}>Q{idx + 1}</Text>
                    <Text style={{ color: ans?.is_correct ? '#10B981' : '#EF4444', fontWeight: '800' }}>
                      {ans?.is_correct ? 'Correct' : 'Incorrect'}
                    </Text>
                  </View>
                  <Text style={{ marginTop: 6, color: '#111827' }}>{ans?.question?.question_text ?? 'Question'}</Text>
                  {ans?.selected_answer?.answer_text && (
                    <Text style={{ marginTop: 6, color: '#6B7280' }}>Your answer: {ans.selected_answer.answer_text}</Text>
                  )}
                  {ans?.question?.explanation && (
                    <Text style={{ marginTop: 6, color: '#6B7280' }}>Explanation: {ans.question.explanation}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 16 }} />
          <TouchableOpacity
            onPress={() => navigation.navigate('LessonList', { courseId: courseId || '', lessonCompleted: true })}
            style={{ backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            activeOpacity={0.9}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>Back to Lessons</Text>
          </TouchableOpacity>

          <View style={{ height: 10 }} />
          <TouchableOpacity
            onPress={async () => {
              try {
                const currentLessonIdNum = Number(lessonId);
                if (Number.isFinite(currentLessonIdNum)) {
                  await markLessonCompleted(currentLessonIdNum);
                }
                Alert.alert('Lesson Completed', 'Great job! This lesson has been marked as completed.');
                if (courseId) {
                  const course = await fetchCourseDetailWithProgress(Number(courseId));
                  const lessonsArr = Array.isArray(course?.lessons) ? course.lessons : [];
                  const idx = lessonsArr.findIndex((l: any) => l.id === currentLessonIdNum);
                  const next = idx >= 0 && idx + 1 < lessonsArr.length ? lessonsArr[idx + 1] : null;
                  if (next?.id) {
                    navigation.push('LessonDetail', { lessonId: String(next.id), courseId: String(courseId) });
                  } else {
                    navigation.navigate('LessonList', { courseId: String(courseId), lessonCompleted: true, completedLessonId: currentLessonIdNum });
                  }
                } else {
                  navigation.navigate('LessonList', { lessonCompleted: true, completedLessonId: Number(lessonId) });
                }
              } catch (e) {
                navigation.navigate('LessonList', { courseId: courseId || '', lessonCompleted: true });
              }
            }}
            style={{ backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            activeOpacity={0.9}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>Continue to Next Lesson</Text>
          </TouchableOpacity>
        </ScrollView>
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
            } else {
              // Last question → complete quiz
              handleCompleteQuiz(300);
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


