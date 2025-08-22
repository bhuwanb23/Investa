import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
// Local-first lesson detail (no backend)
type Language = { id: number; code: string; name: string; native_name: string };
type Course = { id: number; title: string; description: string; language: Language; difficulty_level: 'beginner'|'intermediate'|'advanced'; estimated_duration: number };
type LessonDetail = { id: number; title: string; order: number; estimated_duration: number; content?: string; video_url?: string | null; course: Course };
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, BORDER, CARD_BG, PRIMARY } from './constants/courseConstants';
import { Ionicons } from '@expo/vector-icons';

type ParamList = {
  LessonDetail: { lessonId: string };
};

const LessonDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<ParamList, 'LessonDetail'>>();
  const lessonId = Number(route.params?.lessonId);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      // No backend fetch; show placeholder lesson
      setLesson({
        id: lessonId,
        title: 'Lesson',
        order: 1,
        estimated_duration: 10,
        content: 'Sample lesson content. Backend is disabled for now.',
        video_url: null,
        course: { id: 0, title: 'Sample Course', description: 'Sample', language: { id: 1, code: 'en', name: 'English', native_name: 'English' }, difficulty_level: 'beginner', estimated_duration: 60 },
      });
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkCompleted = async () => {
    setCompleting(true);
    // Immediately reflect completion in UI for responsiveness
    setCompleted(true);
    setCompleting(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[0]}>
        <MainHeader title={lesson?.title || 'Lesson'} iconName="book" showBackButton onBackPress={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.center}> 
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading lesson…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
        </View>
      ) : lesson ? (
        <View>
          <View style={styles.hero}>
            <Text style={styles.title}>{lesson.title}</Text>
            <Text style={styles.meta}>{lesson.estimated_duration} mins</Text>
          </View>

          {lesson.video_url ? (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play" size={22} color={PRIMARY} />
              <Text style={styles.videoText}>Video: {lesson.video_url}</Text>
            </View>
          ) : null}

          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{lesson.content || 'No content available.'}</Text>
          </View>

          {/* Key Takeaways */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeading}>Key Takeaways</Text>
            <View style={styles.bulletRow}><View style={styles.bulletDot} /><Text style={styles.bulletText}>Understand the main concept and where to apply it</Text></View>
            <View style={styles.bulletRow}><View style={styles.bulletDot} /><Text style={styles.bulletText}>Recognize common pitfalls and how to avoid them</Text></View>
            <View style={styles.bulletRow}><View style={styles.bulletDot} /><Text style={styles.bulletText}>Practice with a short exercise to reinforce learning</Text></View>
          </View>

          {/* Example Snippet */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeading}>Example</Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeLine}>{`// Example placeholder`}</Text>
              <Text style={styles.codeLine}>{`const result = doWork(input)`}</Text>
              <Text style={styles.codeLine}>{`console.log('Result:', result)`}</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeading}>Your Progress</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFillStrong, { width: `${Math.min(100, (lesson.estimated_duration / 20) * 20)}%` }]} /></View>
            <Text style={styles.smallMuted}>Estimated {lesson.estimated_duration} minutes</Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, completed && { backgroundColor: '#10B981' }]}
            onPress={() => {
              handleMarkCompleted();
              // Update existing LessonList params without pushing a new instance,
              // then navigate to the list screen so user sees next lesson unlocked
              (navigation as any).navigate({ name: 'LessonList', params: { completedLessonId: lessonId }, merge: true });
            }}
            disabled={completing}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>{completed ? 'Completed' : (completing ? 'Marking…' : 'Mark as Completed')}</Text>
          </TouchableOpacity>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.secondaryBtnOutline, { borderColor: '#E5E7EB' }]} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={14} color={TEXT_DARK} />
              <Text style={styles.secondaryBtnOutlineText}>Back to Lessons</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => (navigation as any).navigate('LessonQuiz', { currentLessonId: lessonId, nextLessonId: lessonId + 1 })}>
              <Ionicons name="help-circle" size={14} color="#fff" />
              <Text style={styles.secondaryBtnText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  scroll: { padding: 16, paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 10, color: TEXT_MUTED },
  errorText: { color: '#DC2626', marginBottom: 12 },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: PRIMARY, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700' },
  hero: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16 },
  title: { color: TEXT_DARK, fontSize: 16, fontWeight: '900' },
  meta: { color: TEXT_MUTED, fontSize: 12, fontWeight: '700', marginTop: 6 },
  videoPlaceholder: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16, alignItems: 'center' },
  videoText: { color: TEXT_MUTED, marginTop: 6 },
  contentCard: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16 },
  contentText: { color: TEXT_DARK, fontSize: 14, lineHeight: 20 },
  primaryBtn: { backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  cardSection: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16 },
  sectionHeading: { color: TEXT_DARK, fontWeight: '800', marginBottom: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY, marginTop: 6, marginRight: 10 },
  bulletText: { color: TEXT_DARK, flex: 1 },
  codeBlock: { backgroundColor: '#0B1020', borderRadius: 10, padding: 12 },
  codeLine: { color: '#E5E7EB', fontFamily: 'monospace' as any, fontSize: 12 },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  progressFillStrong: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  smallMuted: { color: TEXT_MUTED, fontSize: 12, marginTop: 6 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  secondaryBtnOutline: { flexDirection: 'row', alignItems: 'center', gap: 8 as any, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  secondaryBtnOutlineText: { color: TEXT_DARK, fontWeight: '700' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 as any, backgroundColor: PRIMARY, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  secondaryBtnText: { color: '#fff', fontWeight: '800' },
});

export default LessonDetailScreen;


