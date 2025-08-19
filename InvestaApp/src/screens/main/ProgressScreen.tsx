import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '../../components/MainHeader';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const SUCCESS = '#10b981';
const WARNING = '#f59e0b';
const CARD_BG = '#ffffff';
const CARD_BORDER = '#e5e7eb';

const ProgressScreen = () => {
  const weeklyHeights = [30, 60, 40, 90, 50, 20, 35];
  const sparklineHeights = [8, 12, 9, 14, 10, 16, 18, 15, 20, 24, 20, 26];
  const inProgressCourses = [
    { title: 'React Native for Pros', percent: 62 },
    { title: 'Advanced TypeScript', percent: 35 },
  ];
  const badges = [
    { icon: 'star', bgFrom: '#facc15', label: 'First Quiz' },
    { icon: 'school', bgFrom: '#22c55e', label: 'Course Hero' },
    { icon: 'bar-chart', bgFrom: '#3b82f6', label: 'Trader' },
    { icon: 'flame', bgFrom: '#ef4444', label: 'Streak' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <MainHeader title="Your Progress" iconName="analytics" />

          {/* XP Level */}
          <View style={styles.xpCard}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.levelText}>Level 12</Text>
              <Text style={styles.levelSubtitle}>Intermediate Trader</Text>
            </View>
            <View style={styles.xpBarWrap}>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: '84%' }]} />
              </View>
              <View style={styles.xpRow}>
                <Text style={styles.xpText}>8,420 XP</Text>
                <Text style={styles.xpText}>10,000 XP</Text>
              </View>
              <Text style={styles.xpToNext}>1,580 XP to next level</Text>
            </View>
            <View style={styles.kpiMiniRow}>
              <View style={styles.kpiMini}>
                <Ionicons name="flame" size={18} color={WARNING} />
                <Text style={styles.kpiMiniValue}>47</Text>
                <Text style={styles.kpiMiniLabel}>Day Streak</Text>
              </View>
              <View style={styles.kpiMini}>
                <Ionicons name="trophy" size={18} color="#facc15" />
                <Text style={styles.kpiMiniValue}>23</Text>
                <Text style={styles.kpiMiniLabel}>Achievements</Text>
              </View>
              <View style={styles.kpiMini}>
                <Ionicons name="star" size={18} color="#93c5fd" />
                <Text style={styles.kpiMiniValue}>4.8</Text>
                <Text style={styles.kpiMiniLabel}>Avg Score</Text>
              </View>
            </View>
          </View>

          {/* Recent Achievement */}
          <View style={styles.achievementCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.achievementIcon}>
                <Ionicons name="medal" size={18} color="#fde68a" />
              </View>
              <View>
                <Text style={styles.achievementTitle}>New Achievement!</Text>
                <Text style={styles.achievementSubtitle}>Quiz Master - 10 Perfect Scores</Text>
              </View>
            </View>
          </View>

          {/* Learning Progress */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="book" size={16} color={PRIMARY} />
                <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Course Completion</Text>
              </View>
              <Text style={styles.metaText}>7/10 modules</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '70%', backgroundColor: PRIMARY }]} />
            </View>
            <Text style={styles.smallMuted}>70% Complete</Text>
          </View>

          {/* Weekly Activity */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <View style={styles.weeklyRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                <View key={idx} style={styles.weekItem}>
                  <View style={[styles.weekBar, { height: weeklyHeights[idx] }]} />
                  <Text style={styles.weekLabel}>{d}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quiz Performance */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="fitness" size={16} color="#a855f7" />
                <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Quiz Performance</Text>
              </View>
              <Text style={styles.metaText}>Last 7 days</Text>
            </View>
            <View style={styles.kpiGrid3}>
              {[{ label: 'Accuracy', val: 90, color: SUCCESS }, { label: 'Speed', val: 85, color: PRIMARY }, { label: 'Overall', val: 92, color: '#a855f7' }].map((k, idx) => (
                <View key={idx} style={styles.ringCard}>
                  <View style={styles.ringWrap}>
                    <View style={styles.ringOuter}>
                      <View style={[styles.ringInner, { backgroundColor: k.color, width: `${Math.min(100, k.val)}%` }]} />
                    </View>
                    <View style={[styles.scoreBubble, { left: `${Math.min(100, k.val)}%`, borderColor: k.color }]}> 
                      <Text style={[styles.scoreText, { color: k.color }]}>{k.val}%</Text>
                    </View>
                  </View>
                  <Text style={styles.smallMuted}>{k.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Trading Simulation Snapshot */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="bar-chart" size={16} color={SUCCESS} />
                <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Portfolio Growth</Text>
              </View>
              <Text style={[styles.metaText, { color: SUCCESS }]}>+12.4%</Text>
            </View>
            <View style={styles.sparklineRow}>
              {sparklineHeights.map((h, i) => (
                <View key={i} style={[styles.sparkBar, { height: h }]} />
              ))}
            </View>
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>₹1,12,400</Text>
                <Text style={styles.smallMuted}>Portfolio Value</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiValue, { color: SUCCESS }]}>68%</Text>
                <Text style={styles.smallMuted}>Win Rate</Text>
              </View>
            </View>
          </View>

          {/* In Progress Courses */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            {inProgressCourses.map((c, idx) => (
              <View key={idx} style={styles.courseCard}>
                <Text style={styles.courseTitle}>{c.title}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${c.percent}%` }]} />
                </View>
                <Text style={styles.smallMuted}>{c.percent}%</Text>
              </View>
            ))}
          </View>

          {/* Badges */}
          <View style={[styles.card, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Achievement Badges</Text>
            <View style={styles.badgeGrid}>
              {badges.map((b, idx) => (
                <View key={idx} style={styles.badgeCard}>
                  <View style={[styles.badgeIconWrap, { backgroundColor: '#eef2ff' }]}>
                    <Ionicons name={b.icon as any} size={18} color={PRIMARY} />
                  </View>
                  <Text style={styles.badgeLabel}>{b.label}</Text>
                </View>
              ))}
            </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
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
  xpCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    padding: 14,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  levelSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: TEXT_MUTED,
  },
  xpBarWrap: {
    marginTop: 12,
  },
  xpBarTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: 8,
    backgroundColor: WARNING,
    borderRadius: 999,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  xpText: {
    fontSize: 12,
    color: TEXT_DARK,
    fontWeight: '700',
  },
  xpToNext: {
    marginTop: 6,
    fontSize: 12,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
  kpiMiniRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiMini: {
    width: '32%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  kpiMiniValue: {
    marginTop: 6,
    color: TEXT_DARK,
    fontWeight: '800',
  },
  kpiMiniLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  achievementCard: {
    marginTop: 12,
    backgroundColor: SUCCESS,
    borderRadius: 16,
    padding: 14,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 2,
  },
  achievementTitle: {
    color: '#fff',
    fontWeight: '800',
  },
  achievementSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
  },
  metaText: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  smallMuted: {
    marginTop: 6,
    color: TEXT_MUTED,
    fontSize: 12,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  weekItem: {
    alignItems: 'center',
    flex: 1,
  },
  weekBar: {
    width: 10,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },
  weekLabel: {
    marginTop: 6,
    fontSize: 11,
    color: TEXT_MUTED,
  },
  kpiGrid3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ringCard: {
    width: '32%',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 12,
  },
  ringWrap: {
    width: 72,
    position: 'relative',
    paddingVertical: 6,
  },
  ringOuter: {
    width: 72,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  ringInner: {
    height: '100%',
    borderRadius: 999,
  },
  scoreBubble: {
    position: 'absolute',
    top: -6,
    transform: [{ translateX: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreText: {
    fontWeight: '900',
    fontSize: 11,
  },
  sparklineRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  sparkBar: {
    width: 8,
    borderRadius: 3,
    backgroundColor: SUCCESS,
    marginRight: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  kpiValue: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '800',
  },
  courseCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  courseTitle: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  progressTrack: {
    marginTop: 8,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  badgeCard: {
    width: '23.5%',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
});

export default ProgressScreen;
