import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CARD_BG, BORDER, TEXT_DARK, TEXT_MUTED, PRIMARY } from '../constants/courseConstants';

type Option = { id: 'A'|'B'|'C'|'D'; text: string };

type Props = {
  questionIndex?: number;
  totalQuestions?: number;
  onNextQuestion?: () => void;
  onCompleteQuiz?: () => void;
};

const LessonQuizContent: React.FC<Props> = ({ questionIndex = 1, totalQuestions = 5, onNextQuestion, onCompleteQuiz }) => {
  const [selected, setSelected] = useState<Option['id'] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const correctId: Option['id'] = 'B';
  const isCorrect = submitted && selected === correctId;

  const progressPct = Math.max(0, Math.min(100, Math.round((questionIndex / totalQuestions) * 100)));

  const options: Option[] = useMemo(() => ([
    { id: 'A', text: 'To make websites load faster on all devices' },
    { id: 'B', text: 'To ensure websites adapt and work well across different screen sizes and devices' },
    { id: 'C', text: 'To improve search engine optimization rankings' },
    { id: 'D', text: 'To reduce the amount of code needed for web development' },
  ]), []);

  const onSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  const onRetry = () => {
    setSubmitted(false);
    setSelected(null);
  };

  const onContinue = () => {
    if (questionIndex < totalQuestions) {
      onNextQuestion?.();
      setSubmitted(false);
      setSelected(null);
    } else {
      setShowCompletion(true);
      onCompleteQuiz?.();
    }
  };

  const Radio = ({ active, accent }: { active: boolean; accent?: string }) => (
    <View style={[styles.radioOuter, { borderColor: accent || '#D1D5DB' }]}> 
      <View style={[styles.radioInner, { backgroundColor: active ? (accent || PRIMARY) : 'transparent', transform: [{ scale: active ? 1 : 0 }] }]} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressText}>Question {questionIndex} of {totalQuestions}</Text>
      </View>

      {/* Question Card */}
      <View style={styles.card}>
        <View style={styles.questionTopRow}>
          <View style={styles.questionIconCircle}>
            <Ionicons name="help" size={18} color={PRIMARY} />
          </View>
          <Text style={styles.quizPill}>Quiz</Text>
        </View>
        <Text style={styles.questionTitle}>What is the primary purpose of responsive web design?</Text>
        <Text style={styles.questionSubtitle}>Choose the best answer that describes the main goal of responsive design.</Text>
      </View>

      {/* Options */}
      <View style={{ marginTop: 16 }}>
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const accent = PRIMARY;
          let borderColor = '#F3F4F6';
          let bgColor = '#FFFFFF';

          if (!submitted && isSelected) {
            borderColor = PRIMARY;
            bgColor = '#EEF2FF';
          }
          if (submitted) {
            if (opt.id === correctId) {
              borderColor = '#10B981';
              bgColor = '#ECFDF5';
            } else if (isSelected) {
              borderColor = '#EF4444';
              bgColor = '#FEF2F2';
            }
          }

          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.9}
              onPress={() => !submitted && setSelected(opt.id)}
              style={[styles.optionCard, { borderColor, backgroundColor: bgColor }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Radio active={!submitted ? isSelected : opt.id === correctId || isSelected} accent={!submitted ? (isSelected ? PRIMARY : undefined) : (opt.id === correctId ? '#10B981' : isSelected ? '#EF4444' : undefined)} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.optionLabel}>{opt.id}</Text>
                  <Text style={styles.optionText}>{opt.text}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback Section */}
      {submitted && !showCompletion && (
        <View style={{ marginTop: 16 }}>
          {isCorrect ? (
            <View style={[styles.feedbackCard, { borderColor: 'rgba(16,185,129,0.2)', backgroundColor: 'rgba(16,185,129,0.1)' }]}> 
              <View style={styles.feedbackRow}>
                <View style={[styles.feedbackIconCircle, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.feedbackTitle, { color: '#10B981' }]}>Correct!</Text>
                  <Text style={styles.feedbackBody}>
                    Responsive web design ensures that websites provide an optimal viewing and interaction experience across a wide range of devices, from desktop computers to mobile phones.
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.feedbackCard, { borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.1)' }]}> 
              <View style={styles.feedbackRow}>
                <View style={[styles.feedbackIconCircle, { backgroundColor: '#EF4444' }]}>
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.feedbackTitle, { color: '#EF4444' }]}>Not quite right</Text>
                  <Text style={[styles.feedbackBody, { marginBottom: 8 }]}>The correct answer is B. Responsive web design is primarily about ensuring websites adapt and work well across different screen sizes and devices.</Text>
                  <Text style={styles.feedbackSmall}>While performance and SEO are important, the main goal of responsive design is device compatibility and optimal user experience.</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Bottom Actions */}
      {!submitted && !showCompletion && (
        <View style={{ marginTop: 18 }}>
          <TouchableOpacity
            disabled={!selected}
            onPress={onSubmit}
            style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
          >
            <Text style={[styles.primaryBtnText, !selected && styles.primaryBtnTextDisabled]}>
              Submit Answer
            </Text>
          </TouchableOpacity>
          <Text style={styles.bottomHint}>{selected ? 'Ready to submit' : 'Select an answer to continue'}</Text>
        </View>
      )}

      {submitted && !showCompletion && (
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity onPress={onRetry} style={styles.secondaryBtn}>
            <Ionicons name="refresh" size={16} color="#374151" />
            <Text style={styles.secondaryText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onContinue} style={[styles.primaryBtn, { marginTop: 12 }]}>
            <Text style={styles.primaryBtnText}>Continue to Next Question</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtnPlain}> 
            <Text style={styles.secondaryPlainText}>Review Answers</Text>
          </TouchableOpacity>
        </View>
      )}

      {showCompletion && (
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <View style={[styles.feedbackIconCircle, { backgroundColor: '#10B981', width: 64, height: 64 }]}> 
              <Ionicons name="trophy" size={26} color="#FFFFFF" />
            </View>
            <Text style={[styles.feedbackTitle, { color: TEXT_DARK, marginTop: 8 }]}>Quiz Complete!</Text>
            <Text style={styles.caption}>You scored 4 out of 5 questions correctly</Text>
          </View>
          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 4 }]} onPress={() => onCompleteQuiz?.()}>
            <Text style={styles.primaryBtnText}>Continue to Next Lesson</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtnPlain}> 
            <Text style={styles.secondaryPlainText}>Review Answers</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  progressHeader: { marginBottom: 12 },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  progressText: { marginTop: 6, color: TEXT_MUTED, fontSize: 12, textAlign: 'center' },

  card: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  questionTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  questionIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  quizPill: { color: PRIMARY, backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, fontSize: 12, fontWeight: '700' },
  questionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  questionSubtitle: { fontSize: 13, color: TEXT_MUTED },

  optionCard: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#F3F4F6', borderRadius: 14, padding: 16, marginBottom: 12 },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 16, height: 16, borderRadius: 8 },
  optionLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  optionText: { fontSize: 15, color: '#374151', marginTop: 4 },

  feedbackCard: { borderWidth: 1, borderRadius: 14, padding: 16 },
  feedbackRow: { flexDirection: 'row', alignItems: 'flex-start' },
  feedbackIconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  feedbackTitle: { fontSize: 16, fontWeight: '800' },
  feedbackBody: { fontSize: 15, color: '#374151' },
  feedbackSmall: { fontSize: 12, color: TEXT_MUTED },

  primaryBtn: { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primaryBtnDisabled: { backgroundColor: '#D1D5DB' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  primaryBtnTextDisabled: { color: '#6B7280' },
  bottomHint: { textAlign: 'center', color: TEXT_MUTED, fontSize: 12, marginTop: 8 },

  secondaryBtn: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: BORDER, borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 as any },
  secondaryText: { color: '#374151', fontWeight: '800', fontSize: 15, marginLeft: 6 },
  secondaryBtnPlain: { marginTop: 10, backgroundColor: '#F9FAFB', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  secondaryPlainText: { color: '#374151', fontWeight: '700' },
  caption: { fontSize: 12, color: TEXT_MUTED },
});

export default LessonQuizContent;


