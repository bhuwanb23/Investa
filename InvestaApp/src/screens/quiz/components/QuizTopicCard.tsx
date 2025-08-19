import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuizTopic } from '../constants/quizData';

interface QuizTopicCardProps {
  topic: QuizTopic;
  isSelected: boolean;
  onPress: () => void;
}

const QuizTopicCard: React.FC<QuizTopicCardProps> = ({
  topic,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        { backgroundColor: isSelected ? topic.bgColor : 'white' }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: topic.bgColor }]}>
          <Ionicons name={topic.icon as any} size={24} color={topic.color} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.description}>{topic.description}</Text>
        </View>
        
        <View style={[styles.radioButton, isSelected && styles.selectedRadio]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.statText}>{topic.timeLimit} min</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="help-circle-outline" size={14} color="#6B7280" />
            <Text style={styles.statText}>{topic.questions} questions</Text>
          </View>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: topic.bgColor }]}>
          <Text style={[styles.difficultyText, { color: topic.color }]}>
            {topic.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    borderColor: '#3B82F6',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default QuizTopicCard;
