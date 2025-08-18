import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

const ProgressScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Progress</Text>
            <Text style={styles.subtitle}>Track your learning journey</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Courses Enrolled</Text>
              <Text style={styles.statValue}>6</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>3</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <View style={styles.barRow}>
              {['M','T','W','T','F','S','S'].map((d, idx) => (
                <View key={idx} style={styles.barItem}>
                  <View style={[styles.bar, { height: [30, 60, 40, 90, 50, 20, 35][idx] }]} />
                  <Text style={styles.barLabel}>{d}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}> 
            <Text style={styles.sectionTitle}>In Progress</Text>
            {[{ t:'React Native for Pros', p:62 }, { t:'Advanced TypeScript', p:35 }].map((c, idx) => (
              <View key={idx} style={styles.progressCard}> 
                <Text style={styles.courseTitle}>{c.t}</Text>
                <View style={styles.progressOuter}> 
                  <View style={[styles.progressInner, { width: `${c.p}%` }]} />
                </View>
                <Text style={styles.progressPct}>{c.p}%</Text>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginRight: 8,
  },
  statLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 6,
  },
  statValue: {
    color: TEXT_DARK,
    fontSize: 18,
    fontWeight: '800',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginBottom: 8,
  },
  barRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 10,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 11,
    color: TEXT_MUTED,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  courseTitle: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  progressOuter: {
    marginTop: 8,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
  },
  progressInner: {
    height: 8,
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
  progressPct: {
    marginTop: 6,
    color: TEXT_MUTED,
    fontSize: 12,
  },
});

export default ProgressScreen;
