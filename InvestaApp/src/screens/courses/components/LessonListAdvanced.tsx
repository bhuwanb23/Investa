import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, TEXT_DARK, TEXT_MUTED } from '../constants/courseConstants';

export type LessonState = 'completed' | 'progress' | 'available' | 'locked';

export type LessonItem = {
  id: number;
  title: string;
  minutes: number;
  state: LessonState;
  progress?: number; // for 'progress'
};

type Props = {
  lessons: LessonItem[];
  onStart: (lessonId: number) => void;
  onContinue: (lessonId: number) => void;
};

const LessonListAdvanced: React.FC<Props> = ({ lessons, onStart, onContinue }) => {
  return (
    <View>
      {lessons.map((l, idx) => {
        if (l.state === 'completed') {
          return (
            <View key={l.id} style={styles.itemCard}>
              <View style={styles.row}>
                <View style={[styles.circle, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="checkmark" size={14} color="#16A34A" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemMetaRow}>
                    <Text style={styles.itemMeta}>LESSON {idx + 1}</Text>
                    <Ionicons name="play-circle" size={14} color={PRIMARY} />
                  </View>
                  <Text style={styles.itemTitle}> {l.title} </Text>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.itemSmall, { color: '#16A34A' }]}>Completed</Text>
                    <Text style={styles.itemSmall}>{l.minutes} min</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }

        if (l.state === 'progress') {
          return (
            <View key={l.id} style={[styles.itemCard, { borderWidth: 2, borderColor: '#BFDBFE', shadowOpacity: 0.08 }] }>
              <View style={styles.row}>
                <View style={[styles.circle, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={{ color: '#2563EB', fontSize: 12, fontWeight: '700' }}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemMetaRow}>
                    <Text style={[styles.itemMeta, { color: '#2563EB' }]}>LESSON {idx + 1} • IN PROGRESS</Text>
                    <Ionicons name="bar-chart" size={14} color="#F59E0B" />
                  </View>
                  <Text style={styles.itemTitle}> {l.title} </Text>
                  <View style={{ marginTop: 8 }}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.itemSmall, { color: '#2563EB' }]}>{l.progress || 0}% Complete</Text>
                      <Text style={styles.itemSmall}>{l.minutes} min</Text>
                    </View>
                    <View style={styles.smallTrack}><View style={[styles.smallFill, { width: `${l.progress || 0}%` }]} /></View>
                  </View>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => onContinue(l.id)}>
                    <Text style={styles.primaryBtnText}>Continue Lesson</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }

        if (l.state === 'available') {
          return (
            <View key={l.id} style={styles.itemCard}>
              <View style={styles.row}>
                <View style={[styles.circle, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: '700' }}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemMetaRow}>
                    <Text style={styles.itemMeta}>LESSON {idx + 1}</Text>
                    <Ionicons name="play-circle" size={14} color={PRIMARY} />
                  </View>
                  <Text style={styles.itemTitle}> {l.title} </Text>
                  <View style={styles.rowBetween}>
                    <TouchableOpacity style={styles.darkBtn} onPress={() => onStart(l.id)}>
                      <Text style={styles.darkBtnText}>Start Lesson</Text>
                    </TouchableOpacity>
                    <Text style={styles.itemSmall}>{l.minutes} min</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }

        return (
          <View key={l.id} style={[styles.itemCard, { opacity: 0.6 }] }>
            <View style={styles.row}>
              <View style={[styles.circle, { backgroundColor: '#E5E7EB' }]}>
                <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.itemMetaRow}>
                  <Text style={[styles.itemMeta, { color: '#9CA3AF' }]}>LESSON {idx + 1}</Text>
                  <Ionicons name="bar-chart" size={14} color="#9CA3AF" />
                </View>
                <Text style={[styles.itemTitle, { color: '#6B7280' }]}> {l.title} </Text>
                <View style={styles.rowBetween}>
                  <Text style={[styles.itemSmall, { color: '#9CA3AF' }]}>Complete previous lessons</Text>
                  <Text style={[styles.itemSmall, { color: '#9CA3AF' }]}>{l.minutes} min</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 } as any,
  circle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  itemMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemMeta: { fontSize: 11, color: TEXT_MUTED, fontWeight: '700' },
  itemTitle: { fontSize: 14, color: TEXT_DARK, fontWeight: '700', marginTop: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  itemSmall: { fontSize: 11, color: TEXT_MUTED },
  smallTrack: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 999, marginTop: 6 },
  smallFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 999 },
  primaryBtn: { marginTop: 10, backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  darkBtn: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  darkBtnText: { color: '#fff', fontWeight: '700' },
});

export default LessonListAdvanced;



