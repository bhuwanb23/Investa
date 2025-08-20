import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TEXT_DARK, TEXT_MUTED } from '../constants/courseConstants';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  lessonsCount: number;
  quizzesCount: number;
};

const StatCard: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
  <View style={styles.statCard}>
    <View style={styles.iconCircle}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ModuleStats: React.FC<Props> = ({ lessonsCount, quizzesCount }) => {
  return (
    <View style={styles.grid}>
      <StatCard
        icon={<Ionicons name="play" size={16} color="#3B82F6" />}
        value={lessonsCount}
        label="Lessons"
      />
      <StatCard
        icon={<Ionicons name="help" size={16} color="#10B981" />}
        value={quizzesCount}
        label="Quizzes"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 12 as any,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: TEXT_DARK },
  statLabel: { fontSize: 12, color: TEXT_MUTED },
});

export default ModuleStats;


