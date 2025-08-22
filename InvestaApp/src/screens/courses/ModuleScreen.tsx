import React from 'react';
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

type ParamList = {
  ModuleScreen: { courseId: string; course?: any };
};

const ModuleScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<ParamList, 'ModuleScreen'>>();
  const course = route.params?.course || {
    id: Number(route.params?.courseId) || 0,
    title: 'Module Overview',
    description: 'Learn advanced concepts with a modern curriculum.',
    estimated_duration: 270,
    difficulty_level: 'intermediate',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[0]}>
        <MainHeader title="Module Overview" iconName="library" showBackButton onBackPress={() => navigation.goBack()} />
        <ModuleHero
          title={course.title || 'Module Title'}
          description={course.description || 'Module short description.'}
          durationMinutes={course.estimated_duration || 180}
          difficulty={(course.difficulty_level || 'intermediate') as string}
        />

        <ProgressCard percent={67} hint={'8 of 12 lessons completed'} />

        <ObjectivesList
          objectives={[
            { text: 'Understand and implement closures in real-world scenarios', achieved: true },
            { text: 'Master asynchronous programming with async/await', achieved: true },
            { text: 'Build complex applications using modern ES6+ features' },
            { text: 'Optimize code performance and memory management' },
          ]}
        />

        <BadgesGrid
          badges={[
            { icon: 'code', title: 'Code Master', subtitle: 'Complete all exercises', highlighted: true },
            { icon: 'rocket', title: 'Speed Runner', subtitle: 'Finish in 3 days' },
            { icon: 'trophy', title: 'Expert', subtitle: 'Score 95%+ on quiz' },
          ]}
        />

        <ModuleStats lessonsCount={12} quizzesCount={5} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('LessonList', { courseId: String(course.id), course })}
        >
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.primaryBtnText}>Continue Module</Text>
        </TouchableOpacity>
        <Text style={styles.nextHint}>Next: Understanding Closures</Text>
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
  scroll: { padding: 16, paddingBottom: 100 },
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
    padding: 14,
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8 as any,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', marginLeft: 6 },
  nextHint: { textAlign: 'center', color: TEXT_MUTED, fontSize: 12, marginTop: 6 },
});

export default ModuleScreen;


