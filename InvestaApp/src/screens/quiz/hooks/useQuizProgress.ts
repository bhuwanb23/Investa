import { useState, useCallback } from 'react';
import { QuizQuestion, QuizResult } from '../constants/quizData';

interface UseQuizProgressProps {
  questions: QuizQuestion[];
  onComplete?: (result: QuizResult) => void;
}

interface UseQuizProgressReturn {
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  isAnswered: boolean;
  showExplanation: boolean;
  progress: number;
  selectAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => QuizResult;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

export const useQuizProgress = ({
  questions,
  onComplete,
}: UseQuizProgressProps): UseQuizProgressReturn => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const selectAnswer = useCallback((answerIndex: number) => {
    if (!isAnswered) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIndex] = answerIndex;
      setSelectedAnswers(newAnswers);
      setIsAnswered(true);
      setShowExplanation(true);
    }
  }, [currentQuestionIndex, isAnswered, selectedAnswers]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setShowExplanation(false);
    }
  }, [currentQuestionIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsAnswered(selectedAnswers[currentQuestionIndex - 1] !== null);
      setShowExplanation(selectedAnswers[currentQuestionIndex - 1] !== null);
    }
  }, [currentQuestionIndex, selectedAnswers]);

  const submitQuiz = useCallback((): QuizResult => {
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken: 0, // This should be passed from timer
      quizId: '1', // This should be passed from props
    };

    onComplete?.(result);
    return result;
  }, [selectedAnswers, questions, onComplete]);

  const canGoNext = isAnswered && currentQuestionIndex < questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return {
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
  };
};
