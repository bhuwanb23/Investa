import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuizExplanationProps {
  explanation: string;
  isVisible: boolean;
}

const QuizExplanation: React.FC<QuizExplanationProps> = ({
  explanation,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={20} color="#3B82F6" />
        <Text style={styles.title}>Explanation</Text>
      </View>
      <Text style={styles.explanationText}>{explanation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F9FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default QuizExplanation;
