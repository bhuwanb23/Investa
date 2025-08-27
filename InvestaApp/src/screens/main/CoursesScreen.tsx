import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import MainHeader from '../../components/MainHeader';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import type { Course as ApiCourse } from '../courses/utils/coursesApi';
import { fetchCourses } from '../courses/utils/coursesApi';
import CourseCard from '../courses/components/CourseCard';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED } from '../courses/constants/courseConstants';
import { Ionicons } from '@expo/vector-icons';

const CoursesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  // Courses from backend
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<'all'|'beginner'|'intermediate'|'advanced'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleCourses: ApiCourse[] = useMemo(() => ([
    {
      id: 101,
      title: 'React Native Basics',
      description: 'Learn mobile app development fundamentals',
      language: { id: 1, code: 'en', name: 'English', native_name: 'English' },
      difficulty_level: 'beginner',
      estimated_duration: 120,
      thumbnail: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&q=60&auto=format&fit=crop',
      is_active: true,
      lessons: [
        { id: 1001, title: 'Introduction', order: 1, estimated_duration: 10, content: 'Welcome to React Native.', video_url: null, is_active: true },
        { id: 1002, title: 'Components & Props', order: 2, estimated_duration: 20, content: 'Learn components.', video_url: null, is_active: true },
      ],
    },
    {
      id: 102,
      title: 'SQL Mastery',
      description: 'Database querying and management skills',
      language: { id: 1, code: 'en', name: 'English', native_name: 'English' },
      difficulty_level: 'intermediate',
      estimated_duration: 180,
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=60&auto=format&fit=crop',
      is_active: true,
      lessons: [
        { id: 1101, title: 'SELECT Basics', order: 1, estimated_duration: 15, content: 'Basic selects.', video_url: null, is_active: true },
        { id: 1102, title: 'JOINs', order: 2, estimated_duration: 25, content: 'Understanding joins.', video_url: null, is_active: true },
      ],
    },
    {
      id: 103,
      title: 'Machine Learning Essentials',
      description: 'Core AI and ML fundamentals',
      language: { id: 1, code: 'en', name: 'English', native_name: 'English' },
      difficulty_level: 'advanced',
      estimated_duration: 240,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981d?w=1200&q=60&auto=format&fit=crop',
      is_active: true,
      lessons: [
        { id: 1201, title: 'ML Overview', order: 1, estimated_duration: 20, content: 'What is ML?', video_url: null, is_active: true },
        { id: 1202, title: 'Linear Regression', order: 2, estimated_duration: 30, content: 'Basics of LR.', video_url: null, is_active: true },
      ],
    },
  ]), []);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dataSource: ApiCourse[] = useMemo(() => {
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
            <Ionicons name="search" size={18} color="#6B7280" />
            <TextInput
              placeholder="Search courses..."
              placeholderTextColor="#6B7280"
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

          {/* Loading / Error */}
          {loading && (
            <View style={styles.center}><Text style={styles.loadingText}>Loading courses…</Text></View>
          )}
          {!!error && !loading && (
            <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>
          )}

          {/* Courses list (stacked) */}
          <Text style={styles.sectionTitle}>All Courses</Text>
          <View style={{ gap: 12 }}>
            {dataSource.map((c) => (
              <View key={c.id}>
                <CourseCard
                  course={c}
                  onPress={() => {
                    // Navigate to CourseDetail, backend will fetch by ID
                    navigation.navigate('CourseDetail' as any, { courseId: String(c.id) });
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
    backgroundColor: '#EEF2FF',
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
