import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '../../components/MainHeader';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// Define navigation types
type RootStackParamList = {
  Courses: undefined;
  Quiz: undefined;
  Trading: undefined;
  Progress: undefined;
  Profile: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Mock data - replace with actual API data
  const userProgress = {
    completedLessons: 12,
    totalLessons: 25,
    currentStreak: 5,
    totalPoints: 850,
    overallProgress: 0.73,
  };

  const quickAccessItems = [
    {
      id: 1,
      title: 'Learn',
      subtitle: 'Master trading basics',
      icon: 'school',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      badge: '3 new lessons',
      onPress: () => navigation.navigate('Courses'),
    },
    {
      id: 2,
      title: 'Quiz',
      subtitle: 'Test your knowledge',
      icon: 'help-circle',
      color: '#059669',
      bgColor: '#DCFCE7',
      badge: '85% accuracy',
      onPress: () => navigation.navigate('Quiz'),
    },
    {
      id: 3,
      title: 'Trade',
      subtitle: 'Practice trading',
      icon: 'trending-up',
      color: '#06B6D4',
      bgColor: '#CFFAFE',
      badge: '$12,450 profit',
      onPress: () => navigation.navigate('Trading'),
    },
    {
      id: 4,
      title: 'Progress',
      subtitle: 'Track performance',
      icon: 'analytics',
      color: '#7C3AED',
      bgColor: '#F3E8FF',
      badge: 'Level 7',
      onPress: () => navigation.navigate('Progress'),
    },
  ];

  const learningPathItems = [
    {
      id: 1,
      title: 'Trading Fundamentals',
      status: 'completed',
      description: 'Completed',
      icon: 'checkmark',
      color: '#059669',
    },
    {
      id: 2,
      title: 'Technical Analysis',
      status: 'in-progress',
      description: 'In Progress (60%)',
      icon: 'play',
      color: '#0891B2',
    },
    {
      id: 3,
      title: 'Risk Management',
      status: 'locked',
      description: 'Locked',
      icon: 'lock-closed',
      color: '#9CA3AF',
    },
  ];

  const portfolioData = {
    totalValue: '$12,450',
    profit: '+$1,250',
    profitPercentage: '+12.5%',
    totalTrades: 8,
  };

  const achievements = [
    {
      id: 1,
      title: 'First Trade',
      icon: 'trophy',
      bgColor: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      id: 2,
      title: 'Quiz Master',
      icon: 'medal',
      bgColor: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      id: 3,
      title: '7 Day Streak',
      icon: 'star',
      bgColor: '#DCFCE7',
      iconColor: '#16A34A',
    },
    {
      id: 4,
      title: 'Expert Level',
      icon: 'diamond',
      bgColor: '#F3E8FF',
      iconColor: '#7C3AED',
    },
  ];

  // New sample content
  const dailyTip = {
    title: 'Daily Tip',
    icon: 'bulb',
    message: 'Diversify across sectors to lower risk. Rebalance quarterly to maintain target allocation.',
  };

  const recommendedCourses = [
    { id: 'rc1', title: 'Market Basics 101', level: 'Beginner', progress: 0.3, color: '#3B82F6' },
    { id: 'rc2', title: 'Reading Candlesticks', level: 'Intermediate', progress: 0.55, color: '#10B981' },
    { id: 'rc3', title: 'Options Essentials', level: 'Advanced', progress: 0.1, color: '#7C3AED' },
  ];

  const trendingStocks = [
    { symbol: 'AAPL', name: 'Apple', change: '+1.8%', up: true },
    { symbol: 'TSLA', name: 'Tesla', change: '-0.7%', up: false },
    { symbol: 'NVDA', name: 'Nvidia', change: '+2.4%', up: true },
    { symbol: 'AMZN', name: 'Amazon', change: '+0.9%', up: true },
  ];

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <View style={styles.heroAccentCircle} />
      <View style={[styles.heroAccentCircle, { right: -24, top: -12, width: 120, height: 120, opacity: 0.15 }]} />
      <View style={styles.welcomeHeader}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' }}
            style={styles.profileImage}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome back, {user?.username || 'Sarah'}!</Text>
            <Text style={styles.welcomeSubtitle}>Ready to level up your trading skills?</Text>
          </View>
        </View>
      </View>

      <View style={styles.statRow}>
        <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="book" size={16} color="#fff" />
          </View>
          <Text style={styles.statValue}>{userProgress.completedLessons}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="flame" size={16} color="#fff" />
          </View>
          <Text style={styles.statValue}>{userProgress.currentStreak}d</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="trophy" size={16} color="#fff" />
          </View>
          <Text style={styles.statValue}>{userProgress.totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Overall Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(userProgress.overallProgress * 100)}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${userProgress.overallProgress * 100}%` },
            ]}
          />
        </View>
        <View style={styles.progressMetaRow}>
          <View style={styles.progressPill}><Text style={styles.progressPillText}>{userProgress.completedLessons} / {userProgress.totalLessons} Lessons</Text></View>
          <View style={styles.progressPill}><Text style={styles.progressPillText}>Streak: {userProgress.currentStreak} days</Text></View>
          <View style={styles.progressPill}><Text style={styles.progressPillText}>{userProgress.totalPoints} pts</Text></View>
        </View>
      </View>
    </View>
  );

  const renderQuickAccess = () => (
    <View style={styles.quickAccessSection}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <FlatList
        data={quickAccessItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.quickAccessTitle}>{item.title}</Text>
            <Text style={styles.quickAccessSubtitle}>{item.subtitle}</Text>
            <Text style={[styles.quickAccessBadge, { color: item.color }]}>{item.badge}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderLearningPath = () => (
    <View style={styles.learningPathSection}>
      <Text style={styles.sectionTitle}>Learning Path</Text>
      <View style={styles.learningPathList}>
        {learningPathItems.map((item) => (
          <View key={item.id} style={styles.learningPathItem}>
            <View style={[styles.learningPathIcon, { backgroundColor: item.color }]}>
              <Ionicons
                name={item.icon as any}
                size={16}
                color="white"
              />
            </View>
            <View style={styles.learningPathContent}>
              <Text style={[
                styles.learningPathTitle,
                { color: item.status === 'locked' ? '#9CA3AF' : '#1F2937' }
              ]}>
                {item.title}
              </Text>
              <Text style={[
                styles.learningPathDescription,
                { color: item.status === 'locked' ? '#9CA3AF' : '#6B7280' }
              ]}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPortfolioSnapshot = () => (
    <View style={styles.portfolioSection}>
      <View style={styles.portfolioHeader}>
        <Text style={styles.sectionTitle}>Simulated Portfolio</Text>
        <Text style={styles.portfolioProfit}>{portfolioData.profitPercentage}</Text>
      </View>
      <View style={styles.portfolioStats}>
        <View style={styles.portfolioStat}>
          <Text style={styles.portfolioValue}>{portfolioData.totalValue}</Text>
          <Text style={styles.portfolioLabel}>Total Value</Text>
        </View>
        <View style={styles.portfolioStat}>
          <Text style={styles.portfolioProfitValue}>{portfolioData.profit}</Text>
          <Text style={styles.portfolioLabel}>Profit</Text>
        </View>
        <View style={styles.portfolioStat}>
          <Text style={styles.portfolioValue}>{portfolioData.totalTrades}</Text>
          <Text style={styles.portfolioLabel}>Trades</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsSection}>
      <Text style={styles.sectionTitle}>Your Achievements</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsScrollContainer}
      >
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: achievement.bgColor }]}>
              <Ionicons name={achievement.icon as any} size={24} color={achievement.iconColor} />
            </View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderDailyTip = () => (
    <View style={styles.tipCard}>
      <View style={[styles.tipIconWrap, { backgroundColor: '#E0E7FF' }]}>
        <Ionicons name={dailyTip.icon as any} size={18} color="#4F46E5" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tipTitle}>{dailyTip.title}</Text>
        <Text style={styles.tipText}>{dailyTip.message}</Text>
      </View>
    </View>
  );

  const renderRecommended = () => (
    <View style={styles.recommendedSection}>
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
        {recommendedCourses.map((c) => (
          <TouchableOpacity key={c.id} style={styles.recoCard} activeOpacity={0.85} onPress={() => navigation.navigate('Courses')}>
            <View style={[styles.recoBadge, { backgroundColor: c.color }]}>
              <Ionicons name="play" size={14} color="#fff" />
            </View>
            <Text style={styles.recoTitle} numberOfLines={2}>{c.title}</Text>
            <Text style={styles.recoSub}>{c.level}</Text>
            <View style={styles.recoTrack}><View style={[styles.recoFill, { width: `${Math.round(c.progress * 100)}%`, backgroundColor: c.color }]} /></View>
            <Text style={styles.recoHint}>{Math.round(c.progress * 100)}% complete</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMarket = () => (
    <View style={styles.marketSection}>
      <Text style={styles.sectionTitle}>Market Snapshot</Text>
      <View style={styles.marketList}>
        {trendingStocks.map((s) => (
          <View key={s.symbol} style={styles.marketItem}>
            <View style={styles.marketSymbolWrap}><Text style={styles.marketSymbol}>{s.symbol}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.marketName}>{s.name}</Text>
              <Text style={[styles.marketChange, { color: s.up ? '#059669' : '#DC2626' }]}>{s.change}</Text>
            </View>
            <Ionicons name={s.up ? 'trending-up' : 'trending-down'} size={18} color={s.up ? '#059669' : '#DC2626'} />
          </View>
        ))}
      </View>
    </View>
  );

  const renderCTA = () => (
    <TouchableOpacity activeOpacity={0.9} style={styles.bigCTA} onPress={() => navigation.navigate('Courses')}>
      <View style={styles.ctaLeft}>
        <Ionicons name="sparkles" size={20} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.bigCTATitle}>Continue Learning</Text>
        <Text style={styles.bigCTASub}>Pick up where you left off in Technical Analysis</Text>
      </View>
      <View style={styles.ctaRight}><Ionicons name="arrow-forward" size={18} color="#fff" /></View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
    >
      <MainHeader title="Home" iconName="home" />
      {renderWelcomeSection()}
      {renderDailyTip()}
      {renderQuickAccess()}
      {renderRecommended()}
      {renderLearningPath()}
      {renderMarket()}
      {renderCTA()}
      {renderPortfolioSnapshot()}
      {renderAchievements()}
      <View style={{ height: 84 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  welcomeSection: {
    margin: 16,
    backgroundColor: '#0891B2',
    borderRadius: 16,
    padding: 24,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { color: '#fff', fontWeight: '800', fontSize: 16 },
  statLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 11 },
  heroAccentCircle: {
    position: 'absolute',
    left: -20,
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  welcomeHeader: {
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 12,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#CFFAFE',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#CFFAFE',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
  },
  progressPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  progressPillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  quickAccessSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: (width - 64) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  quickAccessBadge: {
    fontSize: 12,
    fontWeight: '500',
  },
  learningPathSection: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  learningPathList: {
    gap: 16,
  },
  learningPathItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learningPathIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  learningPathContent: {
    flex: 1,
  },
  learningPathTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  learningPathDescription: {
    fontSize: 14,
  },
  portfolioSection: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  portfolioProfit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portfolioStat: {
    alignItems: 'center',
    flex: 1,
  },
  portfolioValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  portfolioProfitValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  portfolioLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsSection: {
    margin: 16,
    marginTop: 0,
    marginBottom: 100,
  },
  achievementsScrollContainer: {
    paddingRight: 16,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  tipCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  tipIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  tipText: { fontSize: 13, color: '#1F2937', marginTop: 2 },
  recommendedSection: { margin: 16, marginTop: 6 },
  recoCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  recoBadge: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  recoTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  recoSub: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  recoTrack: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 999, marginTop: 10 },
  recoFill: { height: '100%', borderRadius: 999 },
  recoHint: { fontSize: 11, color: '#6B7280', marginTop: 6 },
  marketSection: { margin: 16, marginTop: 0, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  marketList: { marginTop: 6 },
  marketItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  marketSymbolWrap: { width: 54 },
  marketSymbol: { fontWeight: '800', color: '#111827' },
  marketName: { fontSize: 12, color: '#6B7280' },
  marketChange: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  bigCTA: { marginHorizontal: 16, backgroundColor: '#4F46E5', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  ctaLeft: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  bigCTATitle: { color: '#FFFFFF', fontWeight: '800' },
  bigCTASub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 2 },
  ctaRight: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  bottomSpacing: {
    height: 84,
  },
});

export default HomeScreen;

