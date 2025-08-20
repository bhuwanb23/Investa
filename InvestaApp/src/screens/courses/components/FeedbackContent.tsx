import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CARD_BG, BORDER, TEXT_DARK, TEXT_MUTED, PRIMARY } from '../constants/courseConstants';

const FeedbackContent: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  const ratingLabels: Record<number, string> = useMemo(() => ({
    1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
  }), []);

  const tags = [
    'Easy to Understand',
    'Great Examples',
    'Perfect Pace',
    'Good Structure',
    'Quality Content',
    'Practical',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const submit = () => {
    // Placeholder submission handler
    setRating(0);
    setSelectedTags([]);
    setFeedback('');
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      {/* Course Rating Overview */}
      <View style={styles.card}> 
        <View style={{ alignItems: 'center' }}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={22} color={PRIMARY} />
          </View>
          <Text style={styles.headline}>JavaScript Fundamentals</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons key={i} name="star" size={16} color="#FBBF24" style={{ marginRight: 6 }} />
            ))}
            <Text style={styles.bigScore}>4.8</Text>
          </View>
          <Text style={styles.caption}>Based on 2,847 reviews</Text>
        </View>
      </View>

      {/* Rating Section */}
      <View style={styles.card}> 
        <Text style={styles.sectionTitle}>Rate this course</Text>
        <View style={styles.centerRow}>
          {Array.from({ length: 5 }).map((_, idx) => {
            const val = idx + 1;
            const active = rating >= val;
            return (
              <TouchableOpacity key={val} onPress={() => setRating(val)}>
                <Ionicons name="star" size={28} color={active ? '#F59E0B' : '#D1D5DB'} style={{ marginHorizontal: 6 }} />
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.centerCaption}>{rating ? ratingLabels[rating] : 'Tap to rate'}</Text>
      </View>

      {/* Quick Tags */}
      <View style={styles.card}> 
        <Text style={styles.sectionTitle}>What did you like most?</Text>
        <View style={styles.tagsGrid}>
          {tags.map(tag => {
            const active = selectedTags.includes(tag);
            return (
              <TouchableOpacity key={tag} style={[styles.tagBtn, active && styles.tagActive]} onPress={() => toggleTag(tag)}>
                <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Comments */}
      <View style={styles.card}> 
        <Text style={styles.sectionTitle}>Share your thoughts</Text>
        <TextInput
          placeholder="Tell us what you think about this course. Your feedback helps us improve..."
          placeholderTextColor={TEXT_MUTED}
          value={feedback}
          onChangeText={setFeedback}
          style={styles.textarea}
          multiline
          maxLength={500}
        />
        <View style={styles.rowBetween}> 
          <Text style={styles.counter}>{feedback.length}/500 characters</Text>
          <View style={styles.rowCenter}> 
            <Ionicons name="shield-half-outline" size={14} color={TEXT_MUTED} style={{ marginRight: 6 }} />
            <Text style={styles.caption}>Anonymous feedback</Text>
          </View>
        </View>
      </View>

      {/* Submit */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
        <Text style={[styles.caption, { textAlign: 'center', marginTop: 10 }]}>Your feedback helps us create better learning experiences</Text>
      </View>

      {/* Thank you (not persisted) */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  headline: { fontSize: 16, fontWeight: '800', color: TEXT_DARK, marginBottom: 8 },
  starsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bigScore: { marginLeft: 8, fontSize: 22, fontWeight: '900', color: TEXT_DARK },
  caption: { fontSize: 12, color: TEXT_MUTED },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: TEXT_DARK, marginBottom: 10 },
  centerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  centerCaption: { textAlign: 'center', fontSize: 12, color: TEXT_MUTED },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 as any },
  tagBtn: { borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  tagActive: { backgroundColor: '#EFF6FF', borderColor: '#60A5FA' },
  tagText: { color: '#374151', fontWeight: '600', fontSize: 13 },
  tagTextActive: { color: '#2563EB' },
  textarea: { minHeight: 120, borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 12, color: TEXT_DARK },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  counter: { fontSize: 11, color: '#9CA3AF' },
  submitBtn: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontWeight: '800' },
});

export default FeedbackContent;


