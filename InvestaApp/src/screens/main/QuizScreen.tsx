import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

const sampleQuestion = {
  title: 'Which of the following best describes the purpose of render props in React?',
  options: [
    'To share code between components using a prop whose value is a function',
    'To manage global state using a centralized store',
    'To optimize rendering by memoizing component outputs',
    'To define static type checks for component props',
  ],
  correctIndex: 0,
};

const QuizScreen = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = () => setSubmitted(true);
  const isCorrect = submitted && selected === sampleQuestion.correctIndex;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Quick Quiz</Text>
            <Text style={styles.subtitle}>Test your understanding</Text>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.qTitle}>{sampleQuestion.title}</Text>
            <View style={{ marginTop: 12 }}>
              {sampleQuestion.options.map((opt, idx) => {
                const active = selected === idx;
                const correct = submitted && idx === sampleQuestion.correctIndex;
                const wrong = submitted && active && idx !== sampleQuestion.correctIndex;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => !submitted && setSelected(idx)}
                    style={[styles.optionRow, active && styles.optionActive, correct && styles.optionCorrect, wrong && styles.optionWrong]}
                    android_ripple={{ color: '#e5e7eb' }}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive, (correct || wrong) && styles.optionTextContrast]}>
                      {opt}
                    </Text>
                    {correct && <Ionicons name="checkmark-circle" size={18} color="#fff" />}
                    {wrong && <Ionicons name="close-circle" size={18} color="#fff" />}
                  </Pressable>
                );
              })}
            </View>

            {!submitted ? (
              <Pressable style={[styles.primaryBtn, !selected && styles.disabledBtn]} disabled={selected == null} onPress={onSubmit} android_ripple={{ color: '#4338ca' }}>
                <Text style={styles.primaryBtnText}>Submit</Text>
              </Pressable>
            ) : (
              <View style={styles.resultRow}>
                <Ionicons name={isCorrect ? 'happy-outline' : 'sad-outline'} size={18} color={isCorrect ? '#22c55e' : '#ef4444'} />
                <Text style={[styles.resultText, { color: isCorrect ? '#16a34a' : '#ef4444' }]}>
                  {isCorrect ? 'Great job! That is correct.' : 'Not quite. Review the lesson and try again.'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  subtitle: {
    marginTop: 4,
    color: TEXT_MUTED,
    fontSize: 13,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
  },
  qTitle: {
    color: TEXT_DARK,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22,
  },
  optionRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  optionActive: {
    borderColor: PRIMARY,
    backgroundColor: '#eef2ff',
  },
  optionCorrect: {
    backgroundColor: '#22c55e',
    borderColor: '#16a34a',
  },
  optionWrong: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  optionText: {
    color: TEXT_DARK,
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextActive: {
    color: PRIMARY,
  },
  optionTextContrast: {
    color: '#fff',
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  resultRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default QuizScreen;
