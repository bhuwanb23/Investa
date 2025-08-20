import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TEXT_MUTED, PRIMARY, TEXT_DARK } from '../constants/courseConstants';

type Props = {
  label?: string;
  percent: number; // 0-100
  hint?: string;
};

const ProgressCard: React.FC<Props> = ({ label = 'Progress', percent, hint }) => {
  const safePercent = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={[styles.cardLabel, { color: PRIMARY }]}>{safePercent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${safePercent}%` }]} />
      </View>
      {hint ? <Text style={styles.cardHint}>{hint}</Text> : null}
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
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { color: TEXT_MUTED, fontWeight: '700', fontSize: 12 },
  track: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, marginTop: 8 },
  fill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  cardHint: { marginTop: 6, color: TEXT_MUTED, fontSize: 12 },
});

export default ProgressCard;



