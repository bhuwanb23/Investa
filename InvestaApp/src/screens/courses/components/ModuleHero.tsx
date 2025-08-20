import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, TEXT_DARK } from '../constants/courseConstants';

type Props = {
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: string;
};

const ModuleHero: React.FC<Props> = ({ title, description, durationMinutes, difficulty }) => {
  return (
    <View style={styles.hero}>
      <View style={styles.heroBubble} />
      <View style={{ position: 'relative', zIndex: 1 }}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>{description}</Text>
        <View style={styles.heroMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#fff" />
            <Text style={styles.metaText}>{durationMinutes} mins</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="bar-chart" size={14} color="#fff" />
            <Text style={styles.metaText}>{difficulty}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  heroBubble: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#ffffff22',
  },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 6 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)' },
  heroMetaRow: { flexDirection: 'row', gap: 14, marginTop: 10 } as any,
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 } as any,
  metaText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});

export default ModuleHero;



