import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  ImageBackground,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

const courses = [
  {
    id: '1',
    title: 'Complete JavaScript Mastery',
    level: 'Beginner',
    duration: '12h',
    rating: 4.8,
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/1c801c095c-b026bbaae17a99cc663d.png',
  },
  {
    id: '2',
    title: 'React Native for Professionals',
    level: 'Intermediate',
    duration: '9h',
    rating: 4.7,
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bad04d7dd9-c8347d58916f3c96b688.png',
  },
  {
    id: '3',
    title: 'Advanced TypeScript Patterns',
    level: 'Advanced',
    duration: '7h',
    rating: 4.6,
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4981a96f75-3f56dca742b509160291.png',
  },
];

const CoursesScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Explore Courses</Text>
            <Text style={styles.subtitle}>Grow your skills with curated content</Text>
          </View>

          {/* Search */}
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#9ca3af" />
            <TextInput
              placeholder="Search courses"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
            <Pressable style={styles.filterBtn} android_ripple={{ color: '#e5e7eb' }}>
              <Ionicons name="options-outline" size={18} color="#374151" />
            </Pressable>
          </View>

          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {categories.map((c, idx) => (
              <Pressable key={c.key} style={[styles.catChip, idx === 0 && styles.catChipActive]} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={[styles.catChipText, idx === 0 && styles.catChipTextActive]}>{c.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Courses Grid */}
          <View style={styles.grid}>
            {courses.map(course => (
              <View key={course.id} style={styles.card}>
                <ImageBackground source={{ uri: course.image }} style={styles.cardImage} imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <View style={styles.cardOverlay} />
                  <View style={styles.cardBadges}>
                    <View style={[styles.badge, { backgroundColor: PRIMARY }]}>
                      <Text style={styles.badgeText}>{course.level}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                      <Ionicons name="time-outline" size={12} color="#fff" />
                      <Text style={[styles.badgeText, { marginLeft: 4 }]}>{course.duration}</Text>
                    </View>
                  </View>
                </ImageBackground>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{course.title}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#facc15" />
                    <Text style={styles.ratingText}>{course.rating.toFixed(1)}</Text>
                  </View>
                  <Pressable style={styles.cardCta} android_ripple={{ color: '#4338ca' }}>
                    <Text style={styles.cardCtaText}>View Details</Text>
                  </Pressable>
                </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  subtitle: {
    marginTop: 4,
    color: TEXT_MUTED,
    fontSize: 13,
  },
  searchRow: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: TEXT_DARK,
  },
  filterBtn: {
    marginLeft: 8,
    height: 32,
    width: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRow: {
    paddingVertical: 12,
  },
  catChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  catChipText: {
    color: TEXT_DARK,
    fontSize: 12,
    fontWeight: '700',
  },
  catChipTextActive: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardImage: {
    height: 110,
    justifyContent: 'space-between',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cardBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    color: TEXT_DARK,
    fontWeight: '700',
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    marginLeft: 4,
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  cardCta: {
    marginTop: 8,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cardCtaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default CoursesScreen;
