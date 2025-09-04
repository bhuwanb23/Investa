import React, { useEffect, useRef, useState } from 'react';
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
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '../../components/MainHeader';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import LogoLoader from '../../components/LogoLoader';

const { width, height } = Dimensions.get('window');

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
  const [showBootLoader, setShowBootLoader] = useState(true);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const timer = setTimeout(() => setShowBootLoader(false), 800);

    // Staggered entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1200,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Staggered card animations
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 200 + (index * 100),
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, []);

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
    <Animated.View 
      style={[
        styles.welcomeSection,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={styles.heroAccentCircle} />
      <View style={[styles.heroAccentCircle, { right: -16, top: -8, width: 100, height: 100, opacity: 0.15 }]} />
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
            <Ionicons name="book" size={14} color="#fff" />
          </View>
          <Text style={styles.statValue}>{userProgress.completedLessons}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="flame" size={14} color="#fff" />
          </View>
          <Text style={styles.statValue}>{userProgress.currentStreak}d</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="trophy" size={14} color="#fff" />
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
          <Animated.View
            style={[
              styles.progressBarFill,
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${userProgress.overallProgress * 100}%`]
                })
              },
            ]}
          />
        </View>
        <View style={styles.progressMetaRow}>
          <View style={styles.progressPill}><Text style={styles.progressPillText}>{userProgress.completedLessons} / {userProgress.totalLessons}</Text></View>
          <View style={styles.progressPill}><Text style={styles.progressPillText}>Streak: {userProgress.currentStreak}d</Text></View>
          <View style={styles.progressPill}><Text style={styles.progressPillText}>{userProgress.totalPoints} pts</Text></View>
        </View>
      </View>
    </Animated.View>
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
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: cardAnimations[index],
              transform: [
                {
                  translateY: cardAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                },
                {
                  scale: cardAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }
              ]
            }}
          >
            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={item.onPress}
              activeOpacity={0.7}
              pressRetentionOffset={{ top: 20, left: 20, bottom: 20, right: 20 }}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={styles.quickAccessTitle}>{item.title}</Text>
              <Text style={styles.quickAccessSubtitle}>{item.subtitle}</Text>
              <Text style={[styles.quickAccessBadge, { color: item.color }]}>{item.badge}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </View>
  );

  const renderLearningPath = () => (
    <View style={styles.learningPathSection}>
      <Text style={styles.sectionTitle}>Learning Path</Text>
      <View style={styles.learningPathList}>
        {learningPathItems.map((item, index) => (
          <Animated.View 
            key={item.id} 
            style={[
              styles.learningPathItem,
              {
                opacity: cardAnimations[Math.min(index, 3)],
                transform: [
                  {
                    translateX: cardAnimations[Math.min(index, 3)].interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={[styles.learningPathIcon, { backgroundColor: item.color }]}>
              <Ionicons
                name={item.icon as any}
                size={14}
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
          </Animated.View>
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
      <View style={styles.achievementsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsScrollContainer}
          nestedScrollEnabled={true}
        >
          {achievements.map((achievement, index) => (
            <Animated.View 
              key={achievement.id} 
              style={[
                styles.achievementCard,
                {
                  opacity: cardAnimations[Math.min(index, 3)],
                  transform: [
                    {
                      scale: cardAnimations[Math.min(index, 3)].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={[styles.achievementIcon, { backgroundColor: achievement.bgColor }]}>
                <Ionicons name={achievement.icon as any} size={20} color={achievement.iconColor} />
              </View>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderDailyTip = () => (
    <Animated.View 
      style={[
        styles.tipCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }
          ]
        }
      ]}
    >
      <View style={[styles.tipIconWrap, { backgroundColor: '#E0E7FF' }]}>
        <Ionicons name={dailyTip.icon as any} size={16} color="#4F46E5" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tipTitle}>{dailyTip.title}</Text>
        <Text style={styles.tipText}>{dailyTip.message}</Text>
      </View>
    </Animated.View>
  );

  const renderRecommended = () => (
    <View style={styles.recommendedSection}>
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.recommendedScrollContainer}
        nestedScrollEnabled={true}
      >
        {recommendedCourses.map((c, index) => (
          <Animated.View
            key={c.id}
            style={{
              opacity: cardAnimations[Math.min(index, 3)],
              transform: [
                {
                  translateX: cardAnimations[Math.min(index, 3)].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }
              ]
            }}
          >
            <TouchableOpacity 
              style={styles.recoCard} 
              activeOpacity={0.8} 
              onPress={() => navigation.navigate('Courses')}
              pressRetentionOffset={{ top: 20, left: 20, bottom: 20, right: 20 }}
            >
              <View style={[styles.recoBadge, { backgroundColor: c.color }]}>
                <Ionicons name="play" size={12} color="#fff" />
              </View>
              <Text style={styles.recoTitle} numberOfLines={2}>{c.title}</Text>
              <Text style={styles.recoSub}>{c.level}</Text>
              <View style={styles.recoTrack}><View style={[styles.recoFill, { width: `${Math.round(c.progress * 100)}%`, backgroundColor: c.color }]} /></View>
              <Text style={styles.recoHint}>{Math.round(c.progress * 100)}% complete</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );

  const renderMarket = () => (
    <View style={styles.marketSection}>
      <Text style={styles.sectionTitle}>Market Snapshot</Text>
      <View style={styles.marketList}>
        {trendingStocks.map((s, index) => (
          <Animated.View 
            key={s.symbol} 
            style={[
              styles.marketItem,
              {
                opacity: cardAnimations[Math.min(index, 3)],
                transform: [
                  {
                    translateX: cardAnimations[Math.min(index, 3)].interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.marketSymbolWrap}><Text style={styles.marketSymbol}>{s.symbol}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.marketName}>{s.name}</Text>
              <Text style={[styles.marketChange, { color: s.up ? '#059669' : '#DC2626' }]}>{s.change}</Text>
            </View>
            <Ionicons name={s.up ? 'trending-up' : 'trending-down'} size={16} color={s.up ? '#059669' : '#DC2626'} />
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const renderCTA = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            scale: scaleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1]
            })
          }
        ]
      }}
    >
      <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.bigCTA} 
        onPress={() => navigation.navigate('Courses')}
        pressRetentionOffset={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <View style={styles.ctaLeft}>
          <Ionicons name="sparkles" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bigCTATitle}>Continue Learning</Text>
          <Text style={styles.bigCTASub}>Pick up where you left off in Technical Analysis</Text>
        </View>
        <View style={styles.ctaRight}><Ionicons name="arrow-forward" size={16} color="#fff" /></View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    showBootLoader ? (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <LogoLoader message="Loading Investa..." fullscreen />
      </View>
    ) : (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0891B2" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        nestedScrollEnabled={true}
        bounces={true}
        overScrollMode="always"
        scrollEventThrottle={16}
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
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    ...Platform.select({
      ios: {
        // iOS specific optimizations
      },
      android: {
        // Android specific optimizations
        backgroundColor: '#F9FAFB',
      },
    }),
  },
  scrollView: {
    flex: 1,
    ...Platform.select({
      ios: {
        // iOS scroll optimizations
      },
      android: {
        // Android scroll optimizations
        overScrollMode: 'always',
      },
    }),
  },
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeSection: {
    margin: 12,
    backgroundColor: '#0891B2',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    minHeight: 70,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statIcon: { 
    width: 28, 
    height: 28, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8 
  },
  statValue: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 18,
    marginBottom: 4,
  },
  statLabel: { 
    color: 'rgba(255,255,255,0.9)', 
    fontSize: 12,
    fontWeight: '600',
  },
  heroAccentCircle: {
    position: 'absolute',
    left: -16,
    top: -16,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  welcomeHeader: {
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#CFFAFE',
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 15,
    color: '#CFFAFE',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  progressMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  progressPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    flex: 1,
    alignItems: 'center',
  },
  progressPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickAccessSection: {
    margin: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 18,
  },
  quickAccessCard: {
    width: Platform.OS === 'ios' ? (width - 48) / 2 : (width - 40) / 2,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: Platform.OS === 'ios' ? 18 : 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  quickAccessSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
    lineHeight: 18,
  },
  quickAccessBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  learningPathSection: {
    margin: 12,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  learningPathList: {
    gap: 16,
  },
  learningPathItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learningPathIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  learningPathContent: {
    flex: 1,
  },
  learningPathTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  learningPathDescription: {
    fontSize: 14,
    fontWeight: '500',
  },
  portfolioSection: {
    margin: 12,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  portfolioProfit: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  portfolioStat: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  portfolioValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  portfolioProfitValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 4,
  },
  portfolioLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  achievementsSection: {
    margin: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  achievementsContainer: {
    minHeight: 100,
  },
  achievementsScrollContainer: {
    paddingRight: 12,
    paddingLeft: 4,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
  },
  tipCard: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tipIconWrap: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  tipTitle: { 
    fontSize: 12, 
    color: '#6B7280', 
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: { 
    fontSize: 13, 
    color: '#1F2937', 
    lineHeight: 18,
  },
  recommendedSection: { 
    margin: 12, 
    marginTop: 8 
  },
  recommendedScrollContainer: {
    paddingRight: 12,
    paddingLeft: 4,
  },
  recoCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recoBadge: { 
    width: 28, 
    height: 28, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10 
  },
  recoTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  recoSub: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginBottom: 12,
    fontWeight: '500',
  },
  recoTrack: { 
    height: 6, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 999, 
    marginBottom: 6,
    overflow: 'hidden',
  },
  recoFill: { 
    height: '100%', 
    borderRadius: 999 
  },
  recoHint: { 
    fontSize: 11, 
    color: '#6B7280',
    fontWeight: '500',
  },
  marketSection: { 
    margin: 12, 
    marginTop: 8, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 18, 
    padding: 16, 
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  marketList: { 
    marginTop: 8 
  },
  marketItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: '#E5E7EB' 
  },
  marketSymbolWrap: { 
    width: 56 
  },
  marketSymbol: { 
    fontWeight: '800', 
    color: '#111827',
    fontSize: 15,
  },
  marketName: { 
    fontSize: 12, 
    color: '#6B7280',
    marginBottom: 3,
  },
  marketChange: { 
    fontSize: 13, 
    fontWeight: '700',
  },
  bigCTA: { 
    marginHorizontal: 12, 
    backgroundColor: '#4F46E5', 
    borderRadius: 18, 
    padding: 18, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaLeft: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  bigCTATitle: { 
    color: '#FFFFFF', 
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 3,
  },
  bigCTASub: { 
    color: 'rgba(255,255,255,0.9)', 
    fontSize: 13, 
    lineHeight: 18,
  },
  ctaRight: { 
    width: 28, 
    height: 28, 
    borderRadius: 8, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
});

export default HomeScreen;

