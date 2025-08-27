import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QUIZ_QUESTIONS } from '../constants/courseConstants';

const { width } = Dimensions.get('window');

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonQuizContentProps {
  questionIndex: number;
  totalQuestions: number;
  question?: any; // Backend question data
  userAnswer?: any; // User's answer data
  onAnswerSubmit?: (questionId: number, answerId: number | null, textAnswer?: string) => void;
  onNextQuestion: () => void;
  onCompleteQuiz: () => void;
  quizAttempt?: any; // Quiz attempt data
}

const LessonQuizContent: React.FC<LessonQuizContentProps> = ({
  questionIndex,
  totalQuestions,
  question,
  userAnswer,
  onAnswerSubmit,
  onNextQuestion,
  onCompleteQuiz,
  quizAttempt,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question

  // Use backend question data if available, otherwise fall back to local data
  const currentQuestion = question || QUIZ_QUESTIONS[currentQuestionIndex];
  const isBackendQuiz = !!question;

  useEffect(() => {
    if (quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up, auto-submit
          if (selectedAnswer === null) {
            handleAnswerSelect(-1); // No answer selected
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, selectedAnswer, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answerIndex }));
    
    // If using backend quiz, submit answer immediately
    if (isBackendQuiz && onAnswerSubmit && currentQuestion) {
      const answerId = currentQuestion.answers?.[answerIndex]?.id || null;
      onAnswerSubmit(currentQuestion.id, answerId);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer before continuing.');
      return;
    }

    setShowExplanation(false);
    setSelectedAnswer(null);
    setTimeLeft(60);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers({});
    setQuizCompleted(false);
    setTimeLeft(60);
  };

  const calculateScore = () => {
    let correct = 0;
    Object.keys(answers).forEach(questionIndex => {
      const answer = answers[parseInt(questionIndex)];
      const question = QUIZ_QUESTIONS[parseInt(questionIndex)];
      if (answer === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: QUIZ_QUESTIONS.length, percentage: Math.round((correct / QUIZ_QUESTIONS.length) * 100) };
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: 'Excellent! You have a strong understanding of this topic.', color: '#10B981' };
    if (percentage >= 70) return { message: 'Good job! You understand most of the concepts.', color: '#3B82F6' };
    if (percentage >= 50) return { message: 'Not bad! Review the material to improve your understanding.', color: '#F59E0B' };
    return { message: 'Keep practicing! Review the lesson and try again.', color: '#EF4444' };
  };

  if (quizCompleted) {
    const score = calculateScore();
    const scoreInfo = getScoreMessage(score.percentage);

    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <View style={styles.scoreHeader}>
            <Ionicons 
              name={score.percentage >= 70 ? "trophy" : "school"} 
              size={48} 
              color={scoreInfo.color} 
            />
            <Text style={styles.quizCompleteText}>Quiz Complete!</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>{score.correct}/{score.total}</Text>
            <Text style={styles.percentageText}>{score.percentage}%</Text>
            <Text style={[styles.scoreMessage, { color: scoreInfo.color }]}>
              {scoreInfo.message}
            </Text>
          </View>

          <View style={styles.answersReview}>
            <Text style={styles.reviewTitle}>Question Review</Text>
            {QUIZ_QUESTIONS.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <View key={question.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewQuestionNumber}>Q{index + 1}</Text>
                    <Ionicons 
                      name={isCorrect ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={isCorrect ? "#10B981" : "#EF4444"} 
                    />
                  </View>
                  <Text style={styles.reviewQuestionText}>{question.question}</Text>
                  <Text style={styles.reviewAnswer}>
                    Your answer: {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                  </Text>
                  {!isCorrect && (
                    <Text style={styles.correctAnswer}>
                      Correct: {question.options[question.correctAnswer]}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeQuiz}>
              <Ionicons name="refresh" size={20} color="#6B7280" />
              <Text style={styles.retakeButtonText}>Retake Quiz</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.continueButton} onPress={onCompleteQuiz}>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              <Text style={styles.continueButtonText}>Continue Learning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
        <View style={styles.timerContainer}>
          <Ionicons name="time" size={16} color="#6B7280" />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption,
              showExplanation && index === currentQuestion.correctAnswer && styles.correctOption,
              showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && styles.incorrectOption,
            ]}
            onPress={() => handleAnswerSelect(index)}
            disabled={showExplanation}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionRadio}>
                {selectedAnswer === index && (
                  <View style={styles.optionRadioFill} />
                )}
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
                showExplanation && index === currentQuestion.correctAnswer && styles.correctOptionText,
              ]}>
                {option}
              </Text>
            </View>
            {showExplanation && index === currentQuestion.correctAnswer && (
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            )}
            {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
              <Ionicons name="close-circle" size={20} color="#EF4444" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Explanation */}
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <View style={styles.explanationHeader}>
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text style={styles.explanationTitle}>Explanation</Text>
          </View>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {selectedAnswer !== null && !showExplanation ? (
          <TouchableOpacity style={styles.checkAnswerButton} onPress={() => setShowExplanation(true)}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.checkAnswerText}>Check Answer</Text>
          </TouchableOpacity>
        ) : selectedAnswer !== null && showExplanation ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  correctOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },
  explanationContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  explanationText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: 16,
  },
  checkAnswerButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkAnswerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  quizCompleteText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#4F46E5',
    marginVertical: 8,
  },
  scoreMessage: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  answersReview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewQuestionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  reviewQuestionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewAnswer: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retakeButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LessonQuizContent;


