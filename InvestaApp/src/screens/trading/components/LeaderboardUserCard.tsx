import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LeaderboardUserCardProps {
  rank: number;
  username: string;
  totalValue: string;
  totalReturn: string;
  returnLabel: string;
}

const LeaderboardUserCard = ({
  rank,
  username,
  totalValue,
  totalReturn,
  returnLabel,
}: LeaderboardUserCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Your Rank</Text>
        <Ionicons name="trophy" size={20} color="#FDE047" />
      </View>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankNumber}>#{rank}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username} numberOfLines={1}>{username}</Text>
            <Text style={styles.userValue}>₹{totalValue}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.userReturn}>+{totalReturn}</Text>
          <Text style={styles.returnLabel}>{returnLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: -10,
    marginBottom: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  rankBadge: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    gap: 4,
    minWidth: 0,
    flexShrink: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 0,
    flexShrink: 1,
    maxWidth: '100%',
  },
  userValue: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  userReturn: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  returnLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default LeaderboardUserCard;

