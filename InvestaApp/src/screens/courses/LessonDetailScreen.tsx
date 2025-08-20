import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DetailHeader from './components/DetailHeader';
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
  const navigation = useNavigation();
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
    setTimeout(() => {
      setCompleted(true);
      setCompleting(false);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DetailHeader title={lesson?.title || 'Lesson'} subtitle={lesson?.course?.title} onBack={() => navigation.goBack()} />
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
        <ScrollView contentContainerStyle={styles.scroll}>
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

          <TouchableOpacity
            style={[styles.primaryBtn, completed && { backgroundColor: '#10B981' }]}
            onPress={handleMarkCompleted}
            disabled={completing}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>{completed ? 'Completed' : (completing ? 'Marking…' : 'Mark as Completed')}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}
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
});

export default LessonDetailScreen;


