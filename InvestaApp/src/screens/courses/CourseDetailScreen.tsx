import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DetailHeader from './components/DetailHeader';
import LessonList from './components/LessonList';
// Local-first: avoid backend calls
type Language = { id: number; code: string; name: string; native_name: string };
type Lesson = { id: number; title: string; order: number; estimated_duration: number; content?: string; video_url?: string | null; is_active?: boolean };
type CourseDetail = {
  id: number;
  title: string;
  description: string;
  language: Language;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number;
  thumbnail?: string | null;
  is_active?: boolean;
  lessons?: Lesson[];
};
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, BORDER, CARD_BG, PRIMARY, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from './constants/courseConstants';

type ParamList = {
  CourseDetail: { courseId: string; course?: any; sample?: boolean };
};

const CourseDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'CourseDetail'>>();
  const courseId = Number(route.params?.courseId);
  const initialFromRoute = route.params?.course && route.params?.sample ? (route.params.course as CourseDetail) : null;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      if (initialFromRoute) {
        setCourse(initialFromRoute);
      } else {
        // No backend fetch; just show minimal placeholder if none passed
        setCourse(null);
        setError('Course not found');
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseId, initialFromRoute]);

  useEffect(() => {
    load();
  }, [load]);

  const onPressLesson = (lessonId: number) => {
    navigation.navigate('LessonDetail' as never, { lessonId: String(lessonId) } as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DetailHeader title={course?.title || 'Course'} subtitle={course ? DIFFICULTY_LABELS[course.difficulty_level] : ''} onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.center}> 
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading course…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
        </View>
      ) : course ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <View style={[styles.levelPill, { backgroundColor: DIFFICULTY_COLORS[course.difficulty_level] + '22' }]}>
              <Text style={[styles.levelPillText, { color: DIFFICULTY_COLORS[course.difficulty_level] }]}>
                {DIFFICULTY_LABELS[course.difficulty_level]}
              </Text>
            </View>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.desc}>{course.description}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Language: {course.language?.name}</Text>
              <Text style={styles.meta}>{course.estimated_duration} mins</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Lessons</Text>
          <LessonList lessons={course.lessons || []} onPressLesson={onPressLesson} />
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
  hero: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  levelPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginBottom: 8 },
  levelPillText: { fontSize: 12, fontWeight: '800' },
  title: { color: TEXT_DARK, fontSize: 16, fontWeight: '900', marginBottom: 8 },
  desc: { color: TEXT_MUTED, fontSize: 13 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  meta: { color: TEXT_MUTED, fontSize: 12, fontWeight: '700' },
  sectionTitle: { color: TEXT_DARK, fontSize: 16, fontWeight: '800', marginBottom: 10 },
});

export default CourseDetailScreen;


