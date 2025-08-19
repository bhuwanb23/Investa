import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Define navigation types
type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const LeaderboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  // Mock leaderboard data
  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      name: 'Rahul Sharma',
      avatar: 'https://via.placeholder.com/40',
      portfolioValue: 185000,
      totalReturn: 85.0,
      totalReturnAmount: 85000,
      tradesCount: 45,
      winRate: 78.5,
      isCurrentUser: false,
      badge: '🥇',
    },
    {
      id: 2,
      rank: 2,
      name: 'Priya Patel',
      avatar: 'https://via.placeholder.com/40',
      portfolioValue: 162000,
      totalReturn: 62.0,
      totalReturnAmount: 62000,
      tradesCount: 38,
      winRate: 71.2,
      isCurrentUser: false,
      badge: '🥈',
    },
    {
      id: 3,
      rank: 3,
      name: 'Amit Kumar',
      avatar: 'https://via.placeholder.com/40',
      portfolioValue: 148000,
      totalReturn: 48.0,
      totalReturnAmount: 48000,
      tradesCount: 52,
      winRate: 65.8,
      isCurrentUser: false,
      badge: '🥉',
    },
    {
      id: 4,
      rank: 4,
      name: 'Neha Singh',
      avatar: 'https://via.placeholder.com/40',
      portfolioValue: 135000,
      totalReturn: 35.0,
      totalReturnAmount: 35000,
      tradesCount: 29,
      winRate: 82.1,
      isCurrentUser: false,
    },
    {
      id: 5,
      rank: 5,
      name: 'Vikram Mehta',
      avatar: 'https://via.placeholder.com/40',
      portfolioValue: 128000,
      totalReturn: 28.0,
      totalReturnAmount: 28000,
      tradesCount: 41,
      winRate: 68.9,
      isCurrentUser: false,
    },
    {
      id: 6,
      rank: 12,
      name: 'You',
      avatar: 'https://via.placeholder.com/40',
      portfolioValue: 125000,
      totalReturn: 25.0,
      totalReturnAmount: 25000,
      tradesCount: 32,
      winRate: 72.5,
      isCurrentUser: true,
    },
  ];

  const timeframes = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

  const currentUser = leaderboardData.find(user => user.isCurrentUser);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Leaderboard</Text>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );

  const renderCurrentUserCard = () => (
    <View style={styles.currentUserCard}>
      <View style={styles.currentUserHeader}>
        <Text style={styles.currentUserTitle}>Your Performance</Text>
        <Text style={styles.currentUserRank}>Rank #{currentUser?.rank}</Text>
      </View>
      
      <View style={styles.currentUserStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{currentUser?.portfolioValue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Portfolio Value</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            +{currentUser?.totalReturn}%
          </Text>
          <Text style={styles.statLabel}>Total Return</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser?.tradesCount}</Text>
          <Text style={styles.statLabel}>Trades</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser?.winRate}%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
      </View>
    </View>
  );

  const renderTimeframeSelector = () => (
    <View style={styles.timeframeContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeframeContent}
      >
        {timeframes.map((timeframe) => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              selectedTimeframe === timeframe && styles.timeframeButtonActive
            ]}
            onPress={() => setSelectedTimeframe(timeframe)}
          >
            <Text style={[
              styles.timeframeText,
              selectedTimeframe === timeframe && styles.timeframeTextActive
            ]}>
              {timeframe}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderLeaderboardItem = (user: any, index: number) => {
    const isPositive = user.totalReturn >= 0;
    const returnColor = isPositive ? '#10B981' : '#EF4444';

    return (
      <View style={[
        styles.leaderboardItem,
        user.isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.rankContainer}>
          {user.badge ? (
            <Text style={styles.badge}>{user.badge}</Text>
          ) : (
            <Text style={styles.rankNumber}>{user.rank}</Text>
          )}
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            {user.isCurrentUser && (
              <View style={styles.currentUserIndicator}>
                <Ionicons name="person" size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
          
          <View style={styles.userDetails}>
            <Text style={[
              styles.userName,
              user.isCurrentUser && styles.currentUserName
            ]}>
              {user.name}
            </Text>
            <Text style={styles.userStats}>
              {user.tradesCount} trades • {user.winRate}% win rate
            </Text>
          </View>
        </View>

        <View style={styles.performanceInfo}>
          <Text style={styles.portfolioValue}>
            ₹{user.portfolioValue.toLocaleString()}
          </Text>
          <View style={styles.returnContainer}>
            <Ionicons 
              name={isPositive ? "trending-up" : "trending-down"} 
              size={14} 
              color={returnColor} 
            />
            <Text style={[styles.returnText, { color: returnColor }]}>
              {isPositive ? '+' : ''}{user.totalReturn}%
            </Text>
          </View>
          <Text style={styles.returnAmount}>
            ₹{user.totalReturnAmount.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderTopPerformers = () => (
    <View style={styles.topPerformersContainer}>
      <Text style={styles.sectionTitle}>Top Performers</Text>
      <View style={styles.topPerformersGrid}>
        {leaderboardData.slice(0, 3).map((user, index) => (
          <View key={user.id} style={styles.topPerformerCard}>
            <View style={styles.topPerformerRank}>
              <Text style={styles.topPerformerBadge}>{user.badge}</Text>
            </View>
            <View style={styles.topPerformerAvatar}>
              <Text style={styles.topPerformerAvatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.topPerformerName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.topPerformerReturn}>
              +{user.totalReturn}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentUserCard()}
        {renderTimeframeSelector()}
        {renderTopPerformers()}
        
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>All Participants</Text>
          {leaderboardData.map((user, index) => renderLeaderboardItem(user, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  currentUserCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  currentUserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentUserTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  currentUserRank: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentUserStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeframeContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginBottom: 8,
  },
  timeframeContent: {
    paddingHorizontal: 16,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  timeframeButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeframeTextActive: {
    color: '#2563EB',
  },
  topPerformersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  topPerformersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topPerformerCard: {
    alignItems: 'center',
    flex: 1,
  },
  topPerformerRank: {
    marginBottom: 8,
  },
  topPerformerBadge: {
    fontSize: 24,
  },
  topPerformerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  topPerformerAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  topPerformerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  topPerformerReturn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  leaderboardSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  currentUserItem: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  badge: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  currentUserIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  currentUserName: {
    color: '#2563EB',
  },
  userStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  performanceInfo: {
    alignItems: 'flex-end',
  },
  portfolioValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  returnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  returnText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  returnAmount: {
    fontSize: 10,
    color: '#6B7280',
  },
});

export default LeaderboardScreen;
