import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_DARK, TEXT_MUTED, PRIMARY } from '../constants/courseConstants';

type Props = {
  title?: string;
  objectives: { text: string; achieved?: boolean }[];
};

const ObjectivesList: React.FC<Props> = ({ title = 'Learning Objectives', objectives }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.row, { marginBottom: 10 }]}> 
        <Ionicons name="bullseye" size={16} color={PRIMARY} />
        <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>{title}</Text>
      </View>
      {objectives.map((o, idx) => (
        <View key={idx} style={styles.objectiveRow}>
          <View style={[styles.dot, { backgroundColor: o.achieved ? '#10B981' : '#D1D5DB' }]} />
          <Text style={[styles.objectiveText, { color: o.achieved ? TEXT_DARK : TEXT_MUTED }]}>{o.text}</Text>
        </View>
      ))}
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
  objectiveRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  objectiveText: { fontSize: 13 },
});

export default ObjectivesList;



