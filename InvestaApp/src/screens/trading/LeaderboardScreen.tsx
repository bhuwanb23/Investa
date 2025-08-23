import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LEADERBOARD_DATA } from './constants/tradingConstants';
import useLeaderboardData from '../trading/hooks/useLeaderboardData';
import MainHeader from '../../components/MainHeader';
import LeaderboardUserCard from './components/LeaderboardUserCard';

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Trading: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const LeaderboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTimeframe, setSelectedTimeframe] = useState('Weekly');
  const { currentUser, topUsers, highlights } = useLeaderboardData(LEADERBOARD_DATA);
  const podiumAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const timeframes = ['Weekly', 'Monthly', 'All-time'];

  // Data now comes from hook

  const handleBack = () => {
    navigation.navigate('Trading');
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  useEffect(() => {
    Animated.spring(podiumAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 50,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <MainHeader title="Leaderboard" iconName="trophy" showBackButton onBackPress={handleBack} />
    </View>
  );

  const renderUserRankCard = () => (
    <LeaderboardUserCard
      rank={currentUser?.rank || 47}
      username={currentUser?.username || '@traderpro_alex'}
      totalValue={currentUser?.totalValue || '125,840'}
      totalReturn={currentUser?.totalReturn || '24.8%'}
      returnLabel="This month"
    />
  );

  const renderTimeFilter = () => (
    <View style={styles.timeFilterContainer}>
      <View style={styles.timeFilterButtons}>
        {timeframes.map((timeframe) => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeFilterButton,
              selectedTimeframe === timeframe && styles.timeFilterButtonActive
            ]}
            onPress={() => handleTimeframeChange(timeframe)}
          >
            <Text
              style={[
                styles.timeFilterText,
                selectedTimeframe === timeframe && styles.timeFilterTextActive
              ]}
            >
              {timeframe}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPodium = () => {
    const top3 = topUsers.slice(0, 3);
    return (
      <View style={styles.podiumContainer}>
        <Animated.View style={[
          styles.podiumRow,
          { transform: [{ translateY: podiumAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] },
          { opacity: podiumAnim },
        ]}>
          {/* 2nd Place */}
          <View style={styles.podiumItem}>
            <View style={styles.podiumAvatar}>
              <Image
                source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg' }}
                style={styles.avatarImage}
              />
              <View style={styles.rankBadgeSmall}>
                <Text style={styles.rankBadgeText}>2</Text>
              </View>
            </View>
            <View style={styles.podiumInfo}>
              <Text style={styles.podiumUsername}>{top3[1]?.username || '@mike_trades'}</Text>
              <Text style={styles.podiumReturn}>+{top3[1]?.totalReturn || '42.1%'}</Text>
            </View>
          </View>

          {/* 1st Place */}
          <View style={styles.podiumItem}>
            <View style={styles.podiumAvatar}>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: 'rgba(245, 158, 11, 0.25)',
                  transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.15] }) }],
                  opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.9] }),
                }}
              />
              <Image
                source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' }}
                style={[styles.avatarImage, styles.firstPlaceAvatar]}
              />
              <View style={styles.crownBadge}>
                <Ionicons name="trophy" size={12} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.podiumInfo}>
              <Text style={styles.podiumUsername}>{top3[0]?.username || '@sarah_investor'}</Text>
              <Text style={styles.podiumReturn}>+{top3[0]?.totalReturn || '58.3%'}</Text>
              <Text style={styles.podiumValue}>₹{top3[0]?.totalValue || '187,920'}</Text>
            </View>
          </View>

          {/* 3rd Place */}
          <View style={styles.podiumItem}>
            <View style={styles.podiumAvatar}>
              <Image
                source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' }}
                style={styles.avatarImage}
              />
              <View style={styles.rankBadgeSmall}>
                <Text style={styles.rankBadgeText}>3</Text>
              </View>
            </View>
            <View style={styles.podiumInfo}>
              <Text style={styles.podiumUsername}>{top3[2]?.username || '@crypto_king'}</Text>
              <Text style={styles.podiumReturn}>+{top3[2]?.totalReturn || '38.7%'}</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderLeaderboardList = () => (
    <View style={styles.leaderboardList}>
      {topUsers.slice(3, 20).map((user: any, index: number) => (
        <Animated.View
          key={user.rank}
          style={[
            styles.leaderboardItem,
            {
              transform: [{ translateY: podiumAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
              opacity: podiumAnim,
            },
          ]}
        >
          <View style={styles.leaderboardLeft}>
            <View style={styles.rankNumberSmall}>
              <Text style={styles.rankNumberText}>{user.rank}</Text>
            </View>
            <Image
              source={{ uri: `https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-${(user.rank % 20) + 1}.jpg` }}
              style={styles.userAvatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.username}</Text>
              <Text style={styles.leaderboardUserValue}>₹{user.totalValue}</Text>
            </View>
          </View>
          <View style={styles.leaderboardRight}>
            <Text style={styles.userReturnText}>+{user.totalReturn}</Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderHighlights = () => (
    <View style={styles.highlightsSection}>
      <View style={styles.highlightsRow}>
        {highlights.map((h: any, i: number) => (
          <View
            key={h.label}
            style={[styles.highlightCard, { borderColor: h.color }, i < highlights.length - 1 && { marginRight: 10 }]}
          >
            <Text style={styles.highlightLabel}>{h.label}</Text>
            <Text style={[styles.highlightValue, { color: h.color }]}>{h.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {renderUserRankCard()}
        {renderTimeFilter()}
        {renderHighlights()}
        {renderPodium()}
        {renderLeaderboardList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
  userRankCard: {
    marginHorizontal: 16,
    marginTop: -12,
    marginBottom: 16,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userRankLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    gap: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userValue: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userRankRight: {
    alignItems: 'flex-end',
  },
  userReturn: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userReturnLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  timeFilterContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  timeFilterButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  timeFilterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  timeFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeFilterTextActive: {
    color: '#FFFFFF',
  },
  podiumContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
  },
  podiumItem: {
    alignItems: 'center',
  },
  podiumAvatar: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  firstPlaceAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  rankBadgeSmall: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#9CA3AF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  crownBadge: {
    position: 'absolute',
    top: -8,
    right: -4,
    width: 28,
    height: 28,
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    minHeight: 56,
    alignItems: 'center',
  },
  podiumUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  podiumReturn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  podiumValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  leaderboardList: {
    marginHorizontal: 16,
    gap: 8,
  },
  leaderboardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankNumberSmall: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userDetails: {
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  leaderboardUserValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  leaderboardRight: {
    alignItems: 'flex-end',
  },
  userReturnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  followButton: {
    marginTop: 4,
  },
  followButtonText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  highlightsSection: {
    marginBottom: 12,
  },
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  highlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    flex: 1,
  },
  highlightLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: '800',
  },
});

export default LeaderboardScreen;
