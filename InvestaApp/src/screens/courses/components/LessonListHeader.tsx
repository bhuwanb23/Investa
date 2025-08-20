import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_DARK, TEXT_MUTED, PRIMARY } from '../constants/courseConstants';

type Props = {
  title: string;
  completed: number;
  total: number;
  onBack: () => void;
};

const LessonListHeader: React.FC<Props> = ({ title, completed, total, onBack }) => {
  return (
    <View>
      <View style={styles.header}> 
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={18} color="#374151" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.headerSub}>{completed} of {total} lessons completed</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color="#374151" />
        </TouchableOpacity>
      </View>
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(total ? (completed/total) : 0) * 100}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  headerSub: { fontSize: 12, color: TEXT_MUTED },
  progressWrap: { paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#fff' },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999 },
  progressFill: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
});

export default LessonListHeader;



