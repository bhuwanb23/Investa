import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { MainStackParamList } from '../../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type QuizQuestionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'QuizQuestion'>;
type QuizQuestionScreenRouteProp = RouteProp<MainStackParamList, 'QuizQuestion'>;

const QuizQuestionScreen = () => {
  const navigation = useNavigation<QuizQuestionScreenNavigationProp>();
  const route = useRoute<QuizQuestionScreenRouteProp>();
  const { quizId, quizTitle, timeLimit } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock quiz questions
  const questions = [
    {
      id: 1,
      question: "What is a stock?",
      options: [
        "A type of bond issued by companies",
        "A share of ownership in a company",
        "A government security",
        "A type of mutual fund"
      ],
      correctAnswer: 1,
      explanation: "A stock represents a share of ownership in a company. When you buy a stock, you're purchasing a small piece of that company, called a share."
    },
    {
      id: 2,
      question: "What is the primary purpose of a stock exchange?",
      options: [
        "To provide loans to companies",
        "To facilitate buying and selling of securities",
        "To regulate company operations",
        "To provide insurance for investors"
      ],
      correctAnswer: 1,
      explanation: "Stock exchanges provide a marketplace where buyers and sellers can trade securities like stocks, bonds, and other financial instruments."
    },
    {
      id: 3,
      question: "What does 'bull market' refer to?",
      options: [
        "A market where prices are falling",
        "A market where prices are rising",
        "A market with high volatility",
        "A market with low trading volume"
      ],
      correctAnswer: 1,
      explanation: "A bull market is characterized by rising stock prices and optimistic investor sentiment, typically lasting for an extended period."
    },
    {
      id: 4,
      question: "What is a dividend?",
      options: [
        "A fee paid to brokers",
        "A portion of company profits paid to shareholders",
        "A type of stock option",
        "A government tax on investments"
      ],
      correctAnswer: 1,
      explanation: "A dividend is a distribution of profits by a corporation to its shareholders, usually paid in cash or additional shares."
    },
    {
      id: 5,
      question: "What is market capitalization?",
      options: [
        "The total number of shares outstanding",
        "The total value of a company's shares",
        "The price of a single share",
        "The annual revenue of a company"
      ],
      correctAnswer: 1,
      explanation: "Market capitalization is calculated by multiplying the current share price by the total number of outstanding shares."
    }
  ];

  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up, submit quiz
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      // Save answer
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);

      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowExplanation(false);
      } else {
        handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate results
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeTaken = (timeLimit * 60) - timeLeft;

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Navigate to results
    navigation.navigate('QuizResult', {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken,
      quizId,
    });
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
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            navigation.goBack();
          }
        }
      ]
    );
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExitQuiz} style={styles.exitButton}>
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.quizTitle}>{quizTitle}</Text>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <ProgressBar 
          progress={progress / 100} 
          color="#3B82F6" 
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Answer Options */}
        <View style={styles.optionsSection}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = currentQuestion.correctAnswer === index;
            const showResult = isAnswered && (isSelected || isCorrect);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption,
                  showResult && isCorrect && styles.correctOption,
                  showResult && isSelected && !isCorrect && styles.incorrectOption,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                    showResult && isCorrect && styles.correctOptionText,
                    showResult && isSelected && !isCorrect && styles.incorrectOptionText,
                  ]}>
                    {option}
                  </Text>
                  {showResult && (
                    <Ionicons 
                      name={isCorrect ? "checkmark-circle" : "close-circle"} 
                      size={24} 
                      color={isCorrect ? "#10B981" : "#EF4444"} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {showExplanation && (
          <View style={styles.explanationSection}>
            <Text style={styles.explanationTitle}>Explanation</Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {!isAnswered ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedAnswer === null && styles.disabledButton,
            ]}
            onPress={() => {
              setIsAnswered(true);
              setShowExplanation(true);
            }}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.nextButtonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        )}
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
  exitButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  questionCounter: {
    fontSize: 14,
    color: '#6B7280',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  progressSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  questionSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 26,
  },
  optionsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#065F46',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#991B1B',
    fontWeight: '600',
  },
  explanationSection: {
    backgroundColor: '#F0F9FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizQuestionScreen;
