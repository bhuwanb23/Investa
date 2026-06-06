import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LessonQuizContentProps {
  questionIndex: number;
  totalQuestions: number;
  question?: any;
  userAnswer?: any;
  onAnswerSubmit?: (questionId: number, answerId: number | null, textAnswer?: string) => void;
  onNextQuestion: () => void;
  onCompleteQuiz: () => void;
  quizAttempt?: any;
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const isBackendQuiz = !!question;
  const backendAnswers = question?.answers || [];
  const correctIndex = backendAnswers.findIndex((a: any) => !!a?.is_correct);
  const options: string[] = backendAnswers.map((a: any) => a?.answer_text ?? '');

  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(60);
  }, [questionIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (selectedAnswer === null) {
            handleAnswerSelect(-1);
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [questionIndex, selectedAnswer]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (onAnswerSubmit && question) {
      const answerId = question.answers?.[answerIndex]?.id || null;
      onAnswerSubmit(question.id, answerId);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer before continuing.');
      return;
    }
    if (questionIndex < totalQuestions - 1) {
      onNextQuestion();
    } else {
      onCompleteQuiz();
    }
  };

  if (!isBackendQuiz || !question) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="help-circle-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>Quiz Unavailable</Text>
          <Text style={styles.emptyStateText}>
            This lesson does not have a quiz yet. Check back later.
          </Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={onCompleteQuiz}>
            <Text style={styles.emptyStateButtonText}>Continue to Next Lesson</Text>
          </TouchableOpacity>
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
            Question {questionIndex + 1} of {totalQuestions}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((questionIndex + 1) / Math.max(1, totalQuestions)) * 100}%` },
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
        <Text style={styles.questionText}>{question?.question_text || question?.question || ''}</Text>
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption,
              showExplanation && index === correctIndex && styles.correctOption,
              showExplanation && selectedAnswer === index && index !== correctIndex && styles.incorrectOption,
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
                showExplanation && index === correctIndex && styles.correctOptionText,
              ]}>
                {option}
              </Text>
            </View>
            {showExplanation && index === correctIndex && (
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            )}
            {showExplanation && selectedAnswer === index && index !== correctIndex && (
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
          <Text style={styles.explanationText}>
            {question?.explanation || 'No explanation provided.'}
          </Text>
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
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {questionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
});

export default LessonQuizContent;
