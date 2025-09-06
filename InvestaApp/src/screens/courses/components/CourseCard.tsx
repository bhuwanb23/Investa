import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../utils/coursesApi';
import { CARD_BG, BORDER, TEXT_DARK, TEXT_MUTED, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../constants/courseConstants';
import { useTranslation } from '../../../language';

type Props = {
  course: Course;
  onPress: () => void;
};

const CourseCard: React.FC<Props> = ({ course, onPress }) => {
  const { t } = useTranslation();
  const color = DIFFICULTY_COLORS[course.difficulty_level];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.thumbnailWrap}>
        {course.thumbnail ? (
          <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Ionicons name="image" size={22} color="#9CA3AF" />
          </View>
        )}
        <View style={[styles.levelBadge, { backgroundColor: color + '22' }]}> 
          <Text style={[styles.levelText, { color }]}>{DIFFICULTY_LABELS[course.difficulty_level]}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{course.description}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={TEXT_MUTED} />
            <Text style={styles.metaText}>{course.estimated_duration} {t.minutes}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="language" size={14} color={TEXT_MUTED} />
            <Text style={styles.metaText}>{course.language?.name || 'English'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbnailWrap: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 140,
  },
  thumbnailPlaceholder: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  description: {
    marginTop: 6,
    color: TEXT_MUTED,
    fontSize: 12,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
  },
  metaText: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CourseCard;


