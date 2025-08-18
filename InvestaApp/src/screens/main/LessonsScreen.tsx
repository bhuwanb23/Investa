import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

const lessons = [
  { id: 'l1', title: 'Introduction to JavaScript', duration: '8:32', completed: true },
  { id: 'l2', title: 'Variables and Data Types', duration: '12:05', completed: true },
  { id: 'l3', title: 'Functions and Scope', duration: '15:44', completed: false },
  { id: 'l4', title: 'Asynchronous JS', duration: '10:21', completed: false },
  { id: 'l5', title: 'DOM Manipulation', duration: '16:08', completed: false },
];

const LessonsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Course Lessons</Text>
            <Text style={styles.subtitle}>Complete the modules in order to progress</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <Text style={styles.progressValue}>40%</Text>
            </View>
            <View style={styles.progressOuter}>
              <View style={[styles.progressInner, { width: '40%' }]} />
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            {lessons.map((lesson, idx) => (
              <Pressable key={lesson.id} style={styles.lessonRow} android_ripple={{ color: '#f3f4f6' }}>
                <View style={styles.lessonLeft}>
                  <View style={[styles.lessonIndex, lesson.completed && styles.lessonIndexDone]}>
                    <Text style={[styles.lessonIndexText, lesson.completed && styles.lessonIndexTextDone]}>
                      {idx + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lessonTitle} numberOfLines={1}>{lesson.title}</Text>
                    <Text style={styles.lessonMeta}>{lesson.duration}</Text>
                  </View>
                </View>
                <Ionicons
                  name={lesson.completed ? 'checkmark-circle' : 'chevron-forward'}
                  size={18}
                  color={lesson.completed ? '#22c55e' : '#9ca3af'}
                />
              </Pressable>
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
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
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
  progressCard: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  progressValue: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  progressOuter: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
  },
  progressInner: {
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 999,
  },
  lessonRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonIndex: {
    height: 32,
    width: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  lessonIndexDone: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  lessonIndexText: {
    color: TEXT_MUTED,
    fontWeight: '700',
  },
  lessonIndexTextDone: {
    color: '#166534',
  },
  lessonTitle: {
    color: TEXT_DARK,
    fontWeight: '700',
    fontSize: 14,
  },
  lessonMeta: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
});

export default LessonsScreen;
