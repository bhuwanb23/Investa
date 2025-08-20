import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson } from '../utils/coursesApi';
import { BORDER, CARD_BG, TEXT_DARK, TEXT_MUTED, PRIMARY } from '../constants/courseConstants';

type Props = {
  lessons: Lesson[];
  onPressLesson: (lessonId: number) => void;
};

const LessonList: React.FC<Props> = ({ lessons, onPressLesson }) => {
  return (
    <View style={styles.container}>
      {lessons.map((l) => (
        <TouchableOpacity key={l.id} style={styles.item} onPress={() => onPressLesson(l.id)} activeOpacity={0.85}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: PRIMARY + '22' }]}>
              <Ionicons name="play" size={16} color={PRIMARY} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{l.order}. {l.title}</Text>
              <Text style={styles.meta}>{l.estimated_duration} mins</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={TEXT_MUTED} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  title: {
    color: TEXT_DARK,
    fontWeight: '800',
    fontSize: 13,
  },
  meta: {
    color: TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },
});

export default LessonList;


