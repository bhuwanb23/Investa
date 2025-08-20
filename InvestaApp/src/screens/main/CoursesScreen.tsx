import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import MainHeader from '../../components/MainHeader';
import { useNavigation } from '@react-navigation/native';
import CourseCard from '../courses/components/CourseCard';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED } from '../courses/constants/courseConstants';
import { Ionicons } from '@expo/vector-icons';

const CoursesScreen = () => {
  const navigation = useNavigation();
  // Local-only data (no backend)
  type Language = { id: number; code: string; name: string; native_name: string };
  type Lesson = { id: number; title: string; order: number; estimated_duration: number; content?: string; video_url?: string | null; is_active?: boolean };
  type Course = {
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
  const [courses] = useState<Course[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all'|'beginner'|'intermediate'|'advanced'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleCourses: Course[] = useMemo(() => ([
    {
      id: 101,
      title: 'React Native Basics',
      description: 'Learn mobile app development fundamentals',
      language: { id: 1, code: 'en', name: 'English', native_name: 'English' },
      difficulty_level: 'beginner',
      estimated_duration: 120,
      thumbnail: null,
      is_active: true,
      lessons: [
        { id: 1001, title: 'Introduction', order: 1, estimated_duration: 10, content: 'Welcome to React Native.' },
        { id: 1002, title: 'Components & Props', order: 2, estimated_duration: 20, content: 'Learn components.' },
      ],
    },
    {
      id: 102,
      title: 'SQL Mastery',
      description: 'Database querying and management skills',
      language: { id: 1, code: 'en', name: 'English', native_name: 'English' },
      difficulty_level: 'intermediate',
      estimated_duration: 180,
      thumbnail: null,
      is_active: true,
      lessons: [
        { id: 1101, title: 'SELECT Basics', order: 1, estimated_duration: 15, content: 'Basic selects.' },
        { id: 1102, title: 'JOINs', order: 2, estimated_duration: 25, content: 'Understanding joins.' },
      ],
    },
    {
      id: 103,
      title: 'Machine Learning Essentials',
      description: 'Core AI and ML fundamentals',
      language: { id: 1, code: 'en', name: 'English', native_name: 'English' },
      difficulty_level: 'advanced',
      estimated_duration: 240,
      thumbnail: null,
      is_active: true,
      lessons: [
        { id: 1201, title: 'ML Overview', order: 1, estimated_duration: 20, content: 'What is ML?' },
        { id: 1202, title: 'Linear Regression', order: 2, estimated_duration: 30, content: 'Basics of LR.' },
      ],
    },
  ]), []);

  // Backend disabled: no effects or refresh logic

  const dataSource: Course[] = useMemo(() => {
    const source = Array.isArray(courses) && courses.length > 0 ? courses : sampleCourses;
    const byFilter = selectedFilter === 'all' ? source : source.filter(c => c.difficulty_level === selectedFilter);
    if (!searchQuery.trim()) return byFilter;
    const q = searchQuery.toLowerCase();
    return byFilter.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [courses, sampleCourses, selectedFilter, searchQuery]);

  const recommended = dataSource[0];
  const usingSample = !(Array.isArray(courses) && courses.length > 0);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
  ] as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MainHeader title="Courses" iconName="library" />
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Search Bar */}
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search courses..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
            {filters.map(f => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setSelectedFilter(f.key)}
                activeOpacity={0.8}
                style={[styles.filterChip, selectedFilter === f.key && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, selectedFilter === f.key && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Recommended */}
          {recommended && (
            <View style={styles.recoCard}>
              <View style={styles.recoBadge}><Text style={styles.recoBadgeText}>Recommended</Text></View>
              <Text style={styles.recoTitle}>{recommended.title}</Text>
              <Text style={styles.recoSubtitle}>{recommended.description}</Text>
              <View style={styles.recoProgressTrack}>
                <View style={styles.recoProgressFill} />
              </View>
            </View>
          )}

          {/* Courses list (stacked) */}
          <Text style={styles.sectionTitle}>All Courses</Text>
          <View style={{ gap: 12 }}>
            {dataSource.map((c) => (
              <View key={c.id}>
                <CourseCard
                  course={c}
                  onPress={() => {
                    if (usingSample) {
                      navigation.navigate(
                        'CourseDetail' as never,
                        { courseId: String(c.id), course: c, sample: true } as never
                      );
                    } else {
                      navigation.navigate('CourseDetail' as never, { courseId: String(c.id), course: c } as never);
                    }
                  }}
                />
              </View>
            ))}
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
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  searchRow: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: TEXT_DARK,
  },
  filtersRow: {
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
  },
  filterText: { color: TEXT_MUTED, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  recoCard: {
    marginTop: 4,
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 16,
  },
  recoBadge: { alignSelf: 'flex-start', backgroundColor: '#F59E0B', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 10 },
  recoBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  recoTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  recoSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  recoProgressTrack: { marginTop: 10, height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 999 },
  recoProgressFill: { height: '100%', width: '65%', backgroundColor: '#fff', borderRadius: 999 },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  sectionTitle: { marginTop: 16, marginBottom: 10, color: TEXT_DARK, fontWeight: '800', fontSize: 16 },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: TEXT_MUTED,
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 12,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default CoursesScreen;
