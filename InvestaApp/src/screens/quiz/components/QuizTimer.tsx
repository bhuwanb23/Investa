import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuizTimerProps {
  timeLeft: number; // in seconds
  formatTime: (seconds: number) => string;
  isWarning?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({
  timeLeft,
  formatTime,
  isWarning = false,
}) => {
  const getTimerColor = () => {
    if (timeLeft <= 30) return '#EF4444'; // Red for last 30 seconds
    if (timeLeft <= 60) return '#F59E0B'; // Orange for last minute
    return '#3B82F6'; // Blue for normal time
  };

  const getBackgroundColor = () => {
    if (timeLeft <= 30) return '#FEF2F2'; // Light red
    if (timeLeft <= 60) return '#FFFBEB'; // Light orange
    return '#EFF6FF'; // Light blue
  };

  return (
    <View style={[styles.timerContainer, { backgroundColor: getBackgroundColor() }]}>
      <Ionicons name="time-outline" size={20} color={getTimerColor()} />
      <Text style={[styles.timerText, { color: getTimerColor() }]}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizTimer;
