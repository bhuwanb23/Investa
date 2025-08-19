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
            <Text style={styles.username}>{username}</Text>
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
  },
  leftSection: {
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
  rightSection: {
    alignItems: 'flex-end',
  },
  userReturn: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  returnLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default LeaderboardUserCard;

