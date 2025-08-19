import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

interface QuizProgressBarProps {
  progress: number; // 0-100
  currentQuestion: number;
  totalQuestions: number;
  showPercentage?: boolean;
  height?: number;
  color?: string;
}

const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
  progress,
  currentQuestion,
  totalQuestions,
  showPercentage = true,
  height = 8,
  color = '#3B82F6',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion} of {totalQuestions}
        </Text>
        {showPercentage && (
          <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        )}
      </View>
      
      <ProgressBar
        progress={progress / 100}
        color={color}
        style={[styles.progressBar, { height }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  percentage: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    borderRadius: 4,
  },
});

export default QuizProgressBar;
