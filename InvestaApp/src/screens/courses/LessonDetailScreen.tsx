import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import MainHeader from '../../components/MainHeader';
import { Ionicons } from '@expo/vector-icons';
import { PAGE_BG, TEXT_DARK, TEXT_MUTED, BORDER, CARD_BG, PRIMARY } from './constants/courseConstants';
import { fetchLessonDetail, markLessonCompleted } from './utils/coursesApi';
import { useTranslation } from '../../language';
import VideoPlayer from './components/VideoPlayer';
import MarkdownRenderer from './components/MarkdownRenderer';

// Local-first lesson detail with backend when available
type Language = { id: number; code: string; name: string; native_name: string };
type Course = { id: number; title: string; description: string; language: Language; difficulty_level: 'beginner'|'intermediate'|'advanced'; estimated_duration: number };
type LessonDetail = { id: number; title: string; order: number; estimated_duration: number; content?: string; video_url?: string | null; course: Course };

type ParamList = {
  LessonDetail: { lessonId: string; courseId?: string };
};

const LessonDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<ParamList, 'LessonDetail'>>();
  const { t } = useTranslation();
  
  // Debug log to verify language is working
  
  const lessonId = Number(route.params?.lessonId);
  const courseId = route.params?.courseId;
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  // TODO: Phase 2 — replace with real Ollama/Gemini integration

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      if (Number.isFinite(lessonId) && lessonId > 0) {
        const data = await fetchLessonDetail(lessonId);
        setLesson({
          id: data.id,
          title: data.title,
          order: data.order,
          estimated_duration: data.estimated_duration,
          content: data.content,
          video_url: data.video_url || undefined,
          course: data.course as any,
        });
      } else {
        setError(t.lessonNotFound || 'Lesson not found');
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || t.failedToLoadLesson || 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkCompleted = async () => {
    try {
      setCompleting(true);
      await markLessonCompleted(lessonId);
      setCompleted(true);
      
      // Navigate back to lesson list with completion info
      setTimeout(() => {
        navigation.navigate('LessonList', { 
          completedLessonId: lessonId, 
          courseId: courseId,
          lessonCompleted: true // Add this flag to indicate completion
        });
      }, 300);
    } catch (e) {
      console.error('Error marking lesson as completed:', e);
      // Still reflect completion locally and navigate
      setCompleted(true);
      setTimeout(() => {
        navigation.navigate('LessonList', { 
          completedLessonId: lessonId, 
          courseId: courseId,
          lessonCompleted: true
        });
      }, 300);
    } finally {
      setCompleting(false);
    }
  };

  const renderAiTutorStub = () => (
    <View style={styles.aiTutorContainer}>
      <View style={styles.aiTutorHeader}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#9CA3AF" />
        <Text style={styles.aiTutorTitle}>AI Tutor</Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonBadgeText}>Coming Soon</Text>
        </View>
      </View>
      <Text style={styles.aiTutorDescription}>
        Get personalized help with this lesson from our AI assistant.
      </Text>
      <TouchableOpacity
        style={styles.aiTutorButtonDisabled}
        activeOpacity={1}
        onPress={() => Alert.alert('AI Tutor', 'AI tutor launches in a future update.')}
      >
        <Ionicons name="help-circle" size={20} color="#9CA3AF" />
        <Text style={styles.aiTutorButtonTextDisabled}>Ask a Question</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[0]}>
        <MainHeader title={lesson?.title || t.lesson} iconName="book" showBackButton onBackPress={() => navigation.goBack()} />
        
        {loading ? (
          <View style={styles.center}> 
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>{t.loadingLesson || 'Loading lesson…'}</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>{t.retry}</Text>
            </TouchableOpacity>
          </View>
        ) : lesson ? (
          <View>
            {/* Lesson video */}
            <VideoPlayer videoUrl={lesson.video_url} title={lesson.title} />

            {/* AI Tutor (coming soon) — Phase 2 */}
            {renderAiTutorStub()}

            {/* Content (markdown rendered) */}
            <MarkdownRenderer content={lesson.content || ''} />

            {/* Progress */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeading}>{t.yourProgress || 'Your Progress'}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFillStrong, { width: `${Math.min(100, (lesson.estimated_duration / 20) * 20)}%` }]} />
              </View>
              <Text style={styles.smallMuted}>{t.estimated} {lesson.estimated_duration} {t.minutes}</Text>
            </View>

            {/* Quiz Section */}
            <View style={styles.quizSection}>
              <View style={styles.quizHeader}>
                <Ionicons name="help-circle" size={24} color="#10B981" />
                <Text style={styles.quizTitle}>Ready to Test Your Knowledge?</Text>
              </View>
              <Text style={styles.quizDescription}>
                Take a quick quiz to reinforce what you've learned in this lesson.
              </Text>
              <TouchableOpacity 
                style={styles.quizButton}
                onPress={() => (navigation as any).navigate('LessonQuiz', { lessonId: String(lessonId), courseId })}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text style={styles.quizButtonText}>Start Quiz</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, completed && { backgroundColor: '#10B981' }]}
              onPress={() => {
                handleMarkCompleted();
              }}
              disabled={completing}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {completed ? t.completed : (completing ? (t.marking || 'Marking…') : t.markAsComplete)}
              </Text>
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.secondaryBtnOutline, { borderColor: '#E5E7EB' }]} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={14} color={TEXT_DARK} />
                <Text style={styles.secondaryBtnOutlineText}>{t.backToLessons || 'Back to Lessons'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  scroll: { paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 10, color: TEXT_MUTED },
  errorText: { color: '#DC2626', marginBottom: 12 },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: PRIMARY, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700' },
  primaryBtn: { 
    backgroundColor: PRIMARY, 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: 12,
    minHeight: 48,
  },
  primaryBtnText: { 
    color: '#fff', 
    fontWeight: '800',
    fontSize: 14,
  },
  cardSection: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 14, marginBottom: 16, marginHorizontal: 12 },
  sectionHeading: { color: TEXT_DARK, fontWeight: '800', marginBottom: 8 },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  progressFillStrong: { height: '100%', backgroundColor: PRIMARY, borderRadius: 999 },
  smallMuted: { color: TEXT_MUTED, fontSize: 12, marginTop: 6 },
  actionsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12, 
    marginHorizontal: 12,
    gap: 8,
  },
  secondaryBtnOutline: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    borderWidth: 1, 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  secondaryBtnOutlineText: { 
    color: TEXT_DARK, 
    fontWeight: '700',
    fontSize: 13,
  },
  aiTutorContainer: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 12,
    opacity: 0.7,
  },
  aiTutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTutorTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
  },
  comingSoonBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  comingSoonBadgeText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
  },
  aiTutorDescription: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginBottom: 16,
  },
  aiTutorButtonDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    minHeight: 40,
  },
  aiTutorButtonTextDisabled: {
    color: '#9CA3AF',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 13,
  },
  quizSection: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
  },
  quizDescription: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginBottom: 16,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    minHeight: 40,
  },
  quizButtonText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 13,
  },
});

export default LessonDetailScreen;


