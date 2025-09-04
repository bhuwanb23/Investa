import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '../../components/MainHeader';
import { progressApi, ProgressSummary, WeeklyActivity } from '../../services';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const SUCCESS = '#10b981';
const WARNING = '#f59e0b';
const CARD_BG = '#ffffff';
const CARD_BORDER = '#e5e7eb';

const ProgressScreen = () => {
  const [progressData, setProgressData] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);

  // Fetch progress data on component mount
  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [progressRes, weeklyRes] = await Promise.all([
        progressApi.getProgressSummary(),
        progressApi.getWeeklyActivity()
      ]);
      
      setProgressData(progressRes);
      setWeeklyActivity(weeklyRes);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      // Set default data on error
      setProgressData({
        id: 1,
        user: 1,
        current_level: 1,
        experience_points: 0,
        experience_to_next_level: 100,
        learning_completion_percentage: 0,
        course_completion_percentage: 0,
        quiz_completion_percentage: 0,
        overall_progress_percentage: 0,
        current_streak_days: 0,
        longest_streak_days: 0,
        total_activity_days: 0,
        portfolio_value: 0,
        portfolio_growth_percentage: 0,
        win_rate: 0,
        total_badges: 0,
        earned_badges: 0,
        total_achievements: 0,
        earned_achievements: 0,
        updated_at: new Date().toISOString()
      });
      setWeeklyActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProgressData();
    } catch (error) {
      console.error('Error refreshing progress data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Use real data or fallback to defaults - ensure all values are numbers
  const level = Number(progressData?.current_level) || 1;
  const experiencePoints = Number(progressData?.experience_points) || 0;
  const experienceToNext = Number(progressData?.experience_to_next_level) || 100;
  const currentStreak = Number(progressData?.current_streak_days) || 0;
  const longestStreak = Number(progressData?.longest_streak_days) || 0;
  const totalActivityDays = Number(progressData?.total_activity_days) || 0;
  const avgScore = Number(progressData?.quiz_completion_percentage) || 0;
  const portfolioValue = Number(progressData?.portfolio_value) || 0;
  const portfolioGrowth = Number(progressData?.portfolio_growth_percentage) || 0;
  const winRate = Number(progressData?.win_rate) || 0;
  const earnedBadges = Number(progressData?.earned_badges) || 0;
  const totalBadges = Number(progressData?.total_badges) || 0;
  const earnedAchievements = Number(progressData?.earned_achievements) || 0;
  const totalAchievements = Number(progressData?.total_achievements) || 0;

  // Calculate progress percentages - ensure all values are numbers
  const learningProgress = Number(progressData?.learning_completion_percentage) || 0;
  const courseProgress = Number(progressData?.course_completion_percentage) || 0;
  const quizProgress = Number(progressData?.quiz_completion_percentage) || 0;
  const overallProgress = Number(progressData?.overall_progress_percentage) || 0;

  // Generate weekly activity data
  const weeklyHeights = weeklyActivity.length > 0 
    ? weeklyActivity.map(w => Math.max(10, w.activity_score / 2))
    : [30, 60, 40, 90, 50, 20, 35];

  // Generate sparkline data based on portfolio performance
  const sparklineHeights = [8, 12, 9, 14, 10, 16, 18, 15, 20, 24, 20, 26];

  // Mock data for in-progress courses (this would come from backend)
  const inProgressCourses = [
    { title: 'React Native for Pros', percent: Math.round(courseProgress * 0.8) },
    { title: 'Advanced TypeScript', percent: Math.round(courseProgress * 0.6) },
  ];

  // Mock badges (this would come from backend)
  const badges = [
    { icon: 'star', bgFrom: '#facc15', label: 'First Quiz' },
    { icon: 'school', bgFrom: '#22c55e', label: 'Course Hero' },
    { icon: 'bar-chart', bgFrom: '#3b82f6', label: 'Trader' },
    { icon: 'flame', bgFrom: '#ef4444', label: 'Streak' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MainHeader title="Your Progress" iconName="analytics" />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading progress data...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, styles.fullWidth]} 
          showsVerticalScrollIndicator={false} 
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <MainHeader 
            title="Your Progress" 
            iconName="analytics" 
            onRefreshPress={onRefresh}
          />
          <View style={styles.pagePadding}>

          {/* XP Level */}
          <View style={styles.xpCard}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.levelText}>Level {level}</Text>
              <Text style={styles.levelSubtitle}>
                {level < 3 ? 'Beginner Trader' : 
                 level < 6 ? 'Intermediate Trader' : 
                 level < 9 ? 'Advanced Trader' : 'Expert Trader'}
              </Text>
            </View>
            <View style={styles.xpBarWrap}>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: `${Math.min(100, (experiencePoints / (experiencePoints + experienceToNext)) * 100)}%` }]} />
              </View>
              <View style={styles.xpRow}>
                <Text style={styles.xpText}>{experiencePoints.toLocaleString()} XP</Text>
                <Text style={styles.xpText}>{(experiencePoints + experienceToNext).toLocaleString()} XP</Text>
              </View>
              <Text style={styles.xpToNext}>{experienceToNext} XP to next level</Text>
            </View>
            <View style={styles.kpiMiniRow}>
              <View style={styles.kpiMini}>
                <Ionicons name="flame" size={18} color={WARNING} />
                <Text style={styles.kpiMiniValue}>{currentStreak}</Text>
                <Text style={styles.kpiMiniLabel}>Day Streak</Text>
              </View>
              <View style={styles.kpiMini}>
                <Ionicons name="trophy" size={18} color="#facc15" />
                <Text style={styles.kpiMiniValue}>{earnedAchievements}</Text>
                <Text style={styles.kpiMiniLabel}>Achievements</Text>
              </View>
              <View style={styles.kpiMini}>
                <Ionicons name="star" size={18} color="#93c5fd" />
                <Text style={styles.kpiMiniValue}>{avgScore.toFixed(1)}</Text>
                <Text style={styles.kpiMiniLabel}>Avg Score</Text>
              </View>
            </View>
          </View>

          {/* Recent Achievement */}
          {earnedAchievements > 0 && (
            <View style={styles.achievementCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="medal" size={18} color="#fde68a" />
                </View>
                <View>
                  <Text style={styles.achievementTitle}>New Achievement!</Text>
                  <Text style={styles.achievementSubtitle}>
                    {earnedAchievements} of {totalAchievements} Achievements Unlocked
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Learning Progress */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="book" size={16} color={PRIMARY} />
                <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Course Completion</Text>
              </View>
              <Text style={styles.metaText}>{Math.round(courseProgress)}% Complete</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${courseProgress}%`, backgroundColor: PRIMARY }]} />
            </View>
            <Text style={styles.smallMuted}>{courseProgress}% Complete</Text>
          </View>

          {/* Weekly Activity */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <View style={styles.weeklyRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                <View key={idx} style={styles.weekItem}>
                  <View style={[styles.weekBar, { height: weeklyHeights[idx] || 20 }]} />
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
              <Text style={styles.metaText}>Overall</Text>
            </View>
            <View style={styles.kpiGrid3}>
              {[
                { label: 'Accuracy', val: Math.round(quizProgress), color: SUCCESS }, 
                { label: 'Completion', val: Math.round(learningProgress), color: PRIMARY }, 
                { label: 'Overall', val: Math.round(overallProgress), color: '#a855f7' }
              ].map((k, idx) => (
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
              <Text style={[styles.metaText, { color: portfolioGrowth >= 0 ? SUCCESS : '#ef4444' }]}>
                {portfolioGrowth >= 0 ? '+' : ''}{portfolioGrowth.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.sparklineRow}>
              {sparklineHeights.map((h, i) => (
                <View key={i} style={[styles.sparkBar, { height: h }]} />
              ))}
            </View>
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>₹{portfolioValue.toLocaleString()}</Text>
                <Text style={styles.smallMuted}>Portfolio Value</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiValue, { color: SUCCESS }]}>{winRate.toFixed(1)}%</Text>
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
    paddingBottom: 24,
  },
  pagePadding: {
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: TEXT_MUTED,
  },
});

export default ProgressScreen;
