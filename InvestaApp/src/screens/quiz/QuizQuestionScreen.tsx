import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { useQuizTimer } from './hooks/useQuizTimer';
import { useQuizProgress } from './hooks/useQuizProgress';
import QuizHeader from './components/QuizHeader';
import QuizTimer from './components/QuizTimer';
import QuizProgressBar from './components/QuizProgressBar';
import QuizQuestionCard from './components/QuizQuestionCard';
import QuizOptionButton from './components/QuizOptionButton';
import QuizExplanation from './components/QuizExplanation';
import { startQuizAttempt, submitQuizAnswer, completeQuizAttempt, getQuizAttempt } from '../courses/utils/coursesApi';
import api from '../../services/api';

type QuizQuestionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'QuizQuestion'>;
type QuizQuestionScreenRouteProp = RouteProp<MainStackParamList, 'QuizQuestion'>;

const QuizQuestionScreen = () => {
  const navigation = useNavigation<QuizQuestionScreenNavigationProp>();
  const route = useRoute<QuizQuestionScreenRouteProp>();
  const { quizId, quizTitle, timeLimit } = route.params;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [quizAttempt, setQuizAttempt] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initQuiz = async () => {
      try {
        setLoading(true);
        // 1. Fetch quiz details from backend
        const response = await api.get(`/quizzes/${quizId}/`);
        const quizData = response.data;
        setQuestions(quizData.questions || []);
        
        // 2. Start a new attempt
        const attempt = await startQuizAttempt(Number(quizId));
        setQuizAttempt(attempt);
      } catch (err) {
        console.error('Error initializing quiz:', err);
        setError('Failed to load quiz from server.');
      } finally {
        setLoading(false);
      }
    };
    initQuiz();
  }, [quizId]);

  const totalTime = timeLimit * 60; // Convert to seconds

  const {
    timeLeft,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useQuizTimer({
    initialTime: totalTime,
    onTimeUp: handleTimeUp,
    autoStart: !loading,
  });

  const {
    currentQuestionIndex,
    selectedAnswers,
    isAnswered,
    showExplanation,
    progress,
    selectAnswer,
    nextQuestion,
    submitQuiz,
    canGoNext,
    isLastQuestion,
  } = useQuizProgress({
    questions,
    onComplete: handleQuizComplete,
  });

  const currentQuestion = questions[currentQuestionIndex];

  async function handleTimeUp() {
    Alert.alert(
      "Time's Up!",
      "The quiz time has expired. Your answers will be submitted automatically.",
      [
        {
          text: "OK",
          onPress: async () => {
            await handleFinishQuiz();
          }
        }
      ]
    );
  }

  async function handleQuizComplete(result: any) {
    // This is called by useQuizProgress.submitQuiz()
    // We handle navigation in handleFinishQuiz instead
  }

  const handleFinishQuiz = async () => {
    try {
      setLoading(true);
      const timeTaken = totalTime - timeLeft;
      const result = await completeQuizAttempt(quizAttempt.id, timeTaken);
      
      navigation.navigate('QuizResult', {
        score: result.score,
        totalQuestions: result.total_questions,
        correctAnswers: result.correct_answers,
        timeTaken: result.time_taken,
        quizId: String(quizId),
      });
    } catch (err) {
      console.error('Error finishing quiz:', err);
      Alert.alert('Error', 'Failed to submit quiz results.');
    } finally {
      setLoading(false);
    }
  };

  const handleExitQuiz = () => {
    Alert.alert(
      "Exit Quiz",
      "Are you sure you want to exit? Your progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Exit", 
          style: "destructive",
          onPress: () => {
            resetTimer();
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleSkipQuestion = () => {
    if (!isAnswered) {
      handleSelectOption(-1); // -1 indicates skipped
    }
  };

  const handleSelectOption = async (optionIndex: number) => {
    if (isAnswered) return;
    
    try {
      // Find the answer ID from the current question's answers
      const selectedAnswer = optionIndex === -1 ? null : currentQuestion.answers[optionIndex];
      const answerId = selectedAnswer ? selectedAnswer.id : null;
      
      // Submit to backend
      await submitQuizAnswer(quizAttempt.id, currentQuestion.id, answerId);
      
      // Update local state via hook
      selectAnswer(optionIndex);
    } catch (err) {
      console.error('Error submitting answer:', err);
      Alert.alert('Error', 'Failed to save your answer.');
    }
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      await handleFinishQuiz();
    } else {
      nextQuestion();
    }
  };

  const handleHint = () => {
    Alert.alert(
      "Hint",
      currentQuestion?.explanation || "Read the question carefully and eliminate obviously wrong answers first.",
      [{ text: "OK" }]
    );
  };

  if (loading && !quizAttempt) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 12, color: '#6B7280' }}>Initializing quiz...</Text>
      </View>
    );
  }

  if (error || !currentQuestion) {
    return (
      <View style={styles.container}>
        <QuizHeader title="Quiz" onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "No questions available for this quiz."}</Text>
          <TouchableOpacity 
            style={{ marginTop: 16, padding: 12, backgroundColor: '#3B82F6', borderRadius: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QuizHeader 
        title={quizTitle} 
        onBack={handleExitQuiz}
        rightComponent={
          <QuizTimer timeLeft={timeLeft} formatTime={formatTime} />
        }
      />

      <QuizProgressBar
        progress={progress}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <QuizQuestionCard
          question={currentQuestion.question_text}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <View style={styles.optionsContainer}>
          {currentQuestion.answers.map((answer: any, index: number) => (
            <QuizOptionButton
              key={answer.id}
              option={answer.answer_text}
              optionIndex={index}
              isSelected={selectedAnswers[currentQuestionIndex] === index}
              isCorrect={answer.is_correct}
              showResult={isAnswered}
              onPress={() => handleSelectOption(index)}
              disabled={isAnswered}
            />
          ))}
        </View>

        <QuizExplanation
          explanation={currentQuestion.explanation}
          isVisible={showExplanation}
        />
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipQuestion}
            disabled={isAnswered}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              !canGoNext && !isLastQuestion && styles.disabledButton,
            ]}
            onPress={handleNextQuestion}
            disabled={!canGoNext && !isLastQuestion}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Hint Button */}
      <TouchableOpacity
        style={styles.hintButton}
        onPress={handleHint}
      >
        <Ionicons name="bulb" size={24} color="#92400E" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  hintButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: '#FCD34D',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default QuizQuestionScreen;
