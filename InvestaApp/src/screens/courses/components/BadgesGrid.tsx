import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_DARK, TEXT_MUTED } from '../constants/courseConstants';

type Badge = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  highlighted?: boolean;
};

type Props = {
  title?: string;
  badges: Badge[];
};

const BadgesGrid: React.FC<Props> = ({ title = 'Earn Badges', badges }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.row, { marginBottom: 12 }]}> 
        <Ionicons name="medal" size={16} color="#F59E0B" />
        <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>{title}</Text>
      </View>
      <View style={styles.badgeGrid}>
        {badges.map((b, idx) => (
          <View key={idx} style={[styles.badgeItem, !b.highlighted && styles.badgeItemDim]}> 
            <View style={[b.highlighted ? styles.badgeIconPrimary : styles.badgeIconDim]}>
              <Ionicons name={b.icon} size={16} color={b.highlighted ? '#fff' : '#9CA3AF'} />
            </View>
            <Text style={b.highlighted ? styles.badgeTitle : styles.badgeTitleDim}>{b.title}</Text>
            <Text style={b.highlighted ? styles.badgeSub : styles.badgeSubDim}>{b.subtitle}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: TEXT_DARK, fontWeight: '800' },
  badgeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeItem: { width: '32%', alignItems: 'center' },
  badgeIconPrimary: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeIconDim: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeTitle: { fontSize: 12, fontWeight: '700', color: TEXT_DARK },
  badgeSub: { fontSize: 11, color: TEXT_MUTED },
  badgeItemDim: { opacity: 0.6 },
  badgeTitleDim: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
  badgeSubDim: { fontSize: 11, color: '#9CA3AF' },
});

export default BadgesGrid;



