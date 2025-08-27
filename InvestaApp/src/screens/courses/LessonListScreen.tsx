import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, PRIMARY } from './constants/courseConstants';
import MainHeader from '../../components/MainHeader';
import LessonListAdvanced from './components/LessonListAdvanced';
import { fetchCourseDetail } from './utils/coursesApi';

type ParamList = {
  LessonList: { courseId?: string; course?: any; completedLessonId?: number };
};

const LessonListScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<ParamList, 'LessonList'>>();
  const courseParam = route.params?.course || { title: 'Course', totalLessons: 24, completed: 12 };
  const courseIdParam = route.params?.courseId;

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [course, setCourse] = useState<any>(courseParam);

  // Fetch course data when component mounts or courseId changes
  useEffect(() => {
    const loadCourseData = async () => {
      if (courseIdParam) {
        try {
          setLoading(true);
          const courseData = await fetchCourseDetail(Number(courseIdParam));
          setCourse(courseData);
          
          // Transform backend lessons to frontend format
          const transformedLessons = (courseData.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            minutes: l.estimated_duration || 15,
            state: 'available' as const,
          }));
          
          setLessons(transformedLessons);
        } catch (error) {
          console.error('Error loading course data:', error);
          // Fallback to default data only if no courseId
          if (!courseIdParam) {
            setLessons(DEFAULT_LESSONS);
            setCourse(courseParam);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // No courseId provided, use default data
        setLessons(DEFAULT_LESSONS);
        setCourse(courseParam);
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseIdParam]);

  // Handle lesson completion updates
  useEffect(() => {
    const completedIdRaw = route.params?.completedLessonId;
    const completedId = Number(completedIdRaw);
    
    if (!Number.isFinite(completedId) || completedId <= 0) return;
    
    setLessons(prev => {
      const next = prev.map(l => ({ ...l }));
      const idx = next.findIndex(l => l.id === completedId);
      
      if (idx === -1) return prev;
      
      // Mark the completed lesson
      next[idx].state = 'completed';
      delete (next[idx] as any).progress;
      
      // Unlock the next lesson if available
      const nextIdx = idx + 1;
      if (nextIdx < next.length) {
        const allPrevCompleted = next.slice(0, nextIdx).every(l => l.state === 'completed');
        if (allPrevCompleted) {
          // Clear any prior in-progress marker
          for (let i = 0; i < next.length; i++) {
            if (next[i].state === 'progress') {
              next[i].state = 'available';
              delete (next[i] as any).progress;
            }
          }
          if (next[nextIdx].state === 'locked') next[nextIdx].state = 'available';
          next[nextIdx].state = 'progress';
          (next[nextIdx] as any).progress = 0;
        }
      }
      return next;
    });
    
    // Clear the param after applying to avoid re-applying on future renders
    try {
      (navigation as any).setParams?.({ completedLessonId: undefined });
    } catch {}
  }, [route.params?.completedLessonId]);

  const DEFAULT_LESSONS = useMemo(() => ([
    { id: 1, title: 'Introduction to JavaScript', minutes: 8, state: 'completed' as const },
    { id: 2, title: 'Variables and Data Types', minutes: 12, state: 'completed' as const },
    { id: 3, title: 'Operators and Expressions', minutes: 15, state: 'completed' as const },
    { id: 4, title: 'Conditional Statements', minutes: 10, state: 'completed' as const },
    { id: 5, title: 'Loops and Iteration', minutes: 14, state: 'completed' as const },
    { id: 6, title: 'Arrays and Objects', minutes: 18, state: 'completed' as const },
    { id: 7, title: 'Functions Basics', minutes: 16, state: 'available' as const },
  ]), []);

  const nextLessonId = useMemo(() => {
    const inProgress = lessons.find(l => l.state === 'progress');
    if (inProgress) return inProgress.id;
    const available = lessons.find(l => l.state === 'available');
    if (available) return available.id;
    return lessons[0]?.id ?? 1;
  }, [lessons]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <MainHeader title="Loading..." iconName="book" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading course...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[0]}>
        <MainHeader 
          title={course.title || 'Course'} 
          iconName="book" 
          showBackButton 
          onBackPress={() => navigation.goBack()} 
        />
        
        {/* Continue CTA */}
        <View style={styles.ctaCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaOver}>Continue where you left off</Text>
            <Text style={styles.ctaTitle}>
              Lesson {nextLessonId}: {lessons.find(l => l.id === nextLessonId)?.title || 'Continue Learning'}
            </Text>
            <Text style={styles.ctaSub}>
              {lessons.find(l => l.id === nextLessonId)?.state === 'completed' 
                ? 'Great job! Keep going!' 
                : 'Continue your learning journey'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.ctaBtn} 
            onPress={() => {
              if (courseIdParam) {
                navigation.push('LessonDetail', { 
                  lessonId: String(nextLessonId),
                  courseId: courseIdParam 
                });
              } else {
                navigation.push('LessonDetail', { lessonId: String(nextLessonId) });
              }
            }}
          >
            <Text style={styles.ctaBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Lesson list */}
        <View style={styles.lessonList}>
          <LessonListAdvanced
            lessons={lessons}
            onStart={(id) => {
              const l = lessons.find(x => x.id === id);
              if (!l || l.state === 'locked') return;
              
              if (courseIdParam) {
                navigation.push('LessonDetail', { 
                  lessonId: String(id),
                  courseId: courseIdParam 
                });
              } else {
                navigation.push('LessonDetail', { lessonId: String(id) });
              }
            }}
            onContinue={(id) => {
              const l = lessons.find(x => x.id === id);
              if (!l || l.state === 'locked') return;
              
              if (courseIdParam) {
                navigation.push('LessonDetail', { 
                  lessonId: String(id),
                  courseId: courseIdParam 
                });
              } else {
                navigation.push('LessonDetail', { lessonId: String(id) });
              }
            }}
          />
        </View>

        {/* Certificate CTA */}
        <View style={{ marginTop: 16, marginBottom: 20, alignItems: 'center' }}>
          <TouchableOpacity
            disabled={!lessons.every((l: any) => l.state === 'completed')}
            onPress={() => navigation.navigate('Certificate' as never)}
            style={[{ paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
              lessons.every((l: any) => l.state === 'completed')
                ? { backgroundColor: '#7C3AED' }
                : { backgroundColor: '#E5E7EB' }
            ]}
          >
            <Text style={{ color: lessons.every((l: any) => l.state === 'completed') ? '#fff' : '#9CA3AF', fontWeight: '800' }}>
              {lessons.every((l: any) => l.state === 'completed') 
                ? '🎉 Download Certificate' 
                : `Complete lesson ${lessons.findIndex((l: any) => l.state !== 'completed') + 1} to download certificate`
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  headerSub: { fontSize: 12, color: TEXT_MUTED },
  progressWrap: { paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#fff' },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999 },
  progressFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  scroll: { paddingBottom: 32 },
  ctaCard: { backgroundColor: '#3B82F6', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 12 },
  ctaOver: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700' },
  ctaTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 2 },
  ctaSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 2 },
  ctaBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  ctaBtnText: { color: '#2563EB', fontWeight: '700' },
  itemCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 } as any,
  circle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  itemMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemMeta: { fontSize: 11, color: TEXT_MUTED, fontWeight: '700' },
  itemTitle: { fontSize: 14, color: TEXT_DARK, fontWeight: '700', marginTop: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  itemSmall: { fontSize: 11, color: TEXT_MUTED },
  smallTrack: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 999, marginTop: 6 },
  smallFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 999 },
  primaryBtn: { marginTop: 10, backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  darkBtn: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  darkBtnText: { color: '#fff', fontWeight: '700' },
  lessonList: { marginHorizontal: 12 },
});

export default LessonListScreen;


