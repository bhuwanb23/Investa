import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { QUIZ_QUESTIONS } from './constants/quizData';
import { useQuizTimer } from './hooks/useQuizTimer';
import { useQuizProgress } from './hooks/useQuizProgress';
import QuizHeader from './components/QuizHeader';
import QuizTimer from './components/QuizTimer';
import QuizProgressBar from './components/QuizProgressBar';
import QuizQuestionCard from './components/QuizQuestionCard';
import QuizOptionButton from './components/QuizOptionButton';
import QuizExplanation from './components/QuizExplanation';

type QuizQuestionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'QuizQuestion'>;
type QuizQuestionScreenRouteProp = RouteProp<MainStackParamList, 'QuizQuestion'>;

const QuizQuestionScreen = () => {
  const navigation = useNavigation<QuizQuestionScreenNavigationProp>();
  const route = useRoute<QuizQuestionScreenRouteProp>();
  const { quizId, quizTitle, timeLimit } = route.params;

  const questions = QUIZ_QUESTIONS[quizId] || [];
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
    autoStart: true,
  });

  const {
    currentQuestionIndex,
    selectedAnswers,
    isAnswered,
    showExplanation,
    progress,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
  } = useQuizProgress({
    questions,
    onComplete: handleQuizComplete,
  });

  const currentQuestion = questions[currentQuestionIndex];

  function handleTimeUp() {
    Alert.alert(
      "Time's Up!",
      "The quiz time has expired. Your answers will be submitted automatically.",
      [
        {
          text: "OK",
          onPress: () => {
            const result = submitQuiz();
            navigation.navigate('QuizResult', {
              ...result,
              timeTaken: totalTime - timeLeft,
            });
          }
        }
      ]
    );
  }

  function handleQuizComplete(result: any) {
    navigation.navigate('QuizResult', {
      ...result,
      timeTaken: totalTime - timeLeft,
    });
  }

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
      selectAnswer(-1); // -1 indicates skipped
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const result = submitQuiz();
      navigation.navigate('QuizResult', {
        ...result,
        timeTaken: totalTime - timeLeft,
      });
    } else {
      nextQuestion();
    }
  };

  const handleHint = () => {
    Alert.alert(
      "Hint",
      "Read the question carefully and eliminate obviously wrong answers first.",
      [{ text: "OK" }]
    );
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <QuizHeader title="Quiz" onBack={handleExitQuiz} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No questions available for this quiz.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QuizHeader 
        title="Quiz" 
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
          question={currentQuestion.question}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <QuizOptionButton
              key={index}
              option={option}
              optionIndex={index}
              isSelected={selectedAnswers[currentQuestionIndex] === index}
              isCorrect={index === currentQuestion.correctAnswer}
              showResult={isAnswered}
              onPress={() => selectAnswer(index)}
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
              !canGoNext && styles.disabledButton,
            ]}
            onPress={handleNextQuestion}
            disabled={!canGoNext}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
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
