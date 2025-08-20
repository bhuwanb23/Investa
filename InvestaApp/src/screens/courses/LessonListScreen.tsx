import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, PRIMARY } from './constants/courseConstants';
import LessonListHeader from './components/LessonListHeader';
import LessonListAdvanced from './components/LessonListAdvanced';


type ParamList = {
  LessonList: { courseId: string; course?: any };
};

const LessonListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'LessonList'>>();
  const course = route.params?.course || { title: 'Course', totalLessons: 24, completed: 12 };

  const lessons = useMemo(
    () => [
      { id: 1, title: 'Introduction to JavaScript', minutes: 8, state: 'completed' as const },
      { id: 2, title: 'Variables and Data Types', minutes: 12, state: 'completed' as const },
      { id: 3, title: 'Operators and Expressions', minutes: 15, state: 'progress' as const, progress: 60 },
      { id: 4, title: 'Conditional Statements', minutes: 10, state: 'available' as const },
      { id: 5, title: 'Loops and Iteration', minutes: 14, state: 'available' as const },
      { id: 6, title: 'Arrays and Objects', minutes: 18, state: 'locked' as const },
      { id: 7, title: 'Functions Basics', minutes: 16, state: 'locked' as const },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LessonListHeader
        title={course.title || 'Course'}
        completed={course.completed || 12}
        total={course.totalLessons || 24}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Continue CTA */}
        <View style={styles.ctaCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaOver}>Continue where you left off</Text>
            <Text style={styles.ctaTitle}>Lesson 13: Functions</Text>
            <Text style={styles.ctaSub}>Learn about declarations and expressions</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('LessonDetail' as never, { lessonId: String(13) } as never)}>
            <Text style={styles.ctaBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Lesson list */}
        <LessonListAdvanced
          lessons={lessons as any}
          onStart={(id) => navigation.navigate('LessonDetail' as never, { lessonId: String(id) } as never)}
          onContinue={(id) => navigation.navigate('LessonDetail' as never, { lessonId: String(id) } as never)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
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
  scroll: { padding: 16, paddingBottom: 32 },
  ctaCard: { backgroundColor: '#3B82F6', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
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
});

export default LessonListScreen;


