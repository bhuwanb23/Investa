import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
import { Ionicons } from '@expo/vector-icons';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, PRIMARY } from './constants/courseConstants';
import ModuleHero from './components/ModuleHero';
import ProgressCard from './components/ProgressCard';
import ObjectivesList from './components/ObjectivesList';
import BadgesGrid from './components/BadgesGrid';
import ModuleStats from './components/ModuleStats';
import { fetchCourseDetailWithProgress } from './utils/coursesApi';

type ParamList = {
  ModuleScreen: { courseId: string; course?: any };
};

const ModuleScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<ParamList, 'ModuleScreen'>>();
  const courseIdParam = route.params?.courseId;
  const courseParam = route.params?.course;

  const [course, setCourse] = useState<any>(courseParam || {
    id: Number(courseIdParam) || 0,
    title: 'Module Overview',
    description: 'Learn advanced concepts with a modern curriculum.',
    estimated_duration: 270,
    difficulty_level: 'intermediate',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [lessons, setLessons] = useState<any[]>([]);

  // Fetch course data when component mounts
  useEffect(() => {
    const loadCourseData = async () => {
      if (courseIdParam) {
        try {
          setLoading(true);
          console.log('🔄 Loading course data for ModuleScreen, courseId:', courseIdParam);
          const courseData = await fetchCourseDetailWithProgress(Number(courseIdParam));
          setCourse(courseData);
          setLessons(courseData.lessons || []);
          console.log('📊 Course data loaded for ModuleScreen:', courseData);
        } catch (error) {
          console.error('Error loading course data in ModuleScreen:', error);
          // Keep the courseParam as fallback
        } finally {
          setLoading(false);
        }
      }
    };

    loadCourseData();
  }, [courseIdParam]);

  // Calculate progress based on completed lessons
  const completedLessons = lessons.filter((lesson: any) => 
    lesson.user_progress?.status === 'completed'
  ).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get next lesson for the hint
  const nextLesson = lessons.find((lesson: any) => 
    lesson.user_progress?.status !== 'completed'
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <MainHeader title="Loading..." iconName="library" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading module...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[0]}>
        <MainHeader title="Module Overview" iconName="library" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={{ marginHorizontal: 12 }}>
          <ModuleHero
            title={course.title || 'Module Title'}
            description={course.description || 'Module short description.'}
            durationMinutes={course.estimated_duration || 180}
            difficulty={(course.difficulty_level || 'intermediate') as string}
          />
        </View>

        <View style={{ marginHorizontal: 12 }}>
          <ProgressCard 
            percent={progressPercentage} 
            hint={`${completedLessons} of ${totalLessons} lessons completed`} 
          />
        </View>

        <View style={{ marginHorizontal: 12 }}>
          <ObjectivesList
            objectives={[
              { text: 'Complete all lessons in the module', achieved: completedLessons === totalLessons && totalLessons > 0 },
              { text: 'Achieve 80% or higher on assessments', achieved: false },
              { text: 'Apply concepts in practical exercises', achieved: completedLessons >= Math.ceil(totalLessons * 0.5) },
              { text: 'Participate in module discussions', achieved: false },
            ]}
          />
        </View>

        <View style={{ marginHorizontal: 12 }}>
          <BadgesGrid
            badges={[
              { icon: 'code', title: 'Module Master', subtitle: 'Complete all lessons', highlighted: completedLessons === totalLessons && totalLessons > 0 },
              { icon: 'rocket', title: 'Fast Learner', subtitle: 'Finish in 3 days', highlighted: false },
              { icon: 'trophy', title: 'Perfect Score', subtitle: 'Score 100% on quiz', highlighted: false },
            ]}
          />
        </View>

        <View style={{ marginHorizontal: 12 }}>
          <ModuleStats lessonsCount={totalLessons} quizzesCount={Math.ceil(totalLessons / 5)} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => {
            if (courseIdParam) {
              navigation.navigate('LessonList', { 
                courseId: courseIdParam, 
                course: course 
              });
            }
          }}
        >
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.primaryBtnText}>
            {completedLessons === 0 ? 'Start Module' : 'Continue Module'}
          </Text>
        </TouchableOpacity>
        {nextLesson && (
          <Text style={styles.nextHint}>Next: {nextLesson.title}</Text>
        )}
      </View>
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
    paddingVertical: 12,
  },
  iconBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  scroll: { paddingBottom: 100 },
  hero: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  heroBubble: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#ffffff22',
  },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 6 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)' },
  heroMetaRow: { flexDirection: 'row', gap: 14, marginTop: 10 } as any,
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 } as any,
  metaText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { color: TEXT_MUTED, fontWeight: '700', fontSize: 12 },
  track: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, marginTop: 8 },
  fill: { height: '100%', width: '67%', backgroundColor: PRIMARY, borderRadius: 999 },
  cardHint: { marginTop: 6, color: TEXT_MUTED, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: TEXT_DARK, fontWeight: '800' },
  objectiveRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  objectiveText: { fontSize: 13 },
  badgeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeItem: { width: '32%', alignItems: 'center' },
  badgeIconPrimary: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeIconDim: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeTitle: { fontSize: 12, fontWeight: '700', color: TEXT_DARK },
  badgeSub: { fontSize: 11, color: TEXT_MUTED },
  badgeItemDim: { opacity: 0.6 },
  badgeTitleDim: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
  badgeSubDim: { fontSize: 11, color: '#9CA3AF' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 12,
    paddingBottom: 20,
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 48,
    marginHorizontal: 12,
  },
  primaryBtnText: { 
    color: '#fff', 
    fontWeight: '800', 
    marginLeft: 4,
    fontSize: 14,
  },
  nextHint: { textAlign: 'center', color: TEXT_MUTED, fontSize: 12, marginTop: 6 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PAGE_BG,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
});

export default ModuleScreen;


